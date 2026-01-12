/**
 * Feedback Widget Template - Admin Dashboard
 * 
 * Complete admin interface for viewing and managing feedback.
 * Supports all three tiers with appropriate features.
 */

import React, { useState, useCallback } from 'react';
import { FeedbackStats } from './FeedbackStats';
import { FeedbackList } from './FeedbackList';
import { FeedbackDetail } from './FeedbackDetail';
import { useFeedback, useFeedbackFilters } from '../../hooks/useFeedback';
import type { 
  FeedbackDashboardProps, 
  FeedbackItem, 
  FeedbackCategory, 
  FeedbackSeverity, 
  FeedbackStatus 
} from '../../types/feedback';

// ============================================
// ICONS
// ============================================

const Icons = {
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Refresh: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  ),
};

// ============================================
// FILTER OPTIONS
// ============================================

const CATEGORY_OPTIONS: { value: FeedbackCategory | ''; label: string }[] = [
  { value: '', label: 'All Categories' },
  { value: 'bug', label: '🐛 Bugs' },
  { value: 'feature', label: '✨ Features' },
  { value: 'ui_ux', label: '🎨 UI/UX' },
  { value: 'suggestion', label: '💡 Suggestions' },
  { value: 'other', label: '📝 Other' },
];

const STATUS_OPTIONS: { value: FeedbackStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
];

const SEVERITY_OPTIONS: { value: FeedbackSeverity | ''; label: string }[] = [
  { value: '', label: 'All Severities' },
  { value: 'critical', label: '🔴 Critical' },
  { value: 'high', label: '🟠 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low', label: '🟢 Low' },
];

// ============================================
// FEEDBACK DASHBOARD COMPONENT
// ============================================

export function FeedbackDashboard({ config }: FeedbackDashboardProps) {
  const { items, isLoading, refresh, updateStatus } = useFeedback({
    aiEnabled: config.ai.enabled,
  });

  const {
    filteredItems,
    filters,
    setCategory,
    setSeverity,
    setStatus,
    setSearch,
    clearFilters,
  } = useFeedbackFilters(items);

  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);

  const handleExport = useCallback(() => {
    if (!config.admin.exportEnabled) return;

    const csvContent = [
      ['ID', 'Category', 'Severity', 'Status', 'Feedback', 'Page', 'Created'].join(','),
      ...filteredItems.map(item =>
        [
          item.id,
          item.category,
          item.severity,
          item.status,
          `"${item.raw_text.replace(/"/g, '""')}"`,
          item.page_url || '',
          item.created_at,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredItems, config.admin.exportEnabled]);

  const handleStatusChange = useCallback(async (status: FeedbackStatus) => {
    if (!selectedItem) return;
    await updateStatus(selectedItem.id, status);
    setSelectedItem(prev => prev ? { ...prev, status } : null);
  }, [selectedItem, updateStatus]);

  const hasActiveFilters = filters.category || filters.severity || filters.status || filters.search;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Feedback Dashboard</h1>
          <p style={styles.subtitle}>
            {filteredItems.length} feedback item{filteredItems.length !== 1 ? 's' : ''}
            {hasActiveFilters && ` (filtered from ${items.length})`}
          </p>
        </div>

        <div style={styles.headerActions}>
          <button onClick={refresh} style={styles.iconButton} title="Refresh">
            <Icons.Refresh />
          </button>
          {config.admin.exportEnabled && (
            <button onClick={handleExport} style={styles.iconButton} title="Export CSV">
              <Icons.Download />
            </button>
          )}
        </div>
      </div>

      {/* Statistics (Standard/Pro tier) */}
      {config.admin.showStats && (
        <div style={styles.statsSection}>
          <FeedbackStats items={items} />
        </div>
      )}

      {/* Filters */}
      <div style={styles.filters}>
        {/* Search */}
        <div style={styles.searchContainer}>
          <Icons.Search />
          <input
            type="text"
            placeholder="Search feedback..."
            value={filters.search || ''}
            onChange={e => setSearch(e.target.value || undefined)}
            style={styles.searchInput}
          />
        </div>

        {/* Category filter */}
        <select
          value={filters.category || ''}
          onChange={e => setCategory(e.target.value as FeedbackCategory || undefined)}
          style={styles.select}
        >
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Severity filter */}
        <select
          value={filters.severity || ''}
          onChange={e => setSeverity(e.target.value as FeedbackSeverity || undefined)}
          style={styles.select}
        >
          {SEVERITY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={filters.status || ''}
          onChange={e => setStatus(e.target.value as FeedbackStatus || undefined)}
          style={styles.select}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button onClick={clearFilters} style={styles.clearButton}>
            Clear filters
          </button>
        )}
      </div>

      {/* Main content */}
      <div style={styles.content}>
        {/* Feedback list */}
        <div style={styles.listPane}>
          <FeedbackList
            items={filteredItems}
            onSelect={setSelectedItem}
            selectedId={selectedItem?.id}
            isLoading={isLoading}
          />
        </div>

        {/* Detail pane */}
        {selectedItem && (
          <div style={styles.detailPane}>
            <FeedbackDetail
              item={selectedItem}
              config={config}
              onStatusChange={config.admin.statusUpdates ? handleStatusChange : undefined}
              onClose={() => setSelectedItem(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// STYLES
// ============================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    padding: 24,
    maxWidth: 1400,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: '#1f2937',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: 14,
    color: '#6b7280',
  },
  headerActions: {
    display: 'flex',
    gap: 8,
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    border: '1px solid #d1d5db',
    borderRadius: 6,
    backgroundColor: 'white',
    cursor: 'pointer',
    color: '#4b5563',
    transition: 'all 0.15s',
  },
  statsSection: {
    padding: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    border: '1px solid #e5e7eb',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    backgroundColor: 'white',
    flex: '1 1 200px',
    maxWidth: 300,
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: 14,
    width: '100%',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 13,
    cursor: 'pointer',
    backgroundColor: 'white',
  },
  clearButton: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: 6,
    fontSize: 13,
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    cursor: 'pointer',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    minHeight: 400,
  },
  listPane: {
    overflow: 'auto',
    maxHeight: 600,
  },
  detailPane: {
    position: 'sticky',
    top: 24,
    alignSelf: 'start',
  },
};

export default FeedbackDashboard;
