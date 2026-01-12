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
  Sparkles: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" />
      <path d="M19 13l.5 1.5L21 15l-1.5.5L19 17l-.5-1.5L17 15l1.5-.5L19 13z" />
    </svg>
  ),
  List: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  FileText: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
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

type TabType = 'all' | 'ai-enhanced';

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
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Filter items based on active tab
  const displayItems = activeTab === 'ai-enhanced'
    ? filteredItems.filter(item => item.ai_summary || item.ai_category || item.ai_question_for_dev)
    : filteredItems;

  const aiEnhancedCount = items.filter(item => item.ai_summary || item.ai_category || item.ai_question_for_dev).length;

  const handleExport = useCallback(() => {
    if (!config.admin.exportEnabled) return;

    const csvContent = [
      ['ID', 'Category', 'Severity', 'Status', 'Feedback', 'AI Summary', 'AI Category', 'AI Question', 'Page', 'Created'].join(','),
      ...displayItems.map(item =>
        [
          item.id,
          item.category,
          item.severity,
          item.status,
          `"${item.raw_text.replace(/"/g, '""')}"`,
          `"${(item.ai_summary || '').replace(/"/g, '""')}"`,
          item.ai_category || '',
          `"${(item.ai_question_for_dev || '').replace(/"/g, '""')}"`,
          item.page_url || '',
          item.created_at,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-export-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [displayItems, config.admin.exportEnabled, activeTab]);

  // Export all feedback as Lovable prompts
  const handleExportAsPrompts = useCallback(() => {
    const aiItems = items.filter(item => item.ai_summary || item.ai_question_for_dev);
    
    if (aiItems.length === 0) {
      alert('No AI-enhanced feedback to export. Submit feedback using the Pro tier first.');
      return;
    }

    const markdownContent = [
      `# Feedback Prompts for Lovable`,
      ``,
      `Generated: ${new Date().toLocaleString()}`,
      `Total Items: ${aiItems.length}`,
      ``,
      `---`,
      ``,
      ...aiItems.map((item, index) => [
        `## ${index + 1}. ${item.ai_category || item.category || 'Feedback'} (${item.severity})`,
        ``,
        `### User Feedback`,
        item.raw_text,
        ``,
        item.ai_summary ? `### AI Summary\n${item.ai_summary}\n` : '',
        item.ai_question_for_dev ? `### Prompt for Lovable\n${item.ai_question_for_dev}\n` : '',
        item.page_url ? `**Page:** ${item.page_url}\n` : '',
        item.target_element ? `**Element:** \`<${item.target_element.tagName}>\` - ${item.target_element.selector}\n` : '',
        `**Status:** ${item.status} | **Created:** ${new Date(item.created_at).toLocaleDateString()}`,
        ``,
        `---`,
        ``,
      ].filter(Boolean).join('\n')),
    ].join('\n');

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lovable-prompts-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [items]);

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
            {displayItems.length} feedback item{displayItems.length !== 1 ? 's' : ''}
            {hasActiveFilters && ` (filtered from ${items.length})`}
          </p>
        </div>

        <div style={styles.headerActions}>
          <button onClick={refresh} style={styles.iconButton} title="Refresh">
            <Icons.Refresh />
          </button>
          {config.admin.exportEnabled && (
            <>
              <button onClick={handleExportAsPrompts} style={styles.exportPromptsButton} title="Export as Lovable Prompts">
                <Icons.FileText />
                <span>Export Prompts</span>
              </button>
              <button onClick={handleExport} style={styles.iconButton} title="Export CSV">
                <Icons.Download />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            ...styles.tab,
            ...(activeTab === 'all' ? styles.tabActive : {}),
          }}
        >
          <Icons.List />
          <span>All Feedback</span>
          <span style={styles.tabBadge}>{items.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('ai-enhanced')}
          style={{
            ...styles.tab,
            ...(activeTab === 'ai-enhanced' ? styles.tabActive : {}),
          }}
        >
          <Icons.Sparkles />
          <span>AI Enhanced</span>
          <span style={{
            ...styles.tabBadge,
            ...(activeTab === 'ai-enhanced' ? styles.tabBadgeAI : {}),
          }}>{aiEnhancedCount}</span>
        </button>
      </div>

      {/* Statistics (Standard/Pro tier) */}
      {config.admin.showStats && (
        <div style={styles.statsSection}>
          <FeedbackStats items={activeTab === 'ai-enhanced' ? displayItems : items} />
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
          {activeTab === 'ai-enhanced' && displayItems.length === 0 ? (
            <div style={styles.emptyState}>
              <Icons.Sparkles />
              <h3 style={styles.emptyTitle}>No AI-Enhanced Feedback Yet</h3>
              <p style={styles.emptyText}>
                AI-enhanced feedback will appear here when submitted through the Pro tier endpoint.
                These items include AI-generated summaries, categories, and developer questions.
              </p>
            </div>
          ) : (
            <FeedbackList
              items={displayItems}
              onSelect={setSelectedItem}
              selectedId={selectedItem?.id}
              isLoading={isLoading}
              showAIBadge={activeTab === 'ai-enhanced'}
            />
          )}
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
  exportPromptsButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    border: '1px solid #8b5cf6',
    borderRadius: 6,
    backgroundColor: '#faf5ff',
    cursor: 'pointer',
    color: '#7c3aed',
    fontSize: 13,
    fontWeight: 500,
    transition: 'all 0.15s',
  },
  tabsContainer: {
    display: 'flex',
    gap: 8,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 0,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 16px',
    border: 'none',
    borderBottom: '2px solid transparent',
    backgroundColor: 'transparent',
    color: '#6b7280',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    marginBottom: -1,
  },
  tabActive: {
    color: '#2563eb',
    borderBottomColor: '#2563eb',
  },
  tabBadge: {
    padding: '2px 8px',
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    fontSize: 12,
    fontWeight: 600,
  },
  tabBadgeAI: {
    backgroundColor: '#ede9fe',
    color: '#7c3aed',
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
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    textAlign: 'center',
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    border: '1px dashed #c4b5fd',
  },
  emptyTitle: {
    margin: '16px 0 8px',
    fontSize: 18,
    fontWeight: 600,
    color: '#5b21b6',
  },
  emptyText: {
    margin: 0,
    fontSize: 14,
    color: '#7c3aed',
    maxWidth: 300,
    lineHeight: 1.5,
  },
};

export default FeedbackDashboard;
