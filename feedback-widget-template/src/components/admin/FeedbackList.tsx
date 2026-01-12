/**
 * Feedback Widget Template - Feedback List
 * 
 * Displays a filterable list of feedback items for admins.
 */

import React from 'react';
import type { FeedbackListProps, FeedbackCategory, FeedbackSeverity, FeedbackStatus } from '../../types/feedback';

// ============================================
// BADGE CONFIGURATIONS
// ============================================

const CATEGORY_STYLES: Record<FeedbackCategory, { bg: string; text: string; emoji: string }> = {
  bug: { bg: '#fef2f2', text: '#dc2626', emoji: '🐛' },
  feature: { bg: '#eff6ff', text: '#2563eb', emoji: '✨' },
  ui_ux: { bg: '#f5f3ff', text: '#7c3aed', emoji: '🎨' },
  suggestion: { bg: '#f0fdf4', text: '#16a34a', emoji: '💡' },
  other: { bg: '#f9fafb', text: '#4b5563', emoji: '📝' },
};

const SEVERITY_STYLES: Record<FeedbackSeverity, { color: string }> = {
  low: { color: '#22c55e' },
  medium: { color: '#eab308' },
  high: { color: '#f97316' },
  critical: { color: '#ef4444' },
};

const STATUS_STYLES: Record<FeedbackStatus, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: '#d97706' },
  reviewed: { bg: '#dbeafe', text: '#2563eb' },
  resolved: { bg: '#dcfce7', text: '#16a34a' },
  dismissed: { bg: '#f3f4f6', text: '#6b7280' },
};

// ============================================
// LOADING SKELETON
// ============================================

function LoadingSkeleton() {
  return (
    <div style={styles.list}>
      {[1, 2, 3].map(i => (
        <div key={i} style={styles.skeletonItem}>
          <div style={{ ...styles.skeleton, width: '60%', height: 16 }} />
          <div style={{ ...styles.skeleton, width: '100%', height: 40, marginTop: 8 }} />
          <div style={{ ...styles.skeleton, width: '30%', height: 12, marginTop: 8 }} />
        </div>
      ))}
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================

function EmptyState() {
  return (
    <div style={styles.emptyState}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#374151' }}>
        No feedback yet
      </div>
      <div style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
        Feedback from users will appear here.
      </div>
    </div>
  );
}

// ============================================
// FEEDBACK LIST ITEM
// ============================================

interface FeedbackListItemProps {
  item: FeedbackListProps['items'][0];
  isSelected: boolean;
  onClick: () => void;
}

function FeedbackListItem({ item, isSelected, onClick }: FeedbackListItemProps) {
  const categoryStyle = CATEGORY_STYLES[item.category];
  const severityStyle = SEVERITY_STYLES[item.severity];
  const statusStyle = STATUS_STYLES[item.status];

  const timeAgo = getTimeAgo(new Date(item.created_at));

  return (
    <div
      style={{
        ...styles.listItem,
        borderColor: isSelected ? '#3b82f6' : '#e5e7eb',
        backgroundColor: isSelected ? '#f0f9ff' : 'white',
      }}
      onClick={onClick}
    >
      {/* Header with badges */}
      <div style={styles.itemHeader}>
        <div style={styles.badges}>
          {/* Category badge */}
          <span
            style={{
              ...styles.badge,
              backgroundColor: categoryStyle.bg,
              color: categoryStyle.text,
            }}
          >
            {categoryStyle.emoji} {item.category.replace('_', '/')}
          </span>

          {/* Status badge */}
          <span
            style={{
              ...styles.badge,
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
            }}
          >
            {item.status}
          </span>
        </div>

        {/* Severity indicator */}
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: severityStyle.color,
          }}
          title={`${item.severity} severity`}
        />
      </div>

      {/* Text preview */}
      <div style={styles.textPreview}>
        {item.ai_summary || item.raw_text}
      </div>

      {/* Footer */}
      <div style={styles.itemFooter}>
        {item.target_element && (
          <span style={styles.targetBadge}>
            📌 Element targeted
          </span>
        )}
        <span style={styles.timeAgo}>{timeAgo}</span>
      </div>
    </div>
  );
}

// ============================================
// FEEDBACK LIST COMPONENT
// ============================================

export function FeedbackList({ items, onSelect, selectedId, isLoading }: FeedbackListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <div style={styles.list}>
      {items.map(item => (
        <FeedbackListItem
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          onClick={() => onSelect(item)}
        />
      ))}
    </div>
  );
}

// ============================================
// UTILITIES
// ============================================

function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

// ============================================
// STYLES
// ============================================

const styles: Record<string, React.CSSProperties> = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  listItem: {
    padding: 16,
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badges: {
    display: 'flex',
    gap: 8,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 500,
    textTransform: 'capitalize',
  },
  textPreview: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  itemFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  targetBadge: {
    fontSize: 11,
    color: '#6b7280',
  },
  timeAgo: {
    fontSize: 11,
    color: '#9ca3af',
  },
  emptyState: {
    textAlign: 'center',
    padding: 48,
  },
  skeletonItem: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  skeleton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    animation: 'pulse 2s infinite',
  },
};

export default FeedbackList;
