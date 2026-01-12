/**
 * Feedback Widget Template - Feedback Button
 * 
 * The main entry point for users. A floating button that opens the feedback form.
 * Fully customizable via config.
 */

import React, { useState, useCallback } from 'react';
import { FeedbackForm } from './FeedbackForm';
import type { 
  FeedbackButtonProps, 
  FeedbackSubmission,
  WidgetPosition 
} from '../../types/feedback';

// ============================================
// ICONS
// ============================================

const Icons = {
  Message: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Bug: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m8 2 1.88 1.88" />
      <path d="M14.12 3.88 16 2" />
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
      <path d="M12 20v-9" />
      <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
      <path d="M6 13H2" />
      <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
      <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
      <path d="M22 13h-4" />
      <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
  ),
  Lightbulb: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  ),
  Help: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  ),
  X: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

// ============================================
// POSITION STYLES
// ============================================

const getPositionStyles = (position: WidgetPosition): React.CSSProperties => {
  const base: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
  };

  switch (position) {
    case 'bottom-right':
      return { ...base, bottom: 20, right: 20 };
    case 'bottom-left':
      return { ...base, bottom: 20, left: 20 };
    case 'top-right':
      return { ...base, top: 20, right: 20 };
    case 'top-left':
      return { ...base, top: 20, left: 20 };
    default:
      return { ...base, bottom: 20, right: 20 };
  }
};

const getModalPosition = (position: WidgetPosition): React.CSSProperties => {
  const isBottom = position.startsWith('bottom');
  const isRight = position.endsWith('right');

  return {
    position: 'absolute',
    [isBottom ? 'bottom' : 'top']: 60,
    [isRight ? 'right' : 'left']: 0,
  };
};

// ============================================
// ICON SELECTOR
// ============================================

const getIcon = (iconType?: 'message' | 'bug' | 'lightbulb' | 'help') => {
  switch (iconType) {
    case 'bug':
      return <Icons.Bug />;
    case 'lightbulb':
      return <Icons.Lightbulb />;
    case 'help':
      return <Icons.Help />;
    default:
      return <Icons.Message />;
  }
};

// ============================================
// FEEDBACK BUTTON COMPONENT
// ============================================

export function FeedbackButton({ config, className }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = useCallback(async (data: FeedbackSubmission) => {
    setIsSubmitting(true);
    
    try {
      // Call the onSubmit callback if provided
      if (config.onSubmit) {
        config.onSubmit(data);
      }

      // If using Supabase, submit via edge function
      // This should be configured by the implementing app
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      if (config.onError) {
        config.onError(error instanceof Error ? error : new Error('Submission failed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [config]);

  const buttonColor = config.buttonColor || '#3b82f6';

  return (
    <div style={getPositionStyles(config.position)} className={className}>
      {/* Main floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: buttonColor,
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        aria-label={isOpen ? 'Close feedback' : 'Send feedback'}
      >
        {isOpen ? <Icons.X /> : getIcon(config.buttonIcon)}
      </button>

      {/* Feedback modal */}
      {isOpen && (
        <div
          style={{
            ...getModalPosition(config.position),
            width: 360,
            backgroundColor: 'white',
            borderRadius: 12,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden',
          }}
        >
          {showSuccess ? (
            <div
              style={{
                padding: 32,
                textAlign: 'center',
                color: '#22c55e',
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>Thank you!</div>
              <div style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                Your feedback has been submitted.
              </div>
            </div>
          ) : (
            <FeedbackForm
              config={config}
              onSubmit={handleSubmit}
              onCancel={() => setIsOpen(false)}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default FeedbackButton;
