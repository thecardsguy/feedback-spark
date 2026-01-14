import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase to fetch feedback context
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch recent feedback for context
    const { data: feedbackItems, error: feedbackError } = await supabase
      .from('feedback')
      .select('id, raw_text, category, severity, status, ai_summary, created_at, submitter_name, submitter_email')
      .order('created_at', { ascending: false })
      .limit(50);

    if (feedbackError) {
      console.error('Error fetching feedback:', feedbackError);
    }

    // Build context summary
    let feedbackContext = '';
    if (feedbackItems && feedbackItems.length > 0) {
      const stats = {
        total: feedbackItems.length,
        pending: feedbackItems.filter(f => f.status === 'pending').length,
        byCategory: {} as Record<string, number>,
        bySeverity: {} as Record<string, number>,
        critical: feedbackItems.filter(f => f.severity === 'critical' || f.severity === 'high'),
      };

      feedbackItems.forEach(f => {
        stats.byCategory[f.category] = (stats.byCategory[f.category] || 0) + 1;
        stats.bySeverity[f.severity] = (stats.bySeverity[f.severity] || 0) + 1;
      });

      feedbackContext = `
## Current Feedback Data Summary
- Total feedback items: ${stats.total}
- Pending review: ${stats.pending}
- By category: ${JSON.stringify(stats.byCategory)}
- By severity: ${JSON.stringify(stats.bySeverity)}

## Recent Feedback Items (last ${feedbackItems.length}):
${feedbackItems.slice(0, 20).map((f, i) => `
${i + 1}. [${f.severity?.toUpperCase()}] ${f.category}
   Status: ${f.status}
   ${f.submitter_name ? `From: ${f.submitter_name}` : ''}
   Text: "${f.raw_text?.slice(0, 150)}${f.raw_text?.length > 150 ? '...' : ''}"
   ${f.ai_summary ? `AI Summary: ${f.ai_summary}` : ''}
`).join('\n')}

## Critical/High Priority Items:
${stats.critical.slice(0, 5).map((f, i) => `
${i + 1}. ${f.raw_text?.slice(0, 200)}
   Category: ${f.category} | Severity: ${f.severity} | Status: ${f.status}
`).join('\n') || 'None currently'}
`;
    } else {
      feedbackContext = 'No feedback data available yet.';
    }

    const systemPrompt = `You are an AI assistant for the Feedback Widget admin dashboard. You help administrators analyze, understand, and act on user feedback.

You have access to the following feedback data:
${feedbackContext}

Your capabilities:
- Summarize feedback trends and patterns
- Identify common issues and feature requests
- Prioritize items based on severity and frequency
- Provide actionable insights for product improvement
- Answer questions about specific feedback items

Be concise, actionable, and data-driven in your responses. When possible, reference specific feedback items or statistics. Format responses with markdown for readability.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add funds.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Stream the response back
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Admin chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
