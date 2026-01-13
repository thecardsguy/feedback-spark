/**
 * Basic Tier Example
 * 
 * Minimal setup for simple feedback collection.
 * No AI features, no admin dashboard.
 * Perfect for small apps or quick prototypes.
 */

import { FeedbackWidget } from '@/feedback/QuickStart';

// Option 1: Zero-config (simplest)
export function BasicFeedbackSimple() {
  return (
    <div>
      <h1>My App</h1>
      {/* Just drop it in - that's it! */}
      <FeedbackWidget />
    </div>
  );
}

// Option 2: With app name branding
export function BasicFeedbackBranded() {
  return (
    <div>
      <h1>My App</h1>
      <FeedbackWidget appName="My App" />
    </div>
  );
}

// Option 3: Custom position
export function BasicFeedbackPositioned() {
  return (
    <div>
      <h1>My App</h1>
      <FeedbackWidget 
        appName="My App"
        position="bottom-left" // Options: bottom-right, bottom-left, top-right, top-left
      />
    </div>
  );
}

// Option 4: With callbacks for custom handling
export function BasicFeedbackWithCallbacks() {
  const handleSubmit = (feedback: unknown) => {
    console.log('Feedback submitted:', feedback);
    // Send to your analytics, Slack, etc.
  };

  const handleError = (error: Error) => {
    console.error('Feedback error:', error);
    // Log to your error tracking service
  };

  return (
    <div>
      <h1>My App</h1>
      <FeedbackWidget 
        appName="My App"
        onSubmit={handleSubmit}
        onError={handleError}
      />
    </div>
  );
}

// Option 5: Using FeedbackButton directly for more control
import { FeedbackButton } from '@/feedback';
import { createConfig } from '@/feedback/config/feedback.config';

export function BasicFeedbackDirect() {
  const config = createConfig({
    appName: 'My App',
    position: 'bottom-right',
    features: {
      severityLevels: false,
      screenshotCapture: false,
      elementPicker: true,
      categories: true,
      anonymousSubmission: true,
    },
  }, 'basic');

  return (
    <div>
      <h1>My App</h1>
      <FeedbackButton config={config} />
    </div>
  );
}
