/**
 * Feedback Widget Template - Submit Feedback with AI Enhancement (Pro Tier)
 * 
 * This function handles feedback submission WITH AI enhancement.
 * Features:
 * - AI summarization
 * - Auto-categorization
 * - Developer question generation
 * 
 * Security Features:
 * - Rate limiting (configurable)
 * - Input validation and sanitization
 * - Safe error messages
 * - CORS configuration
 * - Graceful fallback if AI fails
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
  RATE_LIMIT_PER_HOUR: 30, // Lower for AI tier due to cost
  RATE_LIMIT_WINDOW_MINUTES: 60,
  AI_TIMEOUT_MS: 15000,
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

interface AIEnhancement {
  ai_summary: string | null
  ai_category: string | null
  ai_question_for_dev: string | null
}

// Sanitize text input
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

  if (!data.raw_text || typeof data.raw_text !== 'string') {
    return { valid: false, error: 'Feedback text is required' }
  }

  const sanitizedText = sanitizeText(data.raw_text)
  if (sanitizedText.length < 5) {
    return { valid: false, error: 'Feedback text too short (minimum 5 characters)' }
  }

  let category = 'other'
  if (data.category && typeof data.category === 'string') {
    category = VALID_CATEGORIES.includes(data.category) ? data.category : 'other'
  }

  let severity = 'medium'
  if (data.severity && typeof data.severity === 'string') {
    severity = VALID_SEVERITIES.includes(data.severity) ? data.severity : 'medium'
  }

  let page_url: string | undefined
  if (data.page_url && typeof data.page_url === 'string') {
    try {
      new URL(data.page_url)
      page_url = data.page_url.slice(0, 2000)
    } catch {
      // Invalid URL, skip
    }
  }

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

  let device_type: string | undefined
  if (data.device_type && typeof data.device_type === 'string') {
    device_type = ['mobile', 'tablet', 'desktop'].includes(data.device_type) 
      ? data.device_type 
      : undefined
  }

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

// AI Enhancement using Lovable AI or OpenAI
async function enhanceWithAI(feedbackData: FeedbackPayload): Promise<AIEnhancement> {
  const defaultResult: AIEnhancement = {
    ai_summary: null,
    ai_category: null,
    ai_question_for_dev: null,
  }

  // Try Lovable AI first, fallback to OpenAI
  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

  if (!lovableApiKey && !openaiApiKey) {
    console.warn('No AI API key configured, skipping enhancement')
    return defaultResult
  }

  const systemPrompt = `You are analyzing user feedback for a web application. Given the feedback, provide:
1. A concise summary (1-2 sentences)
2. The best category from: bug, feature, ui_ux, suggestion, other
3. A clarifying question a developer might ask to better understand the issue

Respond in JSON format:
{
  "summary": "...",
  "category": "bug|feature|ui_ux|suggestion|other",
  "devQuestion": "..."
}`

  const userPrompt = `Feedback: "${feedbackData.raw_text}"
${feedbackData.page_url ? `Page: ${feedbackData.page_url}` : ''}
${feedbackData.target_element ? `Target Element: ${feedbackData.target_element.tagName} - "${feedbackData.target_element.textPreview || ''}"` : ''}
${feedbackData.device_type ? `Device: ${feedbackData.device_type}` : ''}`

  try {
    let response: Response

    if (lovableApiKey) {
      // Use Lovable AI
      response = await fetch('https://api.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-lite',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 500,
          response_format: { type: 'json_object' },
        }),
        signal: AbortSignal.timeout(CONFIG.AI_TIMEOUT_MS),
      })
    } else {
      // Use OpenAI
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_completion_tokens: 500,
          response_format: { type: 'json_object' },
        }),
        signal: AbortSignal.timeout(CONFIG.AI_TIMEOUT_MS),
      })
    }

    if (!response.ok) {
      console.error('AI API error:', response.status, await response.text())
      return defaultResult
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return defaultResult
    }

    const parsed = JSON.parse(content)

    return {
      ai_summary: parsed.summary?.slice(0, 500) || null,
      ai_category: VALID_CATEGORIES.includes(parsed.category) ? parsed.category : null,
      ai_question_for_dev: parsed.devQuestion?.slice(0, 500) || null,
    }

  } catch (error) {
    console.error('AI enhancement error:', error)
    return defaultResult
  }
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

    // AI Enhancement (runs in parallel with nothing, but could be parallelized with other tasks)
    const aiEnhancement = await enhanceWithAI(feedbackData)

    // Add IP to context for rate limiting (anonymous users)
    const enrichedContext = {
      ...feedbackData.context,
      ip: userId ? undefined : getClientIP(req),
      userAgent: req.headers.get('user-agent')?.slice(0, 500),
      aiEnhanced: !!(aiEnhancement.ai_summary || aiEnhancement.ai_category),
    }

    // Insert feedback with AI enhancement
    const { data: feedback, error: insertError } = await supabase
      .from('feedback')
      .insert({
        user_id: userId,
        raw_text: feedbackData.raw_text,
        category: aiEnhancement.ai_category || feedbackData.category,
        severity: feedbackData.severity,
        page_url: feedbackData.page_url,
        target_element: feedbackData.target_element,
        device_type: feedbackData.device_type,
        context: enrichedContext,
        status: 'pending',
        // AI fields
        ai_summary: aiEnhancement.ai_summary,
        ai_category: aiEnhancement.ai_category,
        ai_question_for_dev: aiEnhancement.ai_question_for_dev,
      })
      .select('id, created_at, ai_summary, ai_category')
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
        aiEnhanced: !!(feedback.ai_summary || feedback.ai_category),
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
