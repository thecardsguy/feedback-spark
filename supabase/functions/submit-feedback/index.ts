import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.2'

// SECURITY: Define allowed origins (update with your production domains)
const ALLOWED_ORIGINS = [
  'https://happy-feedback-frame.lovable.app',
  'https://feedback-chatbot.lovable.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per hour per fingerprint

// In-memory rate limit store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientFingerprint(req: Request): string {
  // Create a fingerprint from available headers
  const forwarded = req.headers.get('x-forwarded-for') || '';
  const userAgent = req.headers.get('user-agent') || '';
  const origin = req.headers.get('origin') || '';
  
  // Simple hash of combined values
  const combined = `${forwarded}-${userAgent.slice(0, 50)}-${origin}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function checkRateLimit(fingerprint: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitStore.get(fingerprint);
  
  if (!record || now > record.resetAt) {
    // Create new record or reset expired one
    rateLimitStore.set(fingerprint, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetIn: record.resetAt - now };
  }
  
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count, resetIn: record.resetAt - now };
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  // Allow requests from approved origins or same-origin requests (no origin header)
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  };
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  try {
    // Rate limiting check
    const fingerprint = getClientFingerprint(req);
    const rateLimit = checkRateLimit(fingerprint);
    
    if (!rateLimit.allowed) {
      const resetInMinutes = Math.ceil(rateLimit.resetIn / 60000);
      return new Response(
        JSON.stringify({ 
          error: `Rate limit exceeded. Please try again in ${resetInMinutes} minutes.`,
          retryAfter: Math.ceil(rateLimit.resetIn / 1000)
        }), 
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(rateLimit.resetIn / 1000).toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          } 
        }
      )
    }

    const payload = await req.json()
    
    if (!payload.raw_text || payload.raw_text.length < 5) {
      return new Response(JSON.stringify({ error: 'Feedback text is required (min 5 chars)' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // Build context (DO NOT store IP addresses for privacy/GDPR compliance)
    const context = {
      user_agent: req.headers.get('user-agent'),
      submitted_at: new Date().toISOString(),
    };

    const { data: feedback, error } = await supabase
      .from('feedback')
      .insert({
        raw_text: payload.raw_text.slice(0, 5000),
        category: payload.category || 'other',
        severity: payload.severity || 'medium',
        page_url: payload.page_url,
        target_element: payload.target_element,
        device_type: payload.device_type,
        status: 'pending',
        context,
      })
      .select('id, created_at')
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, id: feedback.id }), 
      { 
        status: 201, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Failed to submit feedback' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})