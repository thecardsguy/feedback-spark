/**
 * Feedback Widget Template - Feedback Detail
 * 
 * Detailed view of a single feedback item with AI insights and actions.
 */

import React, { useState, useCallback } from 'react';
import type { FeedbackDetailProps, FeedbackStatus } from '../../types/feedback';

// ============================================
// ICONS
// ============================================

const Icons = {
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Copy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Target: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Sparkles: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  ),
};

// ============================================
// STATUS OPTIONS
// ============================================

const STATUS_OPTIONS: { value: FeedbackStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: '#d97706' },
  { value: 'reviewed', label: 'Reviewed', color: '#2563eb' },
  { value: 'resolved', label: 'Resolved', color: '#16a34a' },
  { value: 'dismissed', label: 'Dismissed', color: '#6b7280' },
];

// ============================================
// SECTION COMPONENT
// ============================================

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        {icon}
        <span>{title}</span>
      </div>
      <div style={styles.sectionContent}>{children}</div>
    </div>
  );
}

// ============================================
// FEEDBACK DETAIL COMPONENT
// ============================================

export function FeedbackDetail({ item, config, onStatusChange, onClose }: FeedbackDetailProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const generateDevPrompt = () => {
    const parts = [
      `# User Feedback`,
      ``,
      `## Category: ${item.category}`,
      `## Severity: ${item.severity}`,
      `## Page: ${item.page_url || 'Not specified'}`,
      ``,
      `## User's Feedback`,
      item.raw_text,
    ];

    if (item.ai_summary) {
      parts.push(``, `## AI Summary`, item.ai_summary);
    }

    if (item.ai_question_for_dev) {
      parts.push(``, `## AI Question for Developer`, item.ai_question_for_dev);
    }

    if (item.target_element) {
      parts.push(
        ``,
        `## Targeted Element`,
        `- Selector: \`${item.target_element.selector}\``,
        `- Tag: \`<${item.target_element.tagName}>\``,
        item.target_element.textPreview ? `- Text: "${item.target_element.textPreview}"` : ''
      );
    }

    return parts.filter(Boolean).join('\n');
  };

  const formattedDate = new Date(item.created_at).toLocaleString();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Feedback Details</h3>
        <button onClick={onClose} style={styles.closeButton}>
          <Icons.X />
        </button>
      </div>

      {/* Metadata */}
      <div style={styles.metadata}>
        <div style={styles.metaRow}>
          <span style={styles.metaLabel}>Category</span>
          <span style={styles.metaValue}>{item.category}</span>
        </div>
        <div style={styles.metaRow}>
          <span style={styles.metaLabel}>Severity</span>
          <span style={styles.metaValue}>{item.severity}</span>
        </div>
        <div style={styles.metaRow}>
          <span style={styles.metaLabel}>Submitted</span>
          <span style={styles.metaValue}>{formattedDate}</span>
        </div>
        {item.page_url && (
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Page</span>
            <a href={item.page_url} target="_blank" rel="noopener noreferrer" style={styles.link}>
              {new URL(item.page_url).pathname}
            </a>
          </div>
        )}
      </div>

      {/* Original Feedback */}
      <Section title="Original Feedback">
        <div style={styles.feedbackText}>{item.raw_text}</div>
      </Section>

      {/* AI Insights (Pro tier) */}
      {config.ai.enabled && item.ai_summary && (
        <Section title="AI Summary" icon={<Icons.Sparkles />}>
          <div style={styles.aiContent}>{item.ai_summary}</div>
        </Section>
      )}

      {config.ai.enabled && item.ai_question_for_dev && (
        <Section title="AI Question for Developer" icon={<Icons.Sparkles />}>
          <div style={styles.aiContent}>{item.ai_question_for_dev}</div>
        </Section>
      )}

      {/* Targeted Element */}
      {item.target_element && (
        <Section title="Targeted Element" icon={<Icons.Target />}>
          <div style={styles.elementInfo}>
            <code style={styles.code}>&lt;{item.target_element.tagName}&gt;</code>
            <div style={styles.selector}>{item.target_element.selector}</div>
            {item.target_element.textPreview && (
              <div style={styles.textPreview}>"{item.target_element.textPreview}"</div>
            )}
          </div>
        </Section>
      )}

      {/* Actions */}
      <div style={styles.actions}>
        {/* Status selector */}
        {config.admin.statusUpdates && onStatusChange && (
          <div style={styles.statusSection}>
            <label style={styles.statusLabel}>Status</label>
            <select
              value={item.status}
              onChange={e => onStatusChange(e.target.value as FeedbackStatus)}
              style={styles.statusSelect}
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Copy to clipboard */}
        {config.admin.copyToClipboard && (
          <button
            onClick={() => copyToClipboard(generateDevPrompt())}
            style={styles.copyButton}
          >
            {copied ? <Icons.Check /> : <Icons.Copy />}
            <span>{copied ? 'Copied!' : 'Copy as Prompt'}</span>
          </button>
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
    gap: 20,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    color: '#6b7280',
  },
  metadata: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  metaRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  metaLabel: {
    fontSize: 11,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: 500,
    color: '#1f2937',
    textTransform: 'capitalize',
  },
  link: {
    fontSize: 14,
    color: '#2563eb',
    textDecoration: 'none',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    fontWeight: 600,
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  sectionContent: {},
  feedbackText: {
    fontSize: 15,
    lineHeight: 1.6,
    color: '#1f2937',
    whiteSpace: 'pre-wrap',
  },
  aiContent: {
    fontSize: 14,
    lineHeight: 1.6,
    color: '#4b5563',
    padding: 12,
    backgroundColor: '#faf5ff',
    borderRadius: 8,
    borderLeft: '3px solid #8b5cf6',
  },
  elementInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  code: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2563eb',
  },
  selector: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
  },
  textPreview: {
    fontSize: 13,
    color: '#4b5563',
    fontStyle: 'italic',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTop: '1px solid #e5e7eb',
  },
  statusSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: '#374151',
  },
  statusSelect: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 13,
    cursor: 'pointer',
  },
  copyButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    backgroundColor: '#1f2937',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },
};

export default FeedbackDetail;
