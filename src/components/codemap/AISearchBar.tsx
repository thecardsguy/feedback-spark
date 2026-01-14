import { useState, useEffect, useCallback } from "react";
import { Search, Sparkles, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VoiceSearchButton } from "./VoiceSearchButton";

interface AISearchBarProps {
  onBasicSearch: (query: string) => void;
  onAISearch: (query: string) => void;
  isSearching: boolean;
  isAdmin: boolean;
}

export function AISearchBar({
  onBasicSearch,
  onAISearch,
  isSearching,
  isAdmin,
}: AISearchBarProps) {
  const [query, setQuery] = useState("");
  const [isAIMode, setIsAIMode] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce for basic search
  useEffect(() => {
    if (!isAIMode) {
      const timer = setTimeout(() => {
        setDebouncedQuery(query);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [query, isAIMode]);

  // Trigger basic search on debounced query change
  useEffect(() => {
    if (!isAIMode) {
      onBasicSearch(debouncedQuery);
    }
  }, [debouncedQuery, isAIMode, onBasicSearch]);

  const handleAISearch = useCallback(() => {
    if (query.trim() && isAIMode) {
      onAISearch(query);
    }
  }, [query, isAIMode, onAISearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isAIMode) {
      handleAISearch();
    }
  };

  const handleVoiceResult = (text: string) => {
    setQuery(text);
    if (isAIMode) {
      onAISearch(text);
    }
  };

  const handleClear = () => {
    setQuery("");
    onBasicSearch("");
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        {/* Search Icon / Loading */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          ) : isAIMode ? (
            <Sparkles className="w-4 h-4 text-primary" />
          ) : (
            <Search className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        <Input
          type="text"
          placeholder={
            isAIMode
              ? "Describe what you're looking for..."
              : "Search files by name, path, or description..."
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`pl-10 pr-20 transition-all ${
            isAIMode ? "border-primary/50 bg-primary/5" : ""
          }`}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-12 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}

        {/* Voice Search (AI mode only, admin only) */}
        {isAdmin && isAIMode && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <VoiceSearchButton onResult={handleVoiceResult} />
          </div>
        )}
      </div>

      {/* Controls Row - Responsive */}
      <div className="flex flex-wrap items-center gap-2">
        {isAdmin && (
          <Button
            variant={isAIMode ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setIsAIMode(!isAIMode);
              if (!isAIMode) {
                // Switching to AI mode, clear basic search results
                onBasicSearch("");
              }
            }}
            className="gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAIMode ? "AI Mode" : "Basic"}</span>
            <span className="sm:hidden">{isAIMode ? "AI" : "Basic"}</span>
          </Button>
        )}

        {isAdmin && isAIMode && (
          <div className="sm:hidden">
            <VoiceSearchButton onResult={handleVoiceResult} />
          </div>
        )}

        {isAIMode && (
          <Button
            onClick={handleAISearch}
            disabled={!query.trim() || isSearching}
            className="gap-1.5 flex-1 sm:flex-none"
            size="sm"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Search with AI</span>
            <span className="sm:hidden">Search</span>
          </Button>
        )}

        {isAIMode && (
          <Badge variant="secondary" className="hidden sm:flex items-center gap-1 ml-auto">
            <Sparkles className="w-3 h-3" />
            AI-Powered
          </Badge>
        )}
      </div>
    </div>
  );
}
