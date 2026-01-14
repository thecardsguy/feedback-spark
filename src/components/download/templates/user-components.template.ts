/**
 * Template: User Components (FeedbackButton, FeedbackForm, ElementPicker)
 * Extracted from DownloadTemplate.tsx for better organization
 */

export const FEEDBACK_BUTTON_FILE = `/**
 * Feedback Button - Floating button that opens the feedback form
 * 
 * Requires: framer-motion
 * npm install framer-motion
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackForm } from './FeedbackForm';
import { useFeedback } from '../../hooks/useFeedback';
import type { FeedbackButtonProps, FeedbackSubmission, WidgetPosition } from '../../types/feedback';

const MessageIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const CheckIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>;

const getPositionStyles = (position: WidgetPosition): React.CSSProperties => {
  const base: React.CSSProperties = { position: 'fixed', zIndex: 9999 };
  switch (position) {
    case 'bottom-right': return { ...base, bottom: 20, right: 20 };
    case 'bottom-left': return { ...base, bottom: 20, left: 20 };
    case 'top-right': return { ...base, top: 20, right: 20 };
    case 'top-left': return { ...base, top: 20, left: 20 };
    default: return { ...base, bottom: 20, right: 20 };
  }
};

export function FeedbackButton({ config, className }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { submit } = useFeedback({ aiEnabled: config.ai?.enabled });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) setIsOpen(false); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSubmit = useCallback(async (data: FeedbackSubmission) => {
    setIsSubmitting(true);
    try {
      config.onSubmit?.(data);
      const result = await submit(data);
      config.onSuccess?.(result);
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); setIsOpen(false); }, 2000);
    } catch (error) {
      config.onError?.(error instanceof Error ? error : new Error('Submission failed'));
    } finally {
      setIsSubmitting(false);
    }
  }, [config, submit]);

  const buttonColor = config.buttonColor || '#3b82f6';
  const isBottom = config.position.startsWith('bottom');
  const isRight = config.position.endsWith('right');

  return (
    <div style={getPositionStyles(config.position)} className={className}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: buttonColor, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
      >
        {isOpen ? <CloseIcon /> : <MessageIcon />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ position: 'absolute', [isBottom ? 'bottom' : 'top']: 64, [isRight ? 'right' : 'left']: 0, width: 360, backgroundColor: 'white', borderRadius: 12, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)', overflow: 'hidden' }}
          >
            {showSuccess ? (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#22c55e' }}><CheckIcon /></div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#22c55e' }}>Thank you!</div>
                <div style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Your feedback has been submitted.</div>
              </div>
            ) : (
              <FeedbackForm config={config} onSubmit={handleSubmit} onCancel={() => setIsOpen(false)} isSubmitting={isSubmitting} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FeedbackButton;
`;

