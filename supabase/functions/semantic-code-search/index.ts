import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS configuration
const ALLOWED_ORIGINS = [
  "https://happy-feedback-frame.lovable.app",
  "https://feedback-chatbot.lovable.app",
  "https://64deeb49-fafe-4473-a4e5-ae7e1dc32b65.lovableproject.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  };
}

interface FileInfo {
  id: string;
  name: string;
  path: string;
  category: string;
  description: string;
}

interface SearchResult {
  fileId: string;
  relevanceScore: number;
  matchReason: string;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { query, files } = (await req.json()) as {
      query: string;
      files: FileInfo[];
    };

    if (!query || !files || !Array.isArray(files)) {
      return new Response(
        JSON.stringify({ error: "Query and files array are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build the file list for the prompt
    const fileListText = files
      .map((f) => `- ${f.id}: ${f.name} (${f.category}) - ${f.description}`)
      .join("\n");

    const systemPrompt = `You are a code file search assistant. Given a user's natural language query and a list of project files with descriptions, rank the files by relevance to the query.

Return ONLY a valid JSON array (no markdown, no explanation) of the top 10 most relevant files with:
- fileId: the file's id
- relevanceScore: 0-100 how relevant this file is to the query
- matchReason: brief explanation why this matches (1 sentence max)

Only include files with relevanceScore > 30. If no files match well, return an empty array [].

Example output:
[{"fileId":"auth-context","relevanceScore":95,"matchReason":"Core authentication provider handling login state"},{"fileId":"login-page","relevanceScore":87,"matchReason":"Login form UI component"}]`;

    const userPrompt = `User Query: "${query}"

Files:
${fileListText}

Return the JSON array of matching files:`;

    console.log(`Processing semantic search for: "${query}"`);

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service unavailable" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse the JSON response
    let results: SearchResult[] = [];
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();

      results = JSON.parse(cleanContent);

      // Validate the structure
      if (!Array.isArray(results)) {
        results = [];
      }

      // Sort by relevance score
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);

      // Limit to top 10
      results = results.slice(0, 10);

      console.log(`Found ${results.length} matching files`);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError, content);
      results = [];
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Semantic search error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Search failed",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
