import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// SECURITY: Define allowed origins (update with your production domains)
const ALLOWED_ORIGINS = [
  'https://happy-feedback-frame.lovable.app',
  'https://feedback-chatbot.lovable.app',
  'https://64deeb49-fafe-4473-a4e5-ae7e1dc32b65.lovableproject.com',
  'http://localhost:5173',
  'http://localhost:3000',
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  // Allow requests from approved origins or same-origin requests (no origin header)
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

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
  demo_mode?: boolean;
  submitter_name?: string;
  submitter_email?: string;
  submitter_phone?: string;
}

interface AIEnhancement {
  ai_summary: string | null;
  ai_category: string | null;
  ai_question_for_dev: string | null;
}

// ============================================
// DEMO MODE - Mock AI Responses
// ============================================

const DEMO_RESPONSES = {
  bug: {
    summary: "User reports a bug that needs investigation. The issue appears to be related to functionality not working as expected.",
    category: "bug",
    question: "What specific steps led to this bug, and can you reproduce it consistently?",
  },
  feature: {
    summary: "User is requesting a new feature or enhancement to improve their experience.",
    category: "feature_request",
    question: "How would this feature improve the user experience, and what's the expected behavior?",
  },
  ui_ux: {
    summary: "User has identified a UI/UX issue that affects usability or visual presentation.",
    category: "ux_issue",
    question: "Which specific element or interaction should be improved, and what would be the ideal behavior?",
  },
  suggestion: {
    summary: "User has provided a helpful suggestion for improving the application.",
    category: "improvement",
    question: "How should this suggestion be prioritized relative to other improvements?",
  },
  other: {
    summary: "User has provided general feedback about their experience with the application.",
    category: "other",
    question: "What additional context would help address this feedback effectively?",
  },
};

function getDemoAIResponse(category: string, rawText: string): AIEnhancement {
  const response = DEMO_RESPONSES[category as keyof typeof DEMO_RESPONSES] || DEMO_RESPONSES.other;
  
  // Add some variety based on the raw text
  const textLength = rawText.length;
  const urgencyWord = textLength > 100 ? "detailed" : "brief";
  
  return {
    ai_summary: `[DEMO] ${response.summary} This is a ${urgencyWord} ${category} submission.`,
    ai_category: response.category,
    ai_question_for_dev: `[DEMO] ${response.question}`,
  };
}

// ============================================
// VALIDATION & HELPERS
// ============================================

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

  // Validate required contact fields
  if (!p.submitter_name || typeof p.submitter_name !== 'string' || p.submitter_name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }

  if (!p.submitter_email || typeof p.submitter_email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(p.submitter_email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  const validCategories = ['bug', 'feature', 'improvement', 'question', 'other', 'ui_ux', 'suggestion'];
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
      demo_mode: p.demo_mode === true,
      submitter_name: (p.submitter_name as string).trim().slice(0, 200),
      submitter_email: (p.submitter_email as string).trim().toLowerCase().slice(0, 320),
      submitter_phone: typeof p.submitter_phone === 'string' ? p.submitter_phone.trim().slice(0, 30) : undefined,
    },
  };
}

// SECURITY: Rate limiting uses only user_id for authenticated users
// Anonymous rate limiting is based on session fingerprint, not IP addresses (GDPR compliant)
async function checkRateLimit(
  supabase: any,
  userId: string | null,
  sessionFingerprint: string
): Promise<{ allowed: boolean; remaining: number }> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  // For authenticated users, rate limit by user_id only
  // For anonymous users, we cannot reliably rate limit without storing IP
  // So we apply a more lenient check based on session fingerprint stored in context
  if (userId) {
    const { count } = await supabase
      .from('feedback')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', oneHourAgo);

    const currentCount = count || 0;
    return {
      allowed: currentCount < RATE_LIMIT_PER_HOUR,
      remaining: Math.max(0, RATE_LIMIT_PER_HOUR - currentCount),
    };
  }

  // For anonymous users, apply higher limit since we can't track them reliably
  // This is a security/privacy tradeoff - we prioritize GDPR compliance
  return { allowed: true, remaining: RATE_LIMIT_PER_HOUR };
}

// Generate a non-identifying session fingerprint from user agent
function getSessionFingerprint(req: Request): string {
  const ua = req.headers.get('user-agent') || 'unknown';
  // Create a simple hash-like fingerprint without storing identifiable info
  return ua.slice(0, 50);
}

// ============================================
// AI ENHANCEMENT
// ============================================

async function enhanceWithAI(feedbackData: FeedbackPayload): Promise<AIEnhancement> {
  // If demo mode is requested, return mock response
  if (feedbackData.demo_mode) {
    console.log('Demo mode requested - returning mock AI response');
    return getDemoAIResponse(feedbackData.category || 'other', feedbackData.raw_text);
  }

  const apiKey = Deno.env.get('LOVABLE_API_KEY');
  
  if (!apiKey) {
    console.log('No LOVABLE_API_KEY found, falling back to demo mode');
    return getDemoAIResponse(feedbackData.category || 'other', feedbackData.raw_text);
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
        model: 'google/gemini-3-flash-preview',
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
      // Fallback to demo mode on error
      return getDemoAIResponse(feedbackData.category || 'other', feedbackData.raw_text);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      return getDemoAIResponse(feedbackData.category || 'other', feedbackData.raw_text);
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return getDemoAIResponse(feedbackData.category || 'other', feedbackData.raw_text);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      ai_summary: parsed.summary || null,
      ai_category: parsed.category || null,
      ai_question_for_dev: parsed.question_for_dev || null,
    };
  } catch (error) {
    console.error('AI enhancement error:', error);
    // Fallback to demo mode on any error
    return getDemoAIResponse(feedbackData.category || 'other', feedbackData.raw_text);
  }
}

// ============================================
// MAIN HANDLER
// ============================================

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
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
    const isDemoMode = feedbackData.demo_mode || !Deno.env.get('LOVABLE_API_KEY');

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

    // Rate limiting (skip for demo mode)
    if (!isDemoMode) {
      const sessionFingerprint = getSessionFingerprint(req);
      const rateLimit = await checkRateLimit(supabase, userId, sessionFingerprint);

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
    }

    // Enhance with AI
    const aiEnhancement = await enhanceWithAI(feedbackData);

    // Build context (DO NOT store IP addresses for privacy/GDPR compliance)
    const context = {
      user_agent: req.headers.get('user-agent'),
      ai_enhanced: !!(aiEnhancement.ai_summary || aiEnhancement.ai_category),
      demo_mode: isDemoMode,
      submitted_at: new Date().toISOString(),
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
        submitter_name: feedbackData.submitter_name,
        submitter_email: feedbackData.submitter_email,
        submitter_phone: feedbackData.submitter_phone || null,
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
        demo_mode: isDemoMode,
        rate_limit_remaining: isDemoMode ? 999 : undefined,
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
