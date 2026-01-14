/**
 * Template: Admin Components (FeedbackDashboard, FeedbackList, FeedbackDetail, FeedbackStats)
 * Extracted from DownloadTemplate.tsx for better organization
 */

export const FEEDBACK_DASHBOARD_FILE = `/**
 * Feedback Dashboard - Admin interface for managing feedback
 * 
 * See full implementation at: https://github.com/thecardsguy/feedback-chatbot
 */

import React, { useState, useCallback } from 'react';
import { FeedbackStats } from './FeedbackStats';
import { FeedbackList } from './FeedbackList';
import { FeedbackDetail } from './FeedbackDetail';
import { useFeedback, useFeedbackFilters } from '../../hooks/useFeedback';
import type { FeedbackDashboardProps, FeedbackItem, FeedbackStatus } from '../../types/feedback';

export function FeedbackDashboard({ config }: FeedbackDashboardProps) {
  const { items, isLoading, refresh, updateStatus } = useFeedback({ aiEnabled: config.ai.enabled });
  const { filteredItems, setSearch, clearFilters } = useFeedbackFilters(items);
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);

  const handleStatusChange = useCallback(async (status: FeedbackStatus) => {
    if (!selectedItem) return;
    await updateStatus(selectedItem.id, status);
    setSelectedItem(prev => prev ? { ...prev, status } : null);
  }, [selectedItem, updateStatus]);

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Feedback Dashboard</h1>
          <p style={{ margin: '4px 0 0', color: '#6b7280' }}>{items.length} feedback items</p>
        </div>
        <button onClick={refresh} style={{ padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: 6, background: 'white', cursor: 'pointer' }}>Refresh</button>
      </div>

      {config.admin.showStats && <div style={{ marginBottom: 24 }}><FeedbackStats items={items} /></div>}

      <input type="text" placeholder="Search feedback..." onChange={e => setSearch(e.target.value || undefined)} style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 16, fontSize: 14 }} />

      <div style={{ display: 'grid', gridTemplateColumns: selectedItem ? '1fr 400px' : '1fr', gap: 24 }}>
        <FeedbackList items={filteredItems} onSelect={setSelectedItem} selectedId={selectedItem?.id} isLoading={isLoading} />
        {selectedItem && <FeedbackDetail item={selectedItem} config={config} onStatusChange={config.admin.statusUpdates ? handleStatusChange : undefined} onClose={() => setSelectedItem(null)} />}
      </div>
    </div>
  );
}

export default FeedbackDashboard;
`;

export const FEEDBACK_LIST_FILE = `/**
 * Feedback List - Displays feedback items
 */

import React from 'react';
import type { FeedbackListProps } from '../../types/feedback';

const CATEGORY_STYLES = {
  bug: { bg: '#fef2f2', text: '#dc2626', emoji: '🐛' },
  feature: { bg: '#eff6ff', text: '#2563eb', emoji: '✨' },
  ui_ux: { bg: '#f5f3ff', text: '#7c3aed', emoji: '🎨' },
  suggestion: { bg: '#f0fdf4', text: '#16a34a', emoji: '💡' },
  other: { bg: '#f9fafb', text: '#4b5563', emoji: '📝' },
};

const STATUS_STYLES = {
  pending: { bg: '#fef3c7', text: '#d97706' },
  reviewed: { bg: '#dbeafe', text: '#2563eb' },
  resolved: { bg: '#dcfce7', text: '#16a34a' },
  dismissed: { bg: '#f3f4f6', text: '#6b7280' },
};

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return \`\${Math.floor(seconds / 60)}m ago\`;
  if (seconds < 86400) return \`\${Math.floor(seconds / 3600)}h ago\`;
  return date.toLocaleDateString();
}

export function FeedbackList({ items, onSelect, selectedId, isLoading }: FeedbackListProps & { showAIBadge?: boolean }) {
  if (isLoading) return <div style={{ textAlign: 'center', padding: 48, color: '#6b7280' }}>Loading...</div>;
  if (items.length === 0) return <div style={{ textAlign: 'center', padding: 48 }}><div style={{ fontSize: 48, marginBottom: 16 }}>📭</div><div style={{ color: '#374151' }}>No feedback yet</div></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map(item => {
        const catStyle = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.other;
        const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.pending;
        return (
          <div key={item.id} onClick={() => onSelect(item)} style={{ padding: 16, border: '1px solid', borderColor: selectedId === item.id ? '#3b82f6' : '#e5e7eb', borderRadius: 8, backgroundColor: selectedId === item.id ? '#f0f9ff' : 'white', cursor: 'pointer' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span style={{ padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, backgroundColor: catStyle.bg, color: catStyle.text }}>{catStyle.emoji} {item.category}</span>
              <span style={{ padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, backgroundColor: statusStyle.bg, color: statusStyle.text }}>{item.status}</span>
            </div>
            <div style={{ fontSize: 14, color: '#374151', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.ai_summary || item.raw_text}</div>
            <div style={{ marginTop: 12, fontSize: 11, color: '#9ca3af' }}>{getTimeAgo(new Date(item.created_at))}</div>
          </div>
        );
      })}
    </div>
  );
}

export default FeedbackList;
`;

