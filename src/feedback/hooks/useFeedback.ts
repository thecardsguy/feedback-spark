/**
 * Feedback Widget Template - Enhanced Data Hooks
 * 
 * Features:
 * - Real-time subscriptions for live updates
 * - Optimistic updates with automatic rollback
 * - Retry logic with exponential backoff
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type {
  FeedbackItem,
  FeedbackSubmission,
  FeedbackStatus,
  FeedbackCategory,
  FeedbackSeverity,
  UseFeedbackReturn,
  UseFeedbackStatsReturn,
} from '../types/feedback';

// ============================================
// UTILITIES
// ============================================

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < maxRetries - 1) {
        await wait(baseDelay * Math.pow(2, i));
      }
    }
  }
  throw lastError!;
}

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// ============================================
// CONFIGURATION
// ============================================

interface FeedbackHookConfig {
  tableName?: string;
  aiEnabled?: boolean;
  userId?: string;
  enableRealtime?: boolean;
}

// ============================================
// MAIN HOOK: useFeedback
// ============================================

export function useFeedback(hookConfig: FeedbackHookConfig = {}): UseFeedbackReturn {
  const { aiEnabled = false, userId, enableRealtime = true } = hookConfig;
  
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Fetch with retry
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setItems((data || []) as unknown as FeedbackItem[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch feedback'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Real-time subscription
  useEffect(() => {
    fetchItems();

    if (enableRealtime) {
      channelRef.current = supabase
        .channel('feedback-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'feedback' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newItem = payload.new as unknown as FeedbackItem;
              // Don't add if it's a temp item we already have (optimistic update)
              setItems(prev => {
                const hasTemp = prev.some(i => i.id.startsWith('temp-'));
                if (hasTemp) {
                  return [newItem, ...prev.filter(i => !i.id.startsWith('temp-'))];
                }
                // Check if already exists
                if (prev.some(i => i.id === newItem.id)) {
                  return prev;
                }
                return [newItem, ...prev];
              });
            } else if (payload.eventType === 'UPDATE') {
              const updated = payload.new as unknown as FeedbackItem;
              setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
            } else if (payload.eventType === 'DELETE') {
              const deletedId = (payload.old as any).id;
              setItems(prev => prev.filter(i => i.id !== deletedId));
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [fetchItems, enableRealtime]);

  // Optimistic submit
  const submit = useCallback(async (data: FeedbackSubmission): Promise<FeedbackItem> => {
    const optimisticId = `temp-${Date.now()}`;
    const optimisticItem: FeedbackItem = {
      id: optimisticId,
      raw_text: data.raw_text,
      category: data.category || 'other',
      severity: data.severity || 'medium',
      status: 'pending',
      page_url: data.page_url || window.location.href,
      device_type: getDeviceType(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistically add
    setItems(prev => [optimisticItem, ...prev]);

    try {
      const functionName = aiEnabled ? 'submit-feedback-ai' : 'submit-feedback';
      const { data: result, error: submitError } = await withRetry(() =>
        supabase.functions.invoke(functionName, {
          body: {
            ...data,
            user_id: userId,
            page_url: data.page_url || window.location.href,
            device_type: getDeviceType(),
          },
        })
      );

      if (submitError) throw submitError;

      // If realtime is enabled, the real item will come through the subscription
      // Otherwise, refresh to get the real item
      if (!enableRealtime) {
        await fetchItems();
      }
      
      return result as FeedbackItem;
    } catch (err) {
      // Rollback optimistic update
      setItems(prev => prev.filter(i => i.id !== optimisticId));
      throw err;
    }
  }, [aiEnabled, userId, fetchItems, enableRealtime]);

  // Optimistic status update
  const updateStatus = useCallback(async (id: string, status: FeedbackStatus): Promise<void> => {
    const previousItems = [...items];
    
    // Optimistic update
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, status, updated_at: new Date().toISOString() } : i
    ));

    try {
      const { error: updateError } = await supabase
        .from('feedback')
        .update({ status, updated_at: new Date().toISOString() } as any)
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err) {
      // Rollback on error
      setItems(previousItems);
      throw err;
    }
  }, [items]);

  return { items, isLoading, error, submit, updateStatus, refresh: fetchItems };
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
      if (byCategory[item.category] !== undefined) byCategory[item.category]++;
      if (bySeverity[item.severity] !== undefined) bySeverity[item.severity]++;
      if (byStatus[item.status] !== undefined) byStatus[item.status]++;
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
