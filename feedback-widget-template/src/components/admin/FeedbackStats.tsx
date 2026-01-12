/**
 * Feedback Widget Template - Feedback Statistics
 * 
 * Displays aggregated statistics about feedback for admin dashboards.
 */

import React from 'react';
import type { FeedbackStatsProps, FeedbackCategory, FeedbackSeverity, FeedbackStatus } from '../../types/feedback';
import { useFeedbackStats } from '../../hooks/useFeedback';

// ============================================
// CONFIGURATION
// ============================================

const CATEGORY_CONFIG: Record<FeedbackCategory, { label: string; color: string; emoji: string }> = {
  bug: { label: 'Bugs', color: '#ef4444', emoji: '🐛' },
  feature: { label: 'Features', color: '#3b82f6', emoji: '✨' },
  ui_ux: { label: 'UI/UX', color: '#8b5cf6', emoji: '🎨' },
  suggestion: { label: 'Suggestions', color: '#22c55e', emoji: '💡' },
  other: { label: 'Other', color: '#6b7280', emoji: '📝' },
};

const SEVERITY_CONFIG: Record<FeedbackSeverity, { label: string; color: string }> = {
  low: { label: 'Low', color: '#22c55e' },
  medium: { label: 'Medium', color: '#eab308' },
  high: { label: 'High', color: '#f97316' },
  critical: { label: 'Critical', color: '#ef4444' },
};

const STATUS_CONFIG: Record<FeedbackStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: '#6b7280' },
  reviewed: { label: 'Reviewed', color: '#3b82f6' },
  resolved: { label: 'Resolved', color: '#22c55e' },
  dismissed: { label: 'Dismissed', color: '#9ca3af' },
};

// ============================================
// STAT CARD COMPONENT
// ============================================

interface StatCardProps {
  title: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
}

function StatCard({ title, value, trend, color }: StatCardProps) {
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  const trendColor = trend === 'up' ? '#ef4444' : trend === 'down' ? '#22c55e' : '#6b7280';

  return (
    <div style={styles.statCard}>
      <div style={styles.statTitle}>{title}</div>
      <div style={{ ...styles.statValue, color: color || '#1f2937' }}>
        {value}
        {trend && (
          <span style={{ ...styles.trend, color: trendColor }}>{trendIcon}</span>
        )}
      </div>
    </div>
  );
}

// ============================================
// PROGRESS BAR COMPONENT
// ============================================

interface ProgressBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
  emoji?: string;
}

function ProgressBar({ label, value, total, color, emoji }: ProgressBarProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div style={styles.progressRow}>
      <div style={styles.progressLabel}>
        {emoji && <span style={{ marginRight: 6 }}>{emoji}</span>}
        {label}
      </div>
      <div style={styles.progressBarContainer}>
        <div
          style={{
            ...styles.progressBar,
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <div style={styles.progressValue}>{value}</div>
    </div>
  );
}

// ============================================
// FEEDBACK STATS COMPONENT
// ============================================

export function FeedbackStats({ items }: FeedbackStatsProps) {
  const stats = useFeedbackStats(items);

  return (
    <div style={styles.container}>
      {/* Overview cards */}
      <div style={styles.cardsGrid}>
        <StatCard 
          title="Total Feedback" 
          value={stats.totalCount} 
          trend={stats.recentTrend}
        />
        <StatCard 
          title="Pending" 
          value={stats.byStatus.pending} 
          color="#f97316"
        />
        <StatCard 
          title="Resolved" 
          value={stats.byStatus.resolved} 
          color="#22c55e"
        />
        <StatCard 
          title="Critical Issues" 
          value={stats.bySeverity.critical} 
          color="#ef4444"
        />
      </div>

      {/* Category breakdown */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>By Category</h4>
        {(Object.entries(CATEGORY_CONFIG) as [FeedbackCategory, typeof CATEGORY_CONFIG.bug][]).map(
          ([key, config]) => (
            <ProgressBar
              key={key}
              label={config.label}
              value={stats.byCategory[key]}
              total={stats.totalCount}
              color={config.color}
              emoji={config.emoji}
            />
          )
        )}
      </div>

      {/* Severity breakdown */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>By Severity</h4>
        {(Object.entries(SEVERITY_CONFIG) as [FeedbackSeverity, typeof SEVERITY_CONFIG.low][]).map(
          ([key, config]) => (
            <ProgressBar
              key={key}
              label={config.label}
              value={stats.bySeverity[key]}
              total={stats.totalCount}
              color={config.color}
            />
          )
        )}
      </div>

      {/* Status breakdown */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>By Status</h4>
        {(Object.entries(STATUS_CONFIG) as [FeedbackStatus, typeof STATUS_CONFIG.pending][]).map(
          ([key, config]) => (
            <ProgressBar
              key={key}
              label={config.label}
              value={stats.byStatus[key]}
              total={stats.totalCount}
              color={config.color}
            />
          )
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
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 16,
  },
  statCard: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  trend: {
    fontSize: 14,
    fontWeight: 500,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    margin: 0,
  },
  progressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  progressLabel: {
    width: 120,
    fontSize: 13,
    color: '#4b5563',
    display: 'flex',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  progressValue: {
    width: 32,
    fontSize: 13,
    fontWeight: 500,
    color: '#374151',
    textAlign: 'right',
  },
};

export default FeedbackStats;
