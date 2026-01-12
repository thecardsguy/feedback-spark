import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration
const MAX_TEXT_LENGTH = 5000;
const RATE_LIMIT_PER_HOUR = 10;

interface FeedbackPayload {
  raw_text: string;
  category?: string;
  severity?: string;
  page_url?: string;
  target_element?: Record<string, unknown>;
  device_type?: string;
}

interface AIEnhancement {
  ai_summary: string | null;
  ai_category: string | null;
  ai_question_for_dev: string | null;
}

function sanitizeText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"]/g, '')
    .trim()
    .slice(0, MAX_TEXT_LENGTH);
}

function validatePayload(payload: unknown): { valid: boolean; data?: FeedbackPayload; error?: string } {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Invalid payload' };
  }

  const p = payload as Record<string, unknown>;

  if (!p.raw_text || typeof p.raw_text !== 'string' || p.raw_text.trim().length === 0) {
    return { valid: false, error: 'Feedback text is required' };
  }

  if (p.raw_text.length > MAX_TEXT_LENGTH) {
    return { valid: false, error: `Feedback text exceeds maximum length of ${MAX_TEXT_LENGTH} characters` };
  }

  const validCategories = ['bug', 'feature', 'improvement', 'question', 'other'];
  const validSeverities = ['low', 'medium', 'high', 'critical'];

  return {
    valid: true,
    data: {
      raw_text: sanitizeText(p.raw_text as string),
      category: validCategories.includes(p.category as string) ? (p.category as string) : 'other',
      severity: validSeverities.includes(p.severity as string) ? (p.severity as string) : 'medium',
      page_url: typeof p.page_url === 'string' ? p.page_url.slice(0, 2000) : undefined,
      target_element: typeof p.target_element === 'object' ? p.target_element as Record<string, unknown> : undefined,
      device_type: typeof p.device_type === 'string' ? p.device_type.slice(0, 50) : undefined,
    },
  };
}

async function checkRateLimit(
  supabase: any,
  identifier: string
): Promise<{ allowed: boolean; remaining: number }> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count } = await supabase
    .from('feedback')
    .select('*', { count: 'exact', head: true })
    .or(`user_id.eq.${identifier},context->>ip.eq.${identifier}`)
    .gte('created_at', oneHourAgo);

  const currentCount = count || 0;
  return {
    allowed: currentCount < RATE_LIMIT_PER_HOUR,
    remaining: Math.max(0, RATE_LIMIT_PER_HOUR - currentCount),
  };
}

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         req.headers.get('x-real-ip') ||
         'unknown';
}

async function enhanceWithAI(feedbackData: FeedbackPayload): Promise<AIEnhancement> {
  const apiKey = Deno.env.get('LOVABLE_API_KEY');
  
  if (!apiKey) {
    console.log('No LOVABLE_API_KEY found, skipping AI enhancement');
    return { ai_summary: null, ai_category: null, ai_question_for_dev: null };
  }

  try {
    const prompt = `Analyze this user feedback and provide:
1. A brief summary (1-2 sentences)
2. A category (bug, feature_request, ux_issue, performance, documentation, praise, other)
3. A question for the developer to consider when addressing this feedback

Feedback: "${feedbackData.raw_text}"
${feedbackData.category ? `User-selected category: ${feedbackData.category}` : ''}
${feedbackData.severity ? `User-selected severity: ${feedbackData.severity}` : ''}
${feedbackData.page_url ? `Page: ${feedbackData.page_url}` : ''}

Respond in JSON format:
{
  "summary": "...",
  "category": "...",
  "question_for_dev": "..."
}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that analyzes user feedback for software products. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('AI API error:', response.status);
      return { ai_summary: null, ai_category: null, ai_question_for_dev: null };
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      return { ai_summary: null, ai_category: null, ai_question_for_dev: null };
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { ai_summary: null, ai_category: null, ai_question_for_dev: null };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      ai_summary: parsed.summary || null,
      ai_category: parsed.category || null,
      ai_question_for_dev: parsed.question_for_dev || null,
    };
  } catch (error) {
    console.error('AI enhancement error:', error);
    return { ai_summary: null, ai_category: null, ai_question_for_dev: null };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse and validate payload
    const payload = await req.json();
    const validation = validatePayload(payload);

    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const feedbackData = validation.data!;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header if available
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Rate limiting
    const identifier = userId || getClientIP(req);
    const rateLimit = await checkRateLimit(supabase, identifier);

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          remaining: 0,
          reset_in: '1 hour',
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Enhance with AI
    const aiEnhancement = await enhanceWithAI(feedbackData);

    // Build context
    const context = {
      ip: getClientIP(req),
      user_agent: req.headers.get('user-agent'),
      ai_enhanced: !!(aiEnhancement.ai_summary || aiEnhancement.ai_category),
    };

    // Insert feedback
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        raw_text: feedbackData.raw_text,
        category: feedbackData.category,
        severity: feedbackData.severity,
        page_url: feedbackData.page_url,
        target_element: feedbackData.target_element,
        device_type: feedbackData.device_type,
        user_id: userId,
        context,
        status: 'pending',
        ...aiEnhancement,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save feedback' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: data.id,
        ai_enhanced: context.ai_enhanced,
        rate_limit_remaining: rateLimit.remaining - 1,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