export const FEEDBACK_DETAIL_FILE = `/**
 * Feedback Detail - Single feedback item view
 */

import React, { useState, useCallback } from 'react';
import type { FeedbackDetailProps, FeedbackStatus } from '../../types/feedback';

const STATUS_OPTIONS: { value: FeedbackStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
];

export function FeedbackDetail({ item, config, onStatusChange, onClose }: FeedbackDetailProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    const parts = [\`# User Feedback\`, \`Category: \${item.category}\`, \`Severity: \${item.severity}\`, \`\`, item.raw_text];
    if (item.ai_summary) parts.push(\`\`, \`## AI Summary\`, item.ai_summary);
    if (item.ai_question_for_dev) parts.push(\`\`, \`## AI Question\`, item.ai_question_for_dev);
    navigator.clipboard.writeText(parts.join('\\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [item]);

  return (
    <div style={{ padding: 24, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Feedback Details</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, padding: 16, backgroundColor: '#f9fafb', borderRadius: 8, marginBottom: 20 }}>
        <div><div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase' }}>Category</div><div style={{ fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>{item.category}</div></div>
        <div><div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase' }}>Severity</div><div style={{ fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>{item.severity}</div></div>
        <div><div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase' }}>Status</div><div style={{ fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>{item.status}</div></div>
        <div><div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase' }}>Submitted</div><div style={{ fontSize: 14 }}>{new Date(item.created_at).toLocaleDateString()}</div></div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8, textTransform: 'uppercase' }}>Original Feedback</div>
        <div style={{ fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{item.raw_text}</div>
      </div>

      {item.ai_summary && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8, textTransform: 'uppercase' }}>✨ AI Summary</div>
          <div style={{ padding: 12, backgroundColor: '#faf5ff', borderRadius: 8, borderLeft: '3px solid #8b5cf6', fontSize: 14, lineHeight: 1.6 }}>{item.ai_summary}</div>
        </div>
      )}

      {item.ai_question_for_dev && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8, textTransform: 'uppercase' }}>✨ AI Question for Developer</div>
          <div style={{ padding: 12, backgroundColor: '#faf5ff', borderRadius: 8, borderLeft: '3px solid #8b5cf6', fontSize: 14, lineHeight: 1.6 }}>{item.ai_question_for_dev}</div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
        {config.admin.statusUpdates && onStatusChange && (
          <select value={item.status} onChange={e => onStatusChange(e.target.value as FeedbackStatus)} style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}>
            {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        )}
        {config.admin.copyToClipboard && (
          <button onClick={copyToClipboard} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', backgroundColor: '#1f2937', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            {copied ? '✓ Copied!' : 'Copy as Prompt'}
          </button>
        )}
      </div>
    </div>
  );
}

export default FeedbackDetail;
`;

export const FEEDBACK_STATS_FILE = `/**
 * Feedback Stats - Statistics overview
 */

import React from 'react';
import type { FeedbackStatsProps } from '../../types/feedback';
import { useFeedbackStats } from '../../hooks/useFeedback';

export function FeedbackStats({ items }: FeedbackStatsProps) {
  const stats = useFeedbackStats(items);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <div style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>TOTAL</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.totalCount}</div>
      </div>
      <div style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>PENDING</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#f97316' }}>{stats.byStatus.pending}</div>
      </div>
      <div style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>RESOLVED</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#22c55e' }}>{stats.byStatus.resolved}</div>
      </div>
      <div style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>CRITICAL</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#ef4444' }}>{stats.bySeverity.critical}</div>
      </div>
    </div>
  );
}

export default FeedbackStats;
`;
