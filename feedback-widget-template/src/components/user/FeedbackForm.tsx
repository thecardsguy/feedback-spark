/**
 * Feedback Widget Template - Feedback Form
 * 
 * The main form for submitting feedback. Supports:
 * - Text input
 * - Category selection (optional)
 * - Severity selection (optional)
 * - Element targeting (optional)
 */

import React, { useState, useCallback } from 'react';
import { ElementPicker } from './ElementPicker';
import type { 
  FeedbackFormProps, 
  FeedbackSubmission, 
  FeedbackCategory, 
  FeedbackSeverity,
  TargetElement 
} from '../../types/feedback';

// ============================================
// ICONS (inline SVG for portability)
// ============================================

const Icons = {
  Target: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Loader: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  ),
};

// ============================================
// CATEGORY OPTIONS
// ============================================

const CATEGORIES: { value: FeedbackCategory; label: string; emoji: string }[] = [
  { value: 'bug', label: 'Bug', emoji: '🐛' },
  { value: 'feature', label: 'Feature', emoji: '✨' },
  { value: 'ui_ux', label: 'UI/UX', emoji: '🎨' },
  { value: 'suggestion', label: 'Idea', emoji: '💡' },
  { value: 'other', label: 'Other', emoji: '📝' },
];

const SEVERITIES: { value: FeedbackSeverity; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#22c55e' },
  { value: 'medium', label: 'Medium', color: '#eab308' },
  { value: 'high', label: 'High', color: '#f97316' },
  { value: 'critical', label: 'Critical', color: '#ef4444' },
];

// ============================================
// FEEDBACK FORM COMPONENT
// ============================================

export function FeedbackForm({ config, onSubmit, onCancel, isSubmitting }: FeedbackFormProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('other');
  const [severity, setSeverity] = useState<FeedbackSeverity>('medium');
  const [targetElement, setTargetElement] = useState<TargetElement | null>(null);
  const [isPickingElement, setIsPickingElement] = useState(false);

  const handleElementSelect = useCallback((element: TargetElement) => {
    setTargetElement(element);
    setIsPickingElement(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) return;

    const submission: FeedbackSubmission = {
      raw_text: text.trim(),
      category: config.features.categories ? category : undefined,
      severity: config.features.severityLevels ? severity : undefined,
      target_element: targetElement || undefined,
      page_url: window.location.href,
    };

    await onSubmit(submission);
  };

  const clearTargetElement = () => setTargetElement(null);

  return (
    <>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Header */}
        <div style={styles.header}>
          <h3 style={styles.title}>Send Feedback</h3>
          <button type="button" onClick={onCancel} style={styles.closeButton}>
            <Icons.X />
          </button>
        </div>

        {/* Category selector */}
        {config.features.categories && (
          <div style={styles.section}>
            <label style={styles.label}>Category</label>
            <div style={styles.categoryGrid}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  style={{
                    ...styles.categoryButton,
                    ...(category === cat.value ? styles.categoryButtonActive : {}),
                  }}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Severity selector */}
        {config.features.severityLevels && (
          <div style={styles.section}>
            <label style={styles.label}>Severity</label>
            <div style={styles.severityGrid}>
              {SEVERITIES.map(sev => (
                <button
                  key={sev.value}
                  type="button"
                  onClick={() => setSeverity(sev.value)}
                  style={{
                    ...styles.severityButton,
                    borderColor: severity === sev.value ? sev.color : 'transparent',
                    backgroundColor: severity === sev.value ? `${sev.color}20` : 'transparent',
                  }}
                >
                  <span style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: sev.color 
                  }} />
                  <span>{sev.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback text */}
        <div style={styles.section}>
          <label style={styles.label}>Your feedback</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Describe your feedback, issue, or suggestion..."
            style={styles.textarea}
            rows={4}
            required
          />
        </div>

        {/* Element targeting */}
        {config.features.elementPicker && (
          <div style={styles.section}>
            {targetElement ? (
              <div style={styles.elementPreview}>
                <div style={styles.elementInfo}>
                  <span style={styles.elementTag}>&lt;{targetElement.tagName}&gt;</span>
                  <span style={styles.elementText}>{targetElement.textPreview || 'No text'}</span>
                </div>
                <button type="button" onClick={clearTargetElement} style={styles.removeButton}>
                  <Icons.X />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsPickingElement(true)}
                style={styles.pickElementButton}
              >
                <Icons.Target />
                <span>Target an element</span>
              </button>
            )}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          style={{
            ...styles.submitButton,
            opacity: !text.trim() || isSubmitting ? 0.5 : 1,
          }}
        >
          {isSubmitting ? <Icons.Loader /> : <Icons.Send />}
          <span>{isSubmitting ? 'Sending...' : 'Send Feedback'}</span>
        </button>
      </form>

      {/* Element Picker overlay */}
      <ElementPicker
        isActive={isPickingElement}
        onSelect={handleElementSelect}
        onCancel={() => setIsPickingElement(false)}
      />
    </>
  );
}

// ============================================
// STYLES
// ============================================

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: 16,
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    color: '#6b7280',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 8,
  },
  categoryButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '8px 4px',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    background: 'none',
    cursor: 'pointer',
    fontSize: 11,
    transition: 'all 0.15s',
  },
  categoryButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  severityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 8,
  },
  severityButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '8px 12px',
    border: '2px solid transparent',
    borderRadius: 8,
    background: 'none',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
    transition: 'all 0.15s',
  },
  textarea: {
    width: '100%',
    padding: 12,
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    fontSize: 14,
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  pickElementButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    border: '1px dashed #d1d5db',
    borderRadius: 8,
    background: 'none',
    cursor: 'pointer',
    fontSize: 13,
    color: '#6b7280',
    transition: 'all 0.15s',
    width: '100%',
    justifyContent: 'center',
  },
  elementPreview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  elementInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  elementTag: {
    fontSize: 12,
    fontWeight: 600,
    color: '#3b82f6',
    fontFamily: 'monospace',
  },
  elementText: {
    fontSize: 12,
    color: '#6b7280',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  removeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    color: '#6b7280',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
};

export default FeedbackForm;
