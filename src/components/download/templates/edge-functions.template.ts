/**
 * Template: Edge Functions
 * Extracted from DownloadTemplate.tsx for better organization
 */

export const EDGE_FUNCTION_BASIC = `import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  try {
    const payload = await req.json()
    if (!payload.raw_text || payload.raw_text.length < 5) {
      return new Response(JSON.stringify({ error: 'Feedback text is required (min 5 chars)' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

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
        context: { user_agent: req.headers.get('user-agent'), submitted_at: new Date().toISOString() },
      })
      .select('id')
      .single()

    if (error) throw error
    return new Response(JSON.stringify({ success: true, id: feedback.id }), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Failed to submit feedback' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
`;

export const EDGE_FUNCTION_AI = `import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// IMPORTANT: In production, restrict CORS to your domain:
// const corsHeaders = { 'Access-Control-Allow-Origin': 'https://yourdomain.com', ... };
const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

// Demo responses for testing without AI API key
const DEMO_RESPONSES = {
  bug: { summary: "User reports a bug that needs investigation.", category: "bug", question: "What specific steps led to this bug?" },
  feature: { summary: "User is requesting a new feature.", category: "feature_request", question: "How would this feature improve the experience?" },
  ui_ux: { summary: "User has feedback about the UI/UX design.", category: "ui_ux", question: "What specific UI element is causing issues?" },
  suggestion: { summary: "User has a suggestion for improvement.", category: "suggestion", question: "What problem would this suggestion solve?" },
  other: { summary: "User has provided general feedback.", category: "other", question: "What additional context would help?" },
};

// NOTE: For rate limiting in production, consider using Supabase Edge Functions with Redis
// or implement IP-based rate limiting via a reverse proxy (Cloudflare, etc.)

function getDemoResponse(category: string) {
  const response = DEMO_RESPONSES[category as keyof typeof DEMO_RESPONSES] || DEMO_RESPONSES.other;
  return { ai_summary: \`[DEMO] \${response.summary}\`, ai_category: response.category, ai_question_for_dev: \`[DEMO] \${response.question}\` };
}

async function enhanceWithAI(feedbackData: any) {
  if (feedbackData.demo_mode) return getDemoResponse(feedbackData.category || 'other');
  
  const apiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!apiKey) return getDemoResponse(feedbackData.category || 'other');

  try {
    const prompt = \`Analyze this feedback and provide: 1. Brief summary (1-2 sentences) 2. Category (bug, feature_request, ux_issue, other) 3. Question for developer. Feedback: "\${feedbackData.raw_text}" Respond in JSON: { "summary": "...", "category": "...", "question_for_dev": "..." }\`;
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${apiKey}\`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'google/gemini-3-flash-preview', messages: [{ role: 'system', content: 'You analyze user feedback. Respond with valid JSON.' }, { role: 'user', content: prompt }], max_tokens: 500, temperature: 0.3 }),
    });

    if (!response.ok) return getDemoResponse(feedbackData.category || 'other');
    
    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;
    if (!content) return getDemoResponse(feedbackData.category || 'other');
    
    const jsonMatch = content.match(/\\{[\\s\\S]*\\}/);
    if (!jsonMatch) return getDemoResponse(feedbackData.category || 'other');
    
    const parsed = JSON.parse(jsonMatch[0]);
    return { ai_summary: parsed.summary || null, ai_category: parsed.category || null, ai_question_for_dev: parsed.question_for_dev || null };
  } catch { return getDemoResponse(feedbackData.category || 'other'); }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const payload = await req.json();
    if (!payload.raw_text?.trim()) return new Response(JSON.stringify({ error: 'Feedback text is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const isDemoMode = payload.demo_mode || !Deno.env.get('LOVABLE_API_KEY');
    const aiEnhancement = await enhanceWithAI(payload);

    const { data, error } = await supabase.from('feedback').insert({
      raw_text: payload.raw_text.slice(0, 5000),
      category: payload.category || 'other',
      severity: payload.severity || 'medium',
      page_url: payload.page_url,
      target_element: payload.target_element,
      device_type: payload.device_type,
      status: 'pending',
      context: { demo_mode: isDemoMode },
      ...aiEnhancement,
    }).select('id').single();

    if (error) throw error;
    return new Response(JSON.stringify({ success: true, id: data.id, demo_mode: isDemoMode, ...aiEnhancement }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
`;
