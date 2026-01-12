/**
 * Feedback Widget Template - Submit Feedback Edge Function (Basic/Standard Tier)
 * 
 * This function handles feedback submission WITHOUT AI enhancement.
 * Use this for Basic and Standard tier configurations.
 * 
 * Security Features:
 * - Rate limiting (configurable)
 * - Input validation and sanitization
 * - Safe error messages
 * - CORS configuration
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Configure for production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Configuration - adjust for your needs
const CONFIG = {
  MAX_TEXT_LENGTH: 5000,
  MAX_CONTEXT_SIZE: 10000,
  RATE_LIMIT_PER_HOUR: 50,
  RATE_LIMIT_WINDOW_MINUTES: 60,
}

// Valid categories and severities
const VALID_CATEGORIES = ['bug', 'feature', 'ui_ux', 'suggestion', 'other']
const VALID_SEVERITIES = ['low', 'medium', 'high', 'critical']

interface FeedbackPayload {
  raw_text: string
  category?: string
  severity?: string
  page_url?: string
  target_element?: {
    selector: string
    tagName: string
    textPreview?: string
    boundingRect?: DOMRect
  }
  device_type?: string
  context?: Record<string, unknown>
}

// Sanitize text input - remove potential XSS
function sanitizeText(text: string): string {
  if (!text) return ''
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, CONFIG.MAX_TEXT_LENGTH)
}

// Validate and sanitize payload
function validatePayload(payload: unknown): { valid: boolean; data?: FeedbackPayload; error?: string } {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Invalid request body' }
  }

  const data = payload as Record<string, unknown>

  // Required field
  if (!data.raw_text || typeof data.raw_text !== 'string') {
    return { valid: false, error: 'Feedback text is required' }
  }

  const sanitizedText = sanitizeText(data.raw_text)
  if (sanitizedText.length < 5) {
    return { valid: false, error: 'Feedback text too short (minimum 5 characters)' }
  }

  // Validate category
  let category = 'other'
  if (data.category && typeof data.category === 'string') {
    category = VALID_CATEGORIES.includes(data.category) ? data.category : 'other'
  }

  // Validate severity
  let severity = 'medium'
  if (data.severity && typeof data.severity === 'string') {
    severity = VALID_SEVERITIES.includes(data.severity) ? data.severity : 'medium'
  }

  // Validate page_url
  let page_url: string | undefined
  if (data.page_url && typeof data.page_url === 'string') {
    try {
      new URL(data.page_url)
      page_url = data.page_url.slice(0, 2000)
    } catch {
      // Invalid URL, skip
    }
  }

  // Validate target_element
  let target_element: FeedbackPayload['target_element'] | undefined
  if (data.target_element && typeof data.target_element === 'object') {
    const el = data.target_element as Record<string, unknown>
    if (el.selector && typeof el.selector === 'string' && el.tagName && typeof el.tagName === 'string') {
      target_element = {
        selector: String(el.selector).slice(0, 500),
        tagName: String(el.tagName).slice(0, 50),
        textPreview: el.textPreview ? String(el.textPreview).slice(0, 200) : undefined,
        boundingRect: el.boundingRect as DOMRect | undefined,
      }
    }
  }

  // Validate device_type
  let device_type: string | undefined
  if (data.device_type && typeof data.device_type === 'string') {
    device_type = ['mobile', 'tablet', 'desktop'].includes(data.device_type) 
      ? data.device_type 
      : undefined
  }

  // Validate context (limit size)
  let context: Record<string, unknown> | undefined
  if (data.context && typeof data.context === 'object') {
    const contextStr = JSON.stringify(data.context)
    if (contextStr.length <= CONFIG.MAX_CONTEXT_SIZE) {
      context = data.context as Record<string, unknown>
    }
  }

  return {
    valid: true,
    data: {
      raw_text: sanitizedText,
      category,
      severity,
      page_url,
      target_element,
      device_type,
      context,
    },
  }
}

// Check rate limit
async function checkRateLimit(
  supabase: ReturnType<typeof createClient>,
  identifier: string
): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - CONFIG.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString()

  const { count, error } = await supabase
    .from('feedback')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', windowStart)
    .or(`user_id.eq.${identifier},context->ip.eq."${identifier}"`)

  if (error) {
    console.error('Rate limit check error:', error)
    // Fail open but log
    return { allowed: true, remaining: CONFIG.RATE_LIMIT_PER_HOUR }
  }

  const used = count || 0
  const remaining = Math.max(0, CONFIG.RATE_LIMIT_PER_HOUR - used)

  return {
    allowed: used < CONFIG.RATE_LIMIT_PER_HOUR,
    remaining,
  }
}

// Get client IP from headers
function getClientIP(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Parse request body
    let payload: unknown
    try {
      payload = await req.json()
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate payload
    const validation = validatePayload(payload)
    if (!validation.valid || !validation.data) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const feedbackData = validation.data

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user ID from auth header (optional)
    let userId: string | null = null
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      userId = user?.id || null
    }

    // Rate limiting
    const identifier = userId || getClientIP(req)
    const rateLimit = await checkRateLimit(supabase, identifier)

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: CONFIG.RATE_LIMIT_WINDOW_MINUTES * 60
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(CONFIG.RATE_LIMIT_WINDOW_MINUTES * 60),
            'X-RateLimit-Remaining': '0',
          } 
        }
      )
    }

    // Add IP to context for rate limiting (anonymous users)
    const enrichedContext = {
      ...feedbackData.context,
      ip: userId ? undefined : getClientIP(req),
      userAgent: req.headers.get('user-agent')?.slice(0, 500),
    }

    // Insert feedback
    const { data: feedback, error: insertError } = await supabase
      .from('feedback')
      .insert({
        user_id: userId,
        raw_text: feedbackData.raw_text,
        category: feedbackData.category,
        severity: feedbackData.severity,
        page_url: feedbackData.page_url,
        target_element: feedbackData.target_element,
        device_type: feedbackData.device_type,
        context: enrichedContext,
        status: 'pending',
      })
      .select('id, created_at')
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to submit feedback. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: feedback.id,
        message: 'Thank you for your feedback!',
      }),
      { 
        status: 201, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': String(rateLimit.remaining - 1),
        } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
