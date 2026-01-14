import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { FileEntry } from "@/lib/fileRegistry";
import { fileRegistry } from "@/lib/fileRegistry";

export interface SemanticSearchResult {
  file: FileEntry;
  relevanceScore: number;
  matchReason: string;
}

interface UseSemanticSearchReturn {
  search: (query: string) => Promise<void>;
  results: SemanticSearchResult[];
  isSearching: boolean;
  error: string | null;
  clearResults: () => void;
}

export function useSemanticSearch(): UseSemanticSearchReturn {
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Prepare file data for the AI (only send essential info to reduce payload)
      const filesForAI = fileRegistry.map((f) => ({
        id: f.id,
        name: f.name,
        path: f.path,
        category: f.category,
        description: f.description,
      }));

      const { data, error: fnError } = await supabase.functions.invoke(
        "semantic-code-search",
        {
          body: { query, files: filesForAI },
        }
      );

      if (fnError) {
        throw new Error(fnError.message || "Search failed");
      }

      if (!data?.results) {
        setResults([]);
        return;
      }

      // Map results back to full file entries
      const mappedResults: SemanticSearchResult[] = data.results
        .map((result: { fileId: string; relevanceScore: number; matchReason: string }) => {
          const file = fileRegistry.find((f) => f.id === result.fileId);
          if (!file) return null;
          return {
            file,
            relevanceScore: result.relevanceScore,
            matchReason: result.matchReason,
          };
        })
        .filter(Boolean) as SemanticSearchResult[];

      setResults(mappedResults);
    } catch (err) {
      console.error("Semantic search error:", err);
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    search,
    results,
    isSearching,
    error,
    clearResults,
  };
}
