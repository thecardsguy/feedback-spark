/**
 * Feedback Widget Template - Feedback Form
 * 
 * Modern, sleek form with smooth animations and glassmorphism.
 * Supports categories, severity, and element targeting.
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  ),
  Sparkles: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  ),
};

// ============================================
// CATEGORY OPTIONS
// ============================================

const CATEGORIES: { value: FeedbackCategory; label: string; emoji: string; color: string }[] = [
  { value: 'bug', label: 'Bug', emoji: '🐛', color: 'hsl(0, 84%, 60%)' },
  { value: 'feature', label: 'Feature', emoji: '✨', color: 'hsl(280, 70%, 55%)' },
  { value: 'ui_ux', label: 'Design', emoji: '🎨', color: 'hsl(200, 80%, 50%)' },
  { value: 'suggestion', label: 'Idea', emoji: '💡', color: 'hsl(45, 90%, 50%)' },
  { value: 'other', label: 'Other', emoji: '📝', color: 'hsl(220, 10%, 50%)' },
];

const SEVERITIES: { value: FeedbackSeverity; label: string; color: string }[] = [
  { value: 'low', label: 'Minor', color: 'hsl(142, 71%, 45%)' },
  { value: 'medium', label: 'Medium', color: 'hsl(45, 90%, 50%)' },
  { value: 'high', label: 'Major', color: 'hsl(25, 95%, 53%)' },
  { value: 'critical', label: 'Critical', color: 'hsl(0, 84%, 60%)' },
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
  const buttonColor = config.buttonColor || 'hsl(32, 95%, 52%)';

  return (
    <>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h3 style={styles.title} className="dark:text-foreground">Send Feedback</h3>
            {config.ai.enabled && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={styles.aiBadge}
              >
                <Icons.Sparkles />
                <span>AI Enhanced</span>
              </motion.span>
            )}
          </div>
          <motion.button 
            type="button" 
            onClick={onCancel} 
            style={styles.closeButton}
            whileHover={{ scale: 1.1, backgroundColor: 'hsl(220, 14%, 94%)' }}
            whileTap={{ scale: 0.95 }}
            className="dark:hover:bg-secondary"
          >
            <Icons.X />
          </motion.button>
        </div>

        {/* Category selector */}
        {config.features.categories && (
          <motion.div 
            style={styles.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <label style={styles.label} className="dark:text-muted-foreground">What type of feedback?</label>
            <div style={styles.categoryGrid}>
              {CATEGORIES.map((cat, index) => (
                <motion.button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 + index * 0.03 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    ...styles.categoryButton,
                    borderColor: category === cat.value ? cat.color : 'transparent',
                    backgroundColor: category === cat.value ? `${cat.color}15` : 'hsl(220, 14%, 96%)',
                  }}
                  className="dark:bg-secondary"
                >
                  <span style={{ fontSize: 18 }}>{cat.emoji}</span>
                  <span style={{ 
                    fontSize: 11, 
                    fontWeight: 500,
                    color: category === cat.value ? cat.color : 'hsl(220, 10%, 40%)',
                  }} className="dark:text-muted-foreground">{cat.label}</span>
                </motion.button>
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
            <label style={styles.label} className="dark:text-muted-foreground">How important is this?</label>
            <div style={styles.severityGrid}>
              {SEVERITIES.map((sev, index) => (
                <motion.button
                  key={sev.value}
                  type="button"
                  onClick={() => setSeverity(sev.value)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.03 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    ...styles.severityButton,
                    borderColor: severity === sev.value ? sev.color : 'hsl(220, 13%, 91%)',
                    backgroundColor: severity === sev.value ? `${sev.color}15` : 'transparent',
                  }}
                  className="dark:border-border"
                >
                  <motion.span 
                    animate={{ 
                      scale: severity === sev.value ? [1, 1.3, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: sev.color,
                      boxShadow: severity === sev.value ? `0 0 8px ${sev.color}` : 'none',
                    }} 
                  />
                  <span style={{ 
                    fontSize: 12, 
                    fontWeight: 500,
                    color: severity === sev.value ? sev.color : 'hsl(220, 10%, 40%)',
                  }} className="dark:text-muted-foreground">{sev.label}</span>
                </motion.button>
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
          <label style={styles.label} className="dark:text-muted-foreground">Tell us more</label>
          <div style={{ position: 'relative' }}>
            <motion.div
              animate={{
                opacity: focusedField === 'text' ? 1 : 0,
              }}
              style={{
                position: 'absolute',
                inset: -2,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${buttonColor}40, hsl(280, 70%, 55%)40)`,
                zIndex: -1,
              }}
            />
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onFocus={() => setFocusedField('text')}
              onBlur={() => setFocusedField(null)}
              placeholder="Describe your feedback, issue, or suggestion..."
              style={styles.textarea}
              className="dark:bg-secondary dark:text-foreground dark:border-border dark:placeholder:text-muted-foreground"
              rows={4}
              required
            />
          </div>
          <div style={styles.charCount} className="dark:text-muted-foreground">
            {text.length > 0 && `${text.length} characters`}
          </div>
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
                  className="dark:bg-secondary"
                >
                  <div style={styles.elementInfo}>
                    <span style={styles.elementTag}>&lt;{targetElement.tagName}&gt;</span>
                    <span style={styles.elementText} className="dark:text-muted-foreground">
                      {targetElement.textPreview || 'No text content'}
                    </span>
                  </div>
                  <motion.button 
                    type="button" 
                    onClick={clearTargetElement} 
                    style={styles.removeButton}
                    whileHover={{ scale: 1.1, backgroundColor: 'hsl(0, 84%, 95%)' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icons.X />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  key="picker"
                  type="button"
                  onClick={() => setIsPickingElement(true)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ 
                    scale: 1.01, 
                    borderColor: buttonColor,
                    backgroundColor: `${buttonColor}08`,
                  }}
                  whileTap={{ scale: 0.99 }}
                  style={styles.pickElementButton}
                  className="dark:border-border dark:text-muted-foreground"
                >
                  <Icons.Target />
                  <span>Click to target a specific element</span>
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
          whileHover={!text.trim() || isSubmitting ? {} : { scale: 1.02, y: -1 }}
          whileTap={!text.trim() || isSubmitting ? {} : { scale: 0.98 }}
          style={{
            ...styles.submitButton,
            background: !text.trim() || isSubmitting 
              ? 'hsl(220, 14%, 80%)'
              : `linear-gradient(135deg, ${buttonColor} 0%, hsl(24, 95%, 48%) 100%)`,
            cursor: !text.trim() || isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: !text.trim() || isSubmitting 
              ? 'none'
              : `0 4px 16px -4px ${buttonColor}80`,
          }}
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 16,
                height: 16,
                border: '2px solid white',
                borderTopColor: 'transparent',
                borderRadius: '50%',
              }}
            />
          ) : (
            <Icons.Send />
          )}
          <span>{isSubmitting ? 'Sending...' : 'Send Feedback'}</span>
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
    gap: 10,
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
    color: 'hsl(220, 20%, 14%)',
  },
  aiBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 8px',
    fontSize: 10,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    background: 'linear-gradient(135deg, hsl(280, 70%, 55%) 0%, hsl(320, 70%, 50%) 100%)',
    color: 'white',
    borderRadius: 20,
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    color: 'hsl(220, 10%, 46%)',
    transition: 'background 0.15s',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: 'hsl(220, 10%, 46%)',
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
    padding: '10px 4px',
    border: '2px solid transparent',
    borderRadius: 12,
    background: 'hsl(220, 14%, 96%)',
    cursor: 'pointer',
    transition: 'all 0.15s',
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
    padding: '10px 8px',
    border: '2px solid hsl(220, 13%, 91%)',
    borderRadius: 10,
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  textarea: {
    width: '100%',
    padding: 14,
    border: '2px solid hsl(220, 13%, 91%)',
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.5,
    resize: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    outline: 'none',
    backgroundColor: 'hsl(220, 14%, 98%)',
  },
  charCount: {
    fontSize: 11,
    color: 'hsl(220, 10%, 60%)',
    textAlign: 'right',
    minHeight: 16,
  },
  pickElementButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 16px',
    border: '2px dashed hsl(220, 13%, 85%)',
    borderRadius: 12,
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 13,
    color: 'hsl(220, 10%, 46%)',
    transition: 'all 0.15s',
    width: '100%',
    justifyContent: 'center',
  },
  elementPreview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    backgroundColor: 'hsl(220, 14%, 96%)',
    borderRadius: 12,
    border: '2px solid hsl(220, 13%, 91%)',
  },
  elementInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  elementTag: {
    fontSize: 11,
    fontWeight: 600,
    color: 'hsl(200, 80%, 45%)',
    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
    padding: '2px 6px',
    backgroundColor: 'hsl(200, 80%, 95%)',
    borderRadius: 4,
  },
  elementText: {
    fontSize: 12,
    color: 'hsl(220, 10%, 46%)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 180,
  },
  removeButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    display: 'flex',
    color: 'hsl(0, 84%, 60%)',
    borderRadius: 6,
    transition: 'background 0.15s',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '14px 20px',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    transition: 'all 0.2s',
    marginTop: 4,
  },
};

export default FeedbackForm;
