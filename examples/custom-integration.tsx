/**
 * Custom Integration Examples
 * 
 * Advanced patterns for customizing the feedback widget:
 * - Custom categories
 * - Custom theming
 * - Event callbacks
 * - Context enrichment
 * - Multiple widgets
 */

import { FeedbackButton } from '@/feedback';
import { createConfig } from '@/feedback/config/feedback.config';
import type { CustomCategory, FeedbackConfig } from '@/feedback/types/feedback';

// Custom categories for your specific app
const customCategories: CustomCategory[] = [
  { id: 'billing', label: 'Billing Issue', icon: 'CreditCard', color: 'yellow' },
  { id: 'integration', label: 'Integration Problem', icon: 'Plug', color: 'purple' },
  { id: 'data', label: 'Data Sync', icon: 'Database', color: 'blue' },
  { id: 'mobile', label: 'Mobile App', icon: 'Smartphone', color: 'green' },
  { id: 'api', label: 'API Issue', icon: 'Code', color: 'orange' },
];

export function CustomCategoriesExample() {
  const config = createConfig({
    appName: 'My SaaS',
    categories: customCategories,
    features: {
      severityLevels: true,
      categories: true,
      elementPicker: true,
      anonymousSubmission: true,
      screenshotCapture: true,
    },
  }, 'standard');

  return <FeedbackButton config={config} />;
}

// Custom button styling
export function CustomStyledButton() {
  const config = createConfig({
    appName: 'My App',
    position: 'bottom-right',
  }, 'basic');

  return (
    <FeedbackButton 
      config={config}
      className="!bg-gradient-to-r !from-purple-500 !to-pink-500 !text-white !rounded-full !shadow-xl"
    />
  );
}

// Context enrichment - add custom data to every submission
export function WithContextEnrichment() {
  const config = createConfig({
    appName: 'My App',
    onSubmit: (feedback) => {
      // Enrich with app context
      const enrichedFeedback = {
        ...feedback,
        context: {
          appVersion: '2.1.0',
          environment: process.env.NODE_ENV,
          userTier: 'premium',
          sessionId: sessionStorage.getItem('sessionId'),
          // Add any custom context
        },
      };
      console.log('Enriched feedback:', enrichedFeedback);
    },
  }, 'standard');

  return <FeedbackButton config={config} />;
}

// Multiple widgets for different purposes
export function MultipleWidgets() {
  const bugReportConfig = createConfig({
    appName: 'Bug Report',
    position: 'bottom-right',
    categories: [
      { id: 'crash', label: 'App Crash', icon: 'AlertTriangle', color: 'red' },
      { id: 'error', label: 'Error Message', icon: 'XCircle', color: 'orange' },
      { id: 'slow', label: 'Slow Performance', icon: 'Clock', color: 'yellow' },
    ],
    features: {
      severityLevels: true,
      categories: true,
      elementPicker: true,
      anonymousSubmission: true,
      screenshotCapture: true,
    },
  }, 'standard');

  const featureRequestConfig = createConfig({
    appName: 'Feature Request',
    position: 'bottom-left',
    categories: [
      { id: 'new', label: 'New Feature', icon: 'Sparkles', color: 'blue' },
      { id: 'improve', label: 'Improvement', icon: 'TrendingUp', color: 'green' },
      { id: 'ux', label: 'UX Change', icon: 'Layout', color: 'purple' },
    ],
    features: {
      severityLevels: false,
      categories: true,
      elementPicker: false,
      anonymousSubmission: true,
      screenshotCapture: false,
    },
  }, 'basic');

  return (
    <>
      <FeedbackButton config={bugReportConfig} />
      <FeedbackButton config={featureRequestConfig} />
    </>
  );
}

// Conditional rendering based on user state
export function ConditionalFeedback({ user, isPremium }: { user: unknown; isPremium: boolean }) {
  const config = createConfig({
    appName: 'My App',
    ai: {
      enabled: isPremium, // Only premium users get AI
      provider: 'lovable',
      summarize: isPremium,
      categorize: isPremium,
      generateDevPrompt: isPremium,
    },
    features: {
      screenshotCapture: isPremium,
      severityLevels: true,
      categories: true,
      elementPicker: true,
      anonymousSubmission: false,
    },
    onSubmit: (feedback) => {
      console.log('Feedback from:', user, feedback);
    },
  }, isPremium ? 'pro' : 'basic');

  return <FeedbackButton config={config} />;
}

// Integration with external services
export function WithExternalIntegrations() {
  const sendToSlack = async (feedback: unknown) => {
    // await fetch('https://hooks.slack.com/services/...', {
    //   method: 'POST',
    //   body: JSON.stringify({ text: `New feedback: ${feedback}` }),
    // });
    console.log('Would send to Slack:', feedback);
  };

  const logToAnalytics = (feedback: unknown) => {
    // window.analytics?.track('Feedback Submitted', feedback);
    console.log('Would log to analytics:', feedback);
  };

  const config = createConfig({
    appName: 'My App',
    onSubmit: async (feedback) => {
      await sendToSlack(feedback);
      logToAnalytics(feedback);
    },
    onSuccess: () => {
      console.log('Feedback sent successfully');
    },
    onError: (error) => {
      console.error('Failed to send feedback:', error);
    },
  }, 'standard');

  return <FeedbackButton config={config} />;
}

// Full custom configuration
export function FullCustomConfig() {
  const config: FeedbackConfig = {
    // Branding
    appName: 'My Custom App',
    
    // UI Options
    position: 'bottom-right',
    buttonIcon: 'message',
    
    // Feature Toggles
    features: {
      severityLevels: true,
      screenshotCapture: true,
      elementPicker: true,
      categories: true,
      anonymousSubmission: false,
    },
    
    // AI Settings
    ai: {
      enabled: true,
      provider: 'lovable',
      summarize: true,
      categorize: true,
      generateDevPrompt: true,
    },
    
    // Admin Options
    admin: {
      showStats: true,
      statusUpdates: true,
      copyToClipboard: true,
      exportEnabled: true,
    },
    
    // Custom Categories
    categories: [
      { id: 'urgent', label: 'Urgent', icon: 'AlertCircle', color: 'red' },
      { id: 'question', label: 'Question', icon: 'HelpCircle', color: 'blue' },
      { id: 'praise', label: 'Praise', icon: 'Heart', color: 'pink' },
    ],
    
    // Callbacks
    onSubmit: (feedback) => console.log('Submit:', feedback),
    onSuccess: () => console.log('Success!'),
    onError: (error) => console.error('Error:', error),
  };

  return <FeedbackButton config={config} />;
}
