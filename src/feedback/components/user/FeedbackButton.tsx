/**
 * Feedback Widget Template - Feedback Button
 * 
 * Modern, sleek floating button with glassmorphism and smooth animations.
 * Fully customizable via config.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackForm } from './FeedbackForm';
import { useFeedback } from '../../hooks/useFeedback';
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Bug: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  ),
  Help: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Check: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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
      return { ...base, bottom: 24, right: 24 };
    case 'bottom-left':
      return { ...base, bottom: 24, left: 24 };
    case 'top-right':
      return { ...base, top: 24, right: 24 };
    case 'top-left':
      return { ...base, top: 24, left: 24 };
    default:
      return { ...base, bottom: 24, right: 24 };
  }
};

const getModalPosition = (position: WidgetPosition) => {
  const isBottom = position.startsWith('bottom');
  const isRight = position.endsWith('right');

  return {
    originX: isRight ? 1 : 0,
    originY: isBottom ? 1 : 0,
    [isBottom ? 'bottom' : 'top']: 72,
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
  const [isHovered, setIsHovered] = useState(false);
  
  const { submit } = useFeedback({ aiEnabled: config.ai.enabled });

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSubmit = useCallback(async (data: FeedbackSubmission) => {
    setIsSubmitting(true);
    
    try {
      if (config.onSubmit) {
        config.onSubmit(data);
      }

      await submit(data);
      
      if (config.onSuccess) {
        config.onSuccess(data as any);
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsOpen(false);
      }, 2500);
    } catch (error) {
      if (config.onError) {
        config.onError(error instanceof Error ? error : new Error('Submission failed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [config, submit]);

  const buttonColor = config.buttonColor || 'hsl(32, 95%, 52%)';
  const modalPosition = getModalPosition(config.position);

  return (
    <div style={getPositionStyles(config.position)} className={className}>
      {/* Backdrop when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(2px)',
              zIndex: -1,
            }}
          />
        )}
      </AnimatePresence>

      {/* Main floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          scale: isHovered ? 1.08 : 1,
          rotate: isOpen ? 180 : 0,
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${buttonColor} 0%, ${buttonColor} 50%, hsl(24, 95%, 45%) 100%)`,
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isHovered 
            ? `0 8px 32px -4px ${buttonColor}80, 0 4px 12px -2px rgba(0,0,0,0.2)`
            : `0 4px 20px -4px ${buttonColor}60, 0 2px 8px -2px rgba(0,0,0,0.15)`,
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-label={isOpen ? 'Close feedback' : 'Send feedback'}
      >
        {/* Shimmer effect */}
        <motion.div
          animate={{
            x: isHovered ? ['-100%', '200%'] : '-100%',
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            transform: 'skewX(-15deg)',
          }}
        />
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {isOpen ? <Icons.X /> : getIcon(config.buttonIcon)}
        </motion.span>
      </motion.button>

      {/* Feedback modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.9,
              y: modalPosition.bottom !== undefined ? 20 : -20,
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9,
              y: modalPosition.bottom !== undefined ? 20 : -20,
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 25,
            }}
            style={{
              position: 'absolute',
              bottom: modalPosition.bottom,
              top: modalPosition.top,
              right: modalPosition.right,
              left: modalPosition.left,
              width: 380,
              transformOrigin: `${modalPosition.originX === 1 ? 'right' : 'left'} ${modalPosition.originY === 1 ? 'bottom' : 'top'}`,
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: 20,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
              }}
              className="dark:bg-card/95"
            >
              {showSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    padding: 48,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 300, 
                      damping: 15,
                      delay: 0.1 
                    }}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, hsl(142, 71%, 45%) 0%, hsl(142, 71%, 35%) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <Icons.Check />
                  </motion.div>
                  <div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      style={{ 
                        fontSize: 18, 
                        fontWeight: 600,
                        color: 'hsl(220, 20%, 14%)',
                      }}
                      className="dark:text-foreground"
                    >
                      Thank you!
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      style={{ 
                        fontSize: 14, 
                        color: 'hsl(220, 10%, 46%)', 
                        marginTop: 4 
                      }}
                      className="dark:text-muted-foreground"
                    >
                      Your feedback helps us improve.
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <FeedbackForm
                  config={config}
                  onSubmit={handleSubmit}
                  onCancel={() => setIsOpen(false)}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FeedbackButton;
