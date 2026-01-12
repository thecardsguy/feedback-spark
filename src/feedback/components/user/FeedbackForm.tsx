/**
 * Feedback Widget - Feedback Form
 * 
 * Clean form with smooth animations. Supports categories, severity, and element targeting.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ElementPicker } from './ElementPicker';
import type { 
  FeedbackFormProps, 
  FeedbackSubmission, 
  FeedbackCategory, 
  FeedbackSeverity,
  TargetElement 
} from '../../types/feedback';

// ============================================
// ICONS
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
  Sparkles: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  ),
};

// ============================================
// OPTIONS
// ============================================

const CATEGORIES: { value: FeedbackCategory; label: string; emoji: string }[] = [
  { value: 'bug', label: 'Bug', emoji: '🐛' },
  { value: 'feature', label: 'Feature', emoji: '✨' },
  { value: 'ui_ux', label: 'Design', emoji: '🎨' },
  { value: 'suggestion', label: 'Idea', emoji: '💡' },
  { value: 'other', label: 'Other', emoji: '📝' },
];

const SEVERITIES: { value: FeedbackSeverity; label: string; color: string }[] = [
  { value: 'low', label: 'Minor', color: '#22c55e' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'Major', color: '#f97316' },
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

  const buttonColor = config.buttonColor || '#3b82f6';

  return (
    <>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h3 style={styles.title}>Send Feedback</h3>
            {config.ai?.enabled && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={styles.aiBadge}
              >
                <Icons.Sparkles />
                <span>AI</span>
              </motion.span>
            )}
          </div>
          <button type="button" onClick={onCancel} style={styles.closeButton}>
            <Icons.X />
          </button>
        </div>

        {/* Category selector */}
        {config.features.categories && (
          <motion.div 
            style={styles.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <label style={styles.label}>Type</label>
            <div style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  style={{
                    ...styles.categoryButton,
                    borderColor: category === cat.value ? '#3b82f6' : 'transparent',
                    backgroundColor: category === cat.value ? '#eff6ff' : '#f9fafb',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{cat.emoji}</span>
                  <span style={styles.categoryLabel}>{cat.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Severity selector */}
        {config.features.severityLevels && (
          <motion.div 
            style={styles.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label style={styles.label}>Priority</label>
            <div style={styles.severityGrid}>
              {SEVERITIES.map((sev) => (
                <button
                  key={sev.value}
                  type="button"
                  onClick={() => setSeverity(sev.value)}
                  style={{
                    ...styles.severityButton,
                    borderColor: severity === sev.value ? sev.color : '#e5e7eb',
                    backgroundColor: severity === sev.value ? `${sev.color}15` : 'transparent',
                    color: severity === sev.value ? sev.color : '#6b7280',
                  }}
                >
                  {sev.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Feedback text */}
        <motion.div 
          style={styles.section}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label style={styles.label}>
            Your feedback
            <span style={styles.charCount}>{text.length}/500</span>
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value.slice(0, 500))}
            placeholder="Describe your feedback, issue, or suggestion..."
            style={styles.textarea}
            rows={4}
            required
          />
        </motion.div>

        {/* Element targeting */}
        {config.features.elementPicker && (
          <motion.div 
            style={styles.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {targetElement ? (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={styles.elementPreview}
                >
                  <div style={styles.elementInfo}>
                    <Icons.Target />
                    <span style={styles.elementTag}>{targetElement.tagName.toLowerCase()}</span>
                    <span style={styles.elementText}>
                      {targetElement.textPreview || 'Element selected'}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setTargetElement(null)} 
                    style={styles.removeButton}
                  >
                    <Icons.X />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="picker"
                  type="button"
                  onClick={() => setIsPickingElement(true)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ borderColor: '#3b82f6' }}
                  style={styles.pickElementButton}
                >
                  <Icons.Target />
                  <span>Target a specific element</span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={!text.trim() || isSubmitting}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={!text.trim() || isSubmitting ? {} : { scale: 1.02 }}
          whileTap={!text.trim() || isSubmitting ? {} : { scale: 0.98 }}
          style={{
            ...styles.submitButton,
            backgroundColor: !text.trim() || isSubmitting ? '#d1d5db' : buttonColor,
            cursor: !text.trim() || isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={styles.spinner}
            />
          ) : (
            <Icons.Send />
          )}
          <span>{isSubmitting ? 'Sending...' : 'Submit'}</span>
        </motion.button>
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
    padding: 20,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
    color: '#111827',
  },
  aiBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    fontSize: 11,
    fontWeight: 600,
    background: '#3b82f6',
    color: 'white',
    borderRadius: 12,
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    color: '#6b7280',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
    fontWeight: 500,
    color: '#374151',
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: 400,
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 6,
  },
  categoryButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '10px 4px',
    border: '2px solid transparent',
    borderRadius: 8,
    background: '#f9fafb',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: 500,
    color: '#6b7280',
  },
  severityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 6,
  },
  severityButton: {
    padding: '8px 10px',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontSize: 12,
    fontWeight: 500,
  },
  textarea: {
    width: '100%',
    padding: 12,
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    fontSize: 14,
    lineHeight: 1.5,
    resize: 'none',
    fontFamily: 'inherit',
    outline: 'none',
    backgroundColor: '#f9fafb',
    boxSizing: 'border-box',
  },
  pickElementButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 16px',
    border: '1px dashed #d1d5db',
    borderRadius: 8,
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 13,
    color: '#6b7280',
    transition: 'all 0.15s',
    width: '100%',
  },
  elementPreview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 8,
  },
  elementInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#3b82f6',
  },
  elementTag: {
    fontWeight: 600,
    fontSize: 13,
  },
  elementText: {
    fontSize: 12,
    color: '#6b7280',
    maxWidth: 150,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  removeButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    color: '#6b7280',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 16px',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    color: 'white',
    transition: 'all 0.15s',
    marginTop: 4,
  },
  spinner: {
    width: 16,
    height: 16,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
  },
};

export default FeedbackForm;
