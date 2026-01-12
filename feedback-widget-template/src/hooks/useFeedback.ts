/**
 * Feedback Widget Template - Data Hooks
 * 
 * Provides hooks for fetching, submitting, and managing feedback.
 * Works with Supabase or can be adapted for other backends.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  FeedbackItem,
  FeedbackSubmission,
  FeedbackStatus,
  FeedbackCategory,
  FeedbackSeverity,
  UseFeedbackReturn,
  UseFeedbackStatsReturn,
  FeedbackConfig,
} from '../types/feedback';

// ============================================
// CONFIGURATION
// ============================================

interface FeedbackHookConfig {
  supabaseClient?: {
    from: (table: string) => {
      select: (columns?: string) => Promise<{ data: FeedbackItem[] | null; error: Error | null }>;
      insert: (data: Partial<FeedbackItem>) => { select: () => Promise<{ data: FeedbackItem[] | null; error: Error | null }> };
      update: (data: Partial<FeedbackItem>) => { eq: (col: string, val: string) => Promise<{ error: Error | null }> };
    };
    functions: {
      invoke: (name: string, options: { body: unknown }) => Promise<{ data: unknown; error: Error | null }>;
    };
  };
  tableName?: string;
  aiEnabled?: boolean;
  userId?: string;
}

// ============================================
// MAIN HOOK: useFeedback
// ============================================

export function useFeedback(hookConfig: FeedbackHookConfig = {}): UseFeedbackReturn {
  const { supabaseClient, tableName = 'feedback', aiEnabled = false, userId } = hookConfig;
  
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch feedback items
  const fetchItems = useCallback(async () => {
    if (!supabaseClient) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabaseClient
        .from(tableName)
        .select('*');

      if (fetchError) throw fetchError;
      setItems((data || []) as FeedbackItem[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch feedback'));
    } finally {
      setIsLoading(false);
    }
  }, [supabaseClient, tableName]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Submit new feedback
  const submit = useCallback(async (data: FeedbackSubmission): Promise<FeedbackItem> => {
    if (!supabaseClient) {
      throw new Error('Supabase client not configured');
    }

    // Determine which edge function to use
    const functionName = aiEnabled ? 'submit-feedback-ai' : 'submit-feedback';

    const { data: result, error: submitError } = await supabaseClient.functions.invoke(
      functionName,
      {
        body: {
          ...data,
          user_id: userId,
          page_url: data.page_url || window.location.href,
          device_type: getDeviceType(),
        },
      }
    );

    if (submitError) throw submitError;

    const newItem = result as FeedbackItem;
    setItems(prev => [newItem, ...prev]);
    return newItem;
  }, [supabaseClient, aiEnabled, userId]);

  // Update feedback status
  const updateStatus = useCallback(async (id: string, status: FeedbackStatus): Promise<void> => {
    if (!supabaseClient) {
      throw new Error('Supabase client not configured');
    }

    const { error: updateError } = await supabaseClient
      .from(tableName)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) throw updateError;

    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status, updated_at: new Date().toISOString() } : item
      )
    );
  }, [supabaseClient, tableName]);

  return {
    items,
    isLoading,
    error,
    submit,
    updateStatus,
    refresh: fetchItems,
  };
}

// ============================================
// STATS HOOK: useFeedbackStats
// ============================================

export function useFeedbackStats(items: FeedbackItem[]): UseFeedbackStatsReturn {
  return useMemo(() => {
    const byCategory: Record<FeedbackCategory, number> = {
      bug: 0,
      feature: 0,
      ui_ux: 0,
      suggestion: 0,
      other: 0,
    };

    const bySeverity: Record<FeedbackSeverity, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    const byStatus: Record<FeedbackStatus, number> = {
      pending: 0,
      reviewed: 0,
      resolved: 0,
      dismissed: 0,
    };

    items.forEach(item => {
      byCategory[item.category]++;
      bySeverity[item.severity]++;
      byStatus[item.status]++;
    });

    // Calculate recent trend (last 7 days vs previous 7 days)
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentCount = items.filter(
      item => new Date(item.created_at) >= weekAgo
    ).length;

    const previousCount = items.filter(
      item => new Date(item.created_at) >= twoWeeksAgo && new Date(item.created_at) < weekAgo
    ).length;

    let recentTrend: 'up' | 'down' | 'stable' = 'stable';
    if (recentCount > previousCount * 1.2) recentTrend = 'up';
    else if (recentCount < previousCount * 0.8) recentTrend = 'down';

    return {
      totalCount: items.length,
      byCategory,
      bySeverity,
      byStatus,
      recentTrend,
    };
  }, [items]);
}

// ============================================
// FILTER HOOK: useFeedbackFilters
// ============================================

interface FilterState {
  category?: FeedbackCategory;
  severity?: FeedbackSeverity;
  status?: FeedbackStatus;
  search?: string;
}

export function useFeedbackFilters(items: FeedbackItem[]) {
  const [filters, setFilters] = useState<FilterState>({});

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.severity && item.severity !== filters.severity) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesText = item.raw_text.toLowerCase().includes(searchLower);
        const matchesSummary = item.ai_summary?.toLowerCase().includes(searchLower);
        if (!matchesText && !matchesSummary) return false;
      }
      return true;
    });
  }, [items, filters]);

  const setCategory = (category?: FeedbackCategory) => setFilters(f => ({ ...f, category }));
  const setSeverity = (severity?: FeedbackSeverity) => setFilters(f => ({ ...f, severity }));
  const setStatus = (status?: FeedbackStatus) => setFilters(f => ({ ...f, status }));
  const setSearch = (search?: string) => setFilters(f => ({ ...f, search }));
  const clearFilters = () => setFilters({});

  return {
    filteredItems,
    filters,
    setCategory,
    setSeverity,
    setStatus,
    setSearch,
    clearFilters,
  };
}

// ============================================
// UTILITIES
// ============================================

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// ============================================
// LOCAL STORAGE PERSISTENCE (Optional)
// ============================================

const STORAGE_KEY = 'feedback-widget-drafts';

export function useFeedbackDraft() {
  const [draft, setDraftState] = useState<Partial<FeedbackSubmission>>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setDraftState(JSON.parse(saved));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  const setDraft = useCallback((update: Partial<FeedbackSubmission>) => {
    setDraftState(prev => {
      const next = { ...prev, ...update };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearDraft = useCallback(() => {
    setDraftState({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { draft, setDraft, clearDraft };
}
