/**
 * Feedback Widget - Feedback Form
 * 
 * Clean form with smooth animations and dark mode support.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ElementPicker } from './ElementPicker';
import { getHtml2Canvas } from '@/lib/vendorScripts';
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
  Camera: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  ),
  Loader: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};

// ============================================
// DARK MODE DETECTION
// ============================================

function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const html = document.documentElement;
      const isDarkMode = 
        html.classList.contains('dark') || 
        html.getAttribute('data-theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isDarkMode);
    };

    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme'] 
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  return isDark;
}

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
// THEME HELPER
// ============================================

const getTheme = (isDark: boolean) => ({
  text: isDark ? '#f9fafb' : '#111827',
  textMuted: isDark ? '#9ca3af' : '#6b7280',
  textSecondary: isDark ? '#d1d5db' : '#374151',
  bg: isDark ? '#1f2937' : '#ffffff',
  bgSecondary: isDark ? '#374151' : '#f9fafb',
  bgHover: isDark ? '#4b5563' : '#f3f4f6',
  border: isDark ? '#4b5563' : '#e5e7eb',
  borderLight: isDark ? '#374151' : '#d1d5db',
  primary: '#3b82f6',
  primaryBg: isDark ? '#1e3a5f' : '#eff6ff',
  primaryBorder: isDark ? '#3b82f6' : '#bfdbfe',
});

// ============================================
// FEEDBACK FORM COMPONENT
// ============================================

export function FeedbackForm({ config, onSubmit, onCancel, isSubmitting }: FeedbackFormProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('other');
  const [severity, setSeverity] = useState<FeedbackSeverity>('medium');
  const [targetElement, setTargetElement] = useState<TargetElement | null>(null);
  const [isPickingElement, setIsPickingElement] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Contact fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  
  const isDarkMode = useIsDarkMode();
  const theme = getTheme(isDarkMode);

  const handleElementSelect = useCallback((element: TargetElement) => {
    setTargetElement(element);
    setIsPickingElement(false);
  }, []);

  const captureScreenshot = async () => {
    setIsCapturing(true);
    try {
      const html2canvas = await getHtml2Canvas();
      const canvas = await html2canvas(document.body, {
        scale: 1,
        logging: false,
        useCORS: true,
        allowTaint: true,
        ignoreElements: (el) => {
          // Ignore the feedback widget itself
          return el.closest('[data-feedback-widget]') !== null;
        },
      });
      // Compress to JPEG for smaller size
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      setScreenshot(dataUrl);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const validateContact = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    if (!validateContact()) return;

    const submission: FeedbackSubmission = {
      raw_text: text.trim(),
      category: config.features.categories ? category : undefined,
      severity: config.features.severityLevels ? severity : undefined,
      target_element: targetElement || undefined,
      screenshot: screenshot || undefined,
      page_url: window.location.href,
      submitter_name: name.trim(),
      submitter_email: email.trim(),
      submitter_phone: phone.trim() || undefined,
    };

    await onSubmit(submission);
  };

  const buttonColor = config.buttonColor || '#3b82f6';
  const styles = getStyles(theme);

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

        {/* Contact Fields */}
        <motion.div 
          style={styles.section}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.02 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={styles.label}>Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
                placeholder="Your name"
                style={{ ...styles.input, borderColor: errors.name ? '#ef4444' : theme.border }}
                required
              />
              {errors.name && <span style={styles.errorText}>{errors.name}</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                placeholder="your@email.com"
                style={{ ...styles.input, borderColor: errors.email ? '#ef4444' : theme.border }}
                required
              />
              {errors.email && <span style={styles.errorText}>{errors.email}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            <label style={styles.label}>Phone <span style={{ fontWeight: 400, color: theme.textMuted }}>(optional)</span></label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              style={styles.input}
            />
          </div>
        </motion.div>

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
                    borderColor: category === cat.value ? theme.primary : 'transparent',
                    backgroundColor: category === cat.value ? theme.primaryBg : theme.bgSecondary,
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
                    borderColor: severity === sev.value ? sev.color : theme.border,
                    backgroundColor: severity === sev.value ? `${sev.color}15` : 'transparent',
                    color: severity === sev.value ? sev.color : theme.textMuted,
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
                  whileHover={{ borderColor: theme.primary }}
                  style={styles.pickElementButton}
                >
                  <Icons.Target />
                  <span>Target a specific element</span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Screenshot capture */}
        {config.features.screenshotCapture && (
          <motion.div 
            style={styles.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            <AnimatePresence mode="wait">
              {screenshot ? (
                <motion.div 
                  key="screenshot-preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={styles.screenshotPreview}
                >
                  <img 
                    src={screenshot} 
                    alt="Screenshot" 
                    style={styles.screenshotImage}
                  />
                  <button 
                    type="button" 
                    onClick={() => setScreenshot(null)} 
                    style={styles.screenshotRemoveButton}
                  >
                    <Icons.X />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="capture"
                  type="button"
                  onClick={captureScreenshot}
                  disabled={isCapturing}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ borderColor: theme.primary }}
                  style={styles.pickElementButton}
                >
                  {isCapturing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Icons.Loader />
                    </motion.div>
                  ) : (
                    <Icons.Camera />
                  )}
                  <span>{isCapturing ? 'Capturing...' : 'Capture screenshot'}</span>
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
            backgroundColor: !text.trim() || isSubmitting ? theme.border : buttonColor,
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
// STYLES FACTORY
// ============================================

const getStyles = (theme: ReturnType<typeof getTheme>): Record<string, React.CSSProperties> => ({
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
    color: theme.text,
  },
  aiBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    fontSize: 11,
    fontWeight: 600,
    background: theme.primary,
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
    color: theme.textMuted,
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
    color: theme.textSecondary,
  },
  charCount: {
    fontSize: 12,
    color: theme.textMuted,
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
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: 500,
    color: theme.textMuted,
  },
  severityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 6,
  },
  severityButton: {
    padding: '8px 10px',
    border: '1px solid',
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
    border: `1px solid ${theme.border}`,
    borderRadius: 8,
    fontSize: 14,
    lineHeight: 1.5,
    resize: 'none',
    fontFamily: 'inherit',
    outline: 'none',
    backgroundColor: theme.bgSecondary,
    color: theme.text,
    boxSizing: 'border-box',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${theme.border}`,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    backgroundColor: theme.bgSecondary,
    color: theme.text,
    boxSizing: 'border-box',
  },
  errorText: {
    fontSize: 11,
    color: '#ef4444',
    marginTop: 2,
  },
  pickElementButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 16px',
    border: `1px dashed ${theme.borderLight}`,
    borderRadius: 8,
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 13,
    color: theme.textMuted,
    transition: 'all 0.15s',
    width: '100%',
  },
  elementPreview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    backgroundColor: theme.primaryBg,
    border: `1px solid ${theme.primaryBorder}`,
    borderRadius: 8,
  },
  elementInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: theme.primary,
  },
  elementTag: {
    fontWeight: 600,
    fontSize: 13,
  },
  elementText: {
    fontSize: 12,
    color: theme.textMuted,
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
    color: theme.textMuted,
  },
  screenshotPreview: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    border: `1px solid ${theme.primaryBorder}`,
  },
  screenshotImage: {
    width: '100%',
    height: 120,
    objectFit: 'cover',
    display: 'block',
  },
  screenshotRemoveButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    background: 'rgba(0,0,0,0.6)',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    color: 'white',
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
});

export default FeedbackForm;
