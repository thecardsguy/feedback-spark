/**
 * Feedback Widget Template - Configuration
 * 
 * This file contains default configurations and presets for different tiers.
 */

import type { FeedbackConfig, CustomCategory, WidgetTier } from '../types/feedback';

// ============================================
// DEFAULT CATEGORIES
// ============================================

export const DEFAULT_CATEGORIES: CustomCategory[] = [
  { id: 'bug', label: 'Bug Report', icon: 'Bug', color: 'red' },
  { id: 'feature', label: 'Feature Request', icon: 'Lightbulb', color: 'blue' },
  { id: 'ui_ux', label: 'UI/UX Issue', icon: 'Palette', color: 'purple' },
  { id: 'suggestion', label: 'Suggestion', icon: 'MessageCircle', color: 'green' },
  { id: 'other', label: 'Other', icon: 'HelpCircle', color: 'gray' },
];

// ============================================
// TIER PRESETS
// ============================================

/**
 * Basic Tier - For end users
 * Simple feedback submission with optional element targeting
 */
export const BASIC_PRESET: FeedbackConfig = {
  appName: 'My App',
  position: 'bottom-right',
  buttonIcon: 'message',
  features: {
    elementPicker: true,
    categories: true,
    severityLevels: false,
    anonymousSubmission: true,
    screenshotCapture: false,
  },
  ai: {
    enabled: false,
    summarize: false,
    categorize: false,
    generateDevPrompt: false,
  },
  admin: {
    showStats: false,
    copyToClipboard: false,
    exportEnabled: false,
    statusUpdates: false,
  },
  categories: DEFAULT_CATEGORIES,
};

/**
 * Standard Tier - For admins without AI
 * View and manage feedback with filtering and statistics
 */
export const STANDARD_PRESET: FeedbackConfig = {
  ...BASIC_PRESET,
  features: {
    ...BASIC_PRESET.features,
    severityLevels: true,
    screenshotCapture: true,
  },
  admin: {
    showStats: true,
    copyToClipboard: true,
    exportEnabled: true,
    statusUpdates: true,
  },
};

/**
 * Pro Tier - For admins with AI
 * AI-powered summarization, categorization, and developer prompts
 */
export const PRO_PRESET: FeedbackConfig = {
  ...STANDARD_PRESET,
  ai: {
    enabled: true,
    provider: 'lovable',
    summarize: true,
    categorize: true,
    generateDevPrompt: true,
  },
};

// ============================================
// PRESET SELECTOR
// ============================================

export function getPreset(tier: WidgetTier): FeedbackConfig {
  switch (tier) {
    case 'basic':
      return BASIC_PRESET;
    case 'standard':
      return STANDARD_PRESET;
    case 'pro':
      return PRO_PRESET;
    default:
      return BASIC_PRESET;
  }
}

// ============================================
// CONFIG MERGER
// ============================================

/**
 * Merge user config with a preset
 * User config values override preset values
 */
export function createConfig(
  userConfig: Partial<FeedbackConfig>,
  baseTier: WidgetTier = 'basic'
): FeedbackConfig {
  const preset = getPreset(baseTier);
  
  return {
    ...preset,
    ...userConfig,
    features: {
      ...preset.features,
      ...userConfig.features,
    },
    ai: {
      ...preset.ai,
      ...userConfig.ai,
    },
    admin: {
      ...preset.admin,
      ...userConfig.admin,
    },
    categories: userConfig.categories || preset.categories,
  };
}

// ============================================
// VALIDATION
// ============================================

export function validateConfig(config: FeedbackConfig): string[] {
  const errors: string[] = [];
  
  if (!config.appName || config.appName.trim() === '') {
    errors.push('appName is required');
  }
  
  if (config.ai.enabled && !config.ai.provider) {
    errors.push('AI provider must be specified when AI is enabled');
  }
  
  return errors;
}