export const FEEDBACK_FORM_FILE = `/**
 * Feedback Form Component
 */

import React, { useState, useCallback } from 'react';
import { ElementPicker } from './ElementPicker';
import type { FeedbackFormProps, FeedbackSubmission, FeedbackCategory, FeedbackSeverity, TargetElement } from '../../types/feedback';

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

export function FeedbackForm({ config, onSubmit, onCancel, isSubmitting }: FeedbackFormProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('other');
  const [severity, setSeverity] = useState<FeedbackSeverity>('medium');
  const [targetElement, setTargetElement] = useState<TargetElement | null>(null);
  const [isPickingElement, setIsPickingElement] = useState(false);

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

  return (
    <>
      <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Send Feedback</h3>
          <button type="button" onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        {config.features.categories && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                style={{ padding: 10, border: category === cat.value ? '2px solid #3b82f6' : '2px solid transparent', borderRadius: 8, background: category === cat.value ? '#eff6ff' : '#f9fafb', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 16 }}>{cat.emoji}</span>
                <span style={{ fontSize: 10, color: '#6b7280' }}>{cat.label}</span>
              </button>
            ))}
          </div>
        )}

        {config.features.severityLevels && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {SEVERITIES.map(sev => (
              <button key={sev.value} type="button" onClick={() => setSeverity(sev.value)}
                style={{ padding: 8, border: severity === sev.value ? \`2px solid \${sev.color}\` : '1px solid #e5e7eb', borderRadius: 6, background: severity === sev.value ? \`\${sev.color}15\` : 'transparent', color: severity === sev.value ? sev.color : '#6b7280', cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
                {sev.label}
              </button>
            ))}
          </div>
        )}

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Your feedback</label>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>{text.length}/500</span>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value.slice(0, 500))} placeholder="Describe your feedback..." style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, resize: 'none', minHeight: 100, fontSize: 14, boxSizing: 'border-box' }} required />
        </div>

        {config.features.elementPicker && (
          targetElement ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3b82f6' }}>
                <span>🎯</span>
                <span style={{ fontWeight: 500 }}>&lt;{targetElement.tagName}&gt;</span>
              </div>
              <button type="button" onClick={() => setTargetElement(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>
          ) : (
            <button type="button" onClick={() => setIsPickingElement(true)} style={{ padding: 12, border: '1px dashed #d1d5db', borderRadius: 8, background: 'transparent', cursor: 'pointer', color: '#6b7280', fontSize: 13 }}>
              🎯 Target a specific element
            </button>
          )
        )}

        <button type="submit" disabled={!text.trim() || isSubmitting}
          style={{ padding: 12, border: 'none', borderRadius: 8, background: !text.trim() || isSubmitting ? '#e5e7eb' : '#3b82f6', color: 'white', fontWeight: 600, cursor: !text.trim() || isSubmitting ? 'not-allowed' : 'pointer', fontSize: 14 }}>
          {isSubmitting ? 'Sending...' : 'Submit'}
        </button>
      </form>

      <ElementPicker isActive={isPickingElement} onSelect={(el) => { setTargetElement(el); setIsPickingElement(false); }} onCancel={() => setIsPickingElement(false)} />
    </>
  );
}

export default FeedbackForm;
`;

export const ELEMENT_PICKER_FILE = `/**
 * Element Picker - Visual element selection overlay
 */

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { ElementPickerProps, TargetElement } from '../../types/feedback';

function generateSelector(element: HTMLElement): string {
  if (element.id) return \`#\${element.id}\`;
  const path: string[] = [];
  let current: HTMLElement | null = element;
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    if (current.className && typeof current.className === 'string') {
      const classes = current.className.split(' ').filter(c => c.trim()).slice(0, 2).join('.');
      if (classes) selector += \`.\${classes}\`;
    }
    path.unshift(selector);
    current = current.parentElement;
  }
  return path.join(' > ');
}

export function ElementPicker({ isActive, onSelect, onCancel }: ElementPickerProps) {
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-feedback-picker]')) return;
    setHighlightRect(target.getBoundingClientRect());
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (target.closest('[data-feedback-picker]')) return;
    const elementData: TargetElement = {
      selector: generateSelector(target),
      tagName: target.tagName.toLowerCase(),
      className: target.className || '',
      textPreview: (target.textContent || '').slice(0, 100).trim(),
      boundingBox: { top: target.getBoundingClientRect().top, left: target.getBoundingClientRect().left, width: target.getBoundingClientRect().width, height: target.getBoundingClientRect().height },
    };
    onSelect(elementData);
  }, [onSelect]);

  useEffect(() => {
    if (!isActive) return;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);
    document.body.style.cursor = 'crosshair';
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.cursor = '';
    };
  }, [isActive, handleMouseMove, handleClick, onCancel]);

  if (!isActive) return null;

  return createPortal(
    <div data-feedback-picker="true">
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.1)', zIndex: 99998, pointerEvents: 'none' }} />
      {highlightRect && (
        <div style={{ position: 'fixed', top: highlightRect.top - 2, left: highlightRect.left - 2, width: highlightRect.width + 4, height: highlightRect.height + 4, border: '2px solid #3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 4, zIndex: 99999, pointerEvents: 'none' }} />
      )}
      <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1f2937', color: 'white', padding: '12px 24px', borderRadius: 8, zIndex: 100000, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span>Click on any element to select it</span>
        <button onClick={onCancel} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>Cancel (Esc)</button>
      </div>
    </div>,
    document.body
  );
}

export default ElementPicker;
`;
