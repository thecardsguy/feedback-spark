/**
 * Pro Tier Example
 * 
 * Full AI-powered feedback system:
 * - AI summarization
 * - Auto-categorization
 * - Developer prompt generation
 * - Sentiment analysis
 * - All Standard features included
 */

import { FeedbackButton, FeedbackDashboard } from '@/feedback';
import { createConfig } from '@/feedback/config/feedback.config';

// Pro tier feedback widget with AI
export function ProFeedbackWidget() {
  const config = createConfig({
    appName: 'My AI-Powered App',
    position: 'bottom-right',
    ai: {
      enabled: true,
      provider: 'lovable',
      summarize: true,
      categorize: true,
      generateDevPrompt: true,
    },
    features: {
      severityLevels: true,
      screenshotCapture: true,
      elementPicker: true,
      categories: true,
      anonymousSubmission: true,
    },
  }, 'pro');

  return <FeedbackButton config={config} />;
}

// Complete Pro setup
export function ProAppSetup() {
  const handleSubmit = async (feedback: unknown) => {
    console.log('AI-enhanced feedback:', feedback);
    // The feedback object now includes:
    // - ai_summary: Concise summary of the issue
    // - ai_category: Auto-detected category
    // - ai_question_for_dev: Ready-to-use prompt for Lovable
  };

  const config = createConfig({
    appName: 'My AI-Powered App',
    ai: {
      enabled: true,
      provider: 'lovable',
      summarize: true,
      categorize: true,
      generateDevPrompt: true,
    },
    features: {
      severityLevels: true,
      screenshotCapture: true,
      elementPicker: true,
      categories: true,
      anonymousSubmission: true,
    },
    onSubmit: handleSubmit,
  }, 'pro');

  return (
    <div>
      <main>
        <h1>My AI-Powered App</h1>
        <p>Feedback is automatically analyzed and categorized by AI.</p>
      </main>
      <FeedbackButton config={config} />
    </div>
  );
}

// Pro admin dashboard with AI insights
export function ProAdminDashboard() {
  const dashboardConfig = createConfig({
    appName: 'My AI-Powered App',
    ai: {
      enabled: true,
      provider: 'lovable',
      summarize: true,
      categorize: true,
      generateDevPrompt: true,
    },
    admin: {
      showStats: true,
      statusUpdates: true,
      copyToClipboard: true,
      exportEnabled: true, // Export AI prompts for Lovable
    },
  }, 'pro');

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">AI Feedback Dashboard</h1>
        <p className="text-muted-foreground">
          View AI-analyzed feedback and export prompts for Lovable
        </p>
      </header>
      
      <FeedbackDashboard config={dashboardConfig} />
    </div>
  );
}

// Using the QuickStart widget with AI enabled
import { FeedbackWidget } from '@/feedback/QuickStart';

export function QuickProSetup() {
  return (
    <div>
      <h1>Quick Pro Setup</h1>
      <FeedbackWidget 
        appName="My App"
        enableAI={true}
        showElementPicker={true}
      />
    </div>
  );
}

// Complete workflow example
export function ProWorkflowExample() {
  // 1. User submits feedback via widget
  // 2. AI processes the feedback:
  //    - Generates summary
  //    - Detects category (bug, feature, ui, performance)
  //    - Creates developer prompt
  // 3. Admin views in dashboard
  // 4. Admin exports prompts
  // 5. Paste prompts into Lovable to implement fixes

  const config = createConfig({
    appName: 'My App',
    ai: {
      enabled: true,
      provider: 'lovable',
      summarize: true,
      categorize: true,
      generateDevPrompt: true,
    },
    onSubmit: (feedback) => {
      // AI-enhanced feedback structure:
      // {
      //   id: 'uuid',
      //   raw_text: 'Original user feedback',
      //   ai_summary: 'Concise AI summary',
      //   ai_category: 'bug' | 'feature' | 'ui' | 'performance',
      //   ai_question_for_dev: 'Ready prompt for Lovable AI',
      //   severity: 'low' | 'medium' | 'high' | 'critical',
      //   page_url: '/current/page',
      //   target_element: { selector: '.btn', text: 'Submit' },
      //   created_at: '2024-01-15T10:30:00Z'
      // }
      console.log('AI-enhanced feedback:', feedback);
    },
    onSuccess: () => {
      // Show success message to user
    },
    onError: (error) => {
      console.error('Feedback error:', error);
    },
  }, 'pro');

  return <FeedbackButton config={config} />;
}
