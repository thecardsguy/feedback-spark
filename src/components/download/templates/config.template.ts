/**
 * Template: Configuration
 * Extracted from DownloadTemplate.tsx for better organization
 */

export const CONFIG_FILE = `/**
 * Feedback Widget - Configuration
 */

import type { FeedbackConfig, CustomCategory, WidgetTier } from '../types/feedback';

export const DEFAULT_CATEGORIES: CustomCategory[] = [
  { id: 'bug', label: 'Bug Report', icon: 'Bug', color: 'red' },
  { id: 'feature', label: 'Feature Request', icon: 'Lightbulb', color: 'blue' },
  { id: 'ui_ux', label: 'UI/UX Issue', icon: 'Palette', color: 'purple' },
  { id: 'suggestion', label: 'Suggestion', icon: 'MessageCircle', color: 'green' },
  { id: 'other', label: 'Other', icon: 'HelpCircle', color: 'gray' },
];

export const BASIC_PRESET: FeedbackConfig = {
  appName: 'My App',
  position: 'bottom-right',
  buttonIcon: 'message',
  features: { elementPicker: true, categories: true, severityLevels: false, anonymousSubmission: true },
  ai: { enabled: false, summarize: false, categorize: false, generateDevPrompt: false },
  admin: { showStats: false, copyToClipboard: false, exportEnabled: false, statusUpdates: false },
  categories: DEFAULT_CATEGORIES,
};

export const STANDARD_PRESET: FeedbackConfig = {
  ...BASIC_PRESET,
  features: { ...BASIC_PRESET.features, severityLevels: true },
  admin: { showStats: true, copyToClipboard: true, exportEnabled: true, statusUpdates: true },
};

export const PRO_PRESET: FeedbackConfig = {
  ...STANDARD_PRESET,
  ai: { enabled: true, provider: 'lovable', summarize: true, categorize: true, generateDevPrompt: true },
};

export function getPreset(tier: WidgetTier): FeedbackConfig {
  switch (tier) {
    case 'basic': return BASIC_PRESET;
    case 'standard': return STANDARD_PRESET;
    case 'pro': return PRO_PRESET;
    default: return BASIC_PRESET;
  }
}

export function createConfig(userConfig: Partial<FeedbackConfig>, baseTier: WidgetTier = 'basic'): FeedbackConfig {
  const preset = getPreset(baseTier);
  return {
    ...preset,
    ...userConfig,
    features: { ...preset.features, ...userConfig.features },
    ai: { ...preset.ai, ...userConfig.ai },
    admin: { ...preset.admin, ...userConfig.admin },
    categories: userConfig.categories || preset.categories,
  };
}

export function validateConfig(config: FeedbackConfig): string[] {
  const errors: string[] = [];
  if (!config.appName?.trim()) errors.push('appName is required');
  if (config.ai.enabled && !config.ai.provider) errors.push('AI provider must be specified when AI is enabled');
  return errors;
}
`;
