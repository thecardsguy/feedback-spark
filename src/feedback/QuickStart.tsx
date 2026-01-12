/**
 * Feedback Widget - Quick Start Component
 * 
 * A single component that provides the complete feedback widget experience
 * with zero configuration required. Just drop this into your app.
 * 
 * Usage:
 * import { FeedbackWidget } from '@/feedback/QuickStart';
 * 
 * // Basic usage (uses defaults)
 * <FeedbackWidget />
 * 
 * // With minimal config
 * <FeedbackWidget appName="MyApp" position="bottom-left" />
 * 
 * // With AI enabled (requires LOVABLE_API_KEY in your edge function)
 * <FeedbackWidget appName="MyApp" enableAI />
 */

import React from 'react';
import { FeedbackButton } from './components/user/FeedbackButton';
import { createConfig } from './config/feedback.config';
import type { WidgetTier } from './types/feedback';

export interface FeedbackWidgetProps {
  /** Your app name (shown in the widget) */
  appName?: string;
  
  /** Widget position */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  
  /** Enable AI-powered summaries and categorization */
  enableAI?: boolean;
  
  /** Show element picker for targeting specific UI elements */
  showElementPicker?: boolean;
  
  /** Custom button color (any valid CSS color) */
  buttonColor?: string;
  
  /** Callback when feedback is submitted successfully */
  onSubmit?: (feedbackId: string) => void;
  
  /** Callback on submission error */
  onError?: (error: Error) => void;
}

/**
 * Drop-in feedback widget component.
 * Zero configuration required - just add to your app.
 */
export function FeedbackWidget({
  appName = 'My App',
  position = 'bottom-right',
  enableAI = false,
  showElementPicker = true,
  buttonColor,
  onSubmit,
  onError,
}: FeedbackWidgetProps) {
  const tier: WidgetTier = enableAI ? 'pro' : 'standard';
  
  const config = createConfig(
    {
      appName,
      position,
      buttonColor,
      features: {
        elementPicker: showElementPicker,
        categories: true,
        severityLevels: true,
        anonymousSubmission: true,
      },
      ai: {
        enabled: enableAI,
        provider: enableAI ? 'lovable' : undefined,
        summarize: enableAI,
        categorize: enableAI,
        generateDevPrompt: enableAI,
      },
      onSuccess: onSubmit ? (item) => onSubmit(item.id) : undefined,
      onError: onError,
    },
    tier
  );

  return <FeedbackButton config={config} />;
}

// Also export a hook version for more control
export { useFeedback } from './hooks/useFeedback';
export { createConfig } from './config/feedback.config';

export default FeedbackWidget;
