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
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  };
}

interface HealthStatus {
  database: { ok: boolean; message: string };
  ai: { ok: boolean; message: string; provider: string };
  storage: { ok: boolean; message: string };
  overall: boolean;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const status: HealthStatus = {
    database: { ok: false, message: '' },
    ai: { ok: false, message: '', provider: 'none' },
    storage: { ok: false, message: '' },
    overall: false,
  };

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      status.database = { ok: false, message: 'Missing Supabase credentials' };
      return new Response(JSON.stringify(status), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check database - try to count feedback items
    try {
      const { count, error } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true });

      if (error) {
        status.database = { ok: false, message: `Database error: ${error.message}` };
      } else {
        status.database = { ok: true, message: `Connected. ${count || 0} feedback items found.` };
      }
    } catch (err) {
      status.database = { ok: false, message: `Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}` };
    }

    // Check AI availability
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (lovableApiKey) {
      status.ai = { ok: true, message: 'Lovable AI configured', provider: 'lovable' };
    } else {
      const openaiKey = Deno.env.get('OPENAI_API_KEY');
      if (openaiKey) {
        status.ai = { ok: true, message: 'OpenAI configured', provider: 'openai' };
      } else {
        status.ai = { ok: false, message: 'No AI provider configured. Using demo mode.', provider: 'demo' };
      }
    }

    // Check storage (optional)
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      if (error) {
        status.storage = { ok: false, message: `Storage error: ${error.message}` };
      } else {
        status.storage = { ok: true, message: `${buckets?.length || 0} storage buckets available` };
      }
    } catch (err) {
      status.storage = { ok: false, message: 'Storage check skipped' };
    }

    // Calculate overall status
    status.overall = status.database.ok;

    return new Response(JSON.stringify(status), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Health check error:', error);
    return new Response(
      JSON.stringify({
        ...status,
        error: error instanceof Error ? error.message : 'Unknown error',
        overall: false,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
