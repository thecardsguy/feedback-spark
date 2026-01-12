# Customization Guide

This guide covers advanced customization options for the Feedback Widget Template.

## Table of Contents

1. [Configuration Options](#configuration-options)
2. [Custom Categories](#custom-categories)
3. [Theming](#theming)
4. [Custom Backend](#custom-backend)
5. [Webhooks](#webhooks)
6. [Integrations](#integrations)
7. [Multi-Tenant Setup](#multi-tenant-setup)

---

## Configuration Options

### Full Configuration Reference

```typescript
import { createConfig } from './feedback-widget';

const config = createConfig({
  // Basic settings
  appName: "My Application",
  position: "bottom-right",  // or "bottom-left", "top-right", "top-left"
  buttonColor: "#6366f1",    // Custom button color
  
  // Feature toggles
  features: {
    elementPicker: true,      // Allow targeting UI elements
    categories: true,         // Show category selector
    severityLevels: true,     // Show severity selector
    anonymousSubmission: true // Allow without login
  },
  
  // AI options (Pro tier)
  ai: {
    enabled: true,
    provider: 'lovable',      // or 'openai'
    summarize: true,          // AI summarization
    categorize: true,         // AI auto-categorization
    generateDevPrompt: true   // Generate developer questions
  },
  
  // Admin dashboard options
  admin: {
    showStats: true,          // Show statistics widget
    copyToClipboard: true,    // Enable copy prompt button
    exportEnabled: true,      // Allow CSV export
    statusUpdates: true       // Allow status changes
  },
  
  // Custom categories (optional)
  categories: [
    { id: 'bug', label: 'Bug Report', icon: 'Bug', color: 'red' },
    { id: 'feature', label: 'Feature Request', icon: 'Lightbulb', color: 'blue' },
    { id: 'performance', label: 'Performance Issue', icon: 'Zap', color: 'yellow' },
    { id: 'security', label: 'Security Concern', icon: 'Shield', color: 'purple' },
  ],
  
  // Callbacks
  onSubmit: (feedback) => {
    console.log('Feedback submitted:', feedback);
    analytics.track('feedback_submitted', { category: feedback.category });
  },
  onError: (error) => {
    console.error('Feedback error:', error);
    errorTracker.capture(error);
  }
}, 'pro');  // Base tier: 'basic', 'standard', or 'pro'
```

---

## Custom Categories

### Adding Custom Categories

```typescript
const config = createConfig({
  appName: "My App",
  categories: [
    { 
      id: 'billing', 
      label: 'Billing Issue', 
      icon: 'CreditCard', 
      color: 'green' 
    },
    { 
      id: 'integration', 
      label: 'Integration Problem', 
      icon: 'Plug', 
      color: 'orange' 
    },
    { 
      id: 'documentation', 
      label: 'Docs Feedback', 
      icon: 'Book', 
      color: 'cyan' 
    },
  ]
}, 'standard');
```

### Category-Based Routing

Route feedback to different teams based on category:

```typescript
// In your admin dashboard or webhook handler
function routeFeedback(feedback: FeedbackItem) {
  const routes: Record<string, string> = {
    'bug': 'engineering@company.com',
    'billing': 'billing@company.com',
    'feature': 'product@company.com',
    'documentation': 'docs@company.com',
  };
  
  const recipient = routes[feedback.category] || 'support@company.com';
  sendEmail(recipient, feedback);
}
```

---

## Theming

### CSS Variables

The widget uses CSS variables for theming. Override in your global CSS:

```css
:root {
  /* Button colors */
  --feedback-button-bg: #6366f1;
  --feedback-button-hover: #4f46e5;
  --feedback-button-text: #ffffff;
  
  /* Form colors */
  --feedback-form-bg: #ffffff;
  --feedback-form-border: #e5e7eb;
  --feedback-form-text: #1f2937;
  
  /* Status colors */
  --feedback-status-pending: #fbbf24;
  --feedback-status-reviewed: #3b82f6;
  --feedback-status-resolved: #10b981;
  --feedback-status-dismissed: #6b7280;
  
  /* Severity colors */
  --feedback-severity-low: #10b981;
  --feedback-severity-medium: #f59e0b;
  --feedback-severity-high: #ef4444;
  --feedback-severity-critical: #7c3aed;
}

/* Dark mode */
.dark {
  --feedback-form-bg: #1f2937;
  --feedback-form-border: #374151;
  --feedback-form-text: #f9fafb;
}
```

### Custom Button Component

Replace the default button with your own:

```tsx
import { FeedbackForm } from './feedback-widget';

function CustomFeedbackButton({ config }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Your custom trigger */}
      <button 
        onClick={() => setIsOpen(true)}
        className="my-custom-button"
      >
        💬 Give Feedback
      </button>
      
      {/* Use the form component */}
      {isOpen && (
        <FeedbackForm 
          config={config} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}
```

---

## Custom Backend

### Using Your Own API

Replace the Supabase edge function with your own backend:

```typescript
// hooks/useCustomFeedback.ts
export function useCustomFeedback() {
  const submitFeedback = async (data: FeedbackSubmission) => {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }
    
    return response.json();
  };
  
  return { submitFeedback };
}
```

### Database Schema for Other Databases

**MySQL:**

```sql
CREATE TABLE feedback (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36),
  raw_text TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'other',
  severity VARCHAR(20) DEFAULT 'medium',
  page_url VARCHAR(2000),
  target_element JSON,
  device_type VARCHAR(20),
  context JSON,
  ai_summary TEXT,
  ai_category VARCHAR(50),
  ai_question_for_dev TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**MongoDB:**

```javascript
// feedback.schema.js
const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rawText: { type: String, required: true, maxlength: 5000 },
  category: { type: String, enum: ['bug', 'feature', 'ui_ux', 'suggestion', 'other'], default: 'other' },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  pageUrl: String,
  targetElement: mongoose.Schema.Types.Mixed,
  deviceType: String,
  context: mongoose.Schema.Types.Mixed,
  aiSummary: String,
  aiCategory: String,
  aiQuestionForDev: String,
  status: { type: String, enum: ['pending', 'reviewed', 'resolved', 'dismissed'], default: 'pending' },
}, { timestamps: true });
```

---

## Webhooks

### Sending Webhooks on New Feedback

Add to your edge function:

```typescript
async function sendWebhook(feedback: FeedbackItem) {
  const webhookUrl = Deno.env.get('FEEDBACK_WEBHOOK_URL');
  if (!webhookUrl) return;
  
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'feedback.created',
        data: feedback,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Webhook failed:', error);
  }
}
```

### Zapier Integration

Create a Zapier trigger:

```typescript
// Zapier webhook format
const zapierPayload = {
  id: feedback.id,
  text: feedback.raw_text,
  category: feedback.category,
  severity: feedback.severity,
  url: feedback.page_url,
  user_email: user?.email,
  created_at: feedback.created_at,
  // Zapier-friendly field names
  summary: feedback.ai_summary,
  suggested_category: feedback.ai_category,
};
```

---

## Integrations

### Slack Integration

```typescript
async function sendToSlack(feedback: FeedbackItem) {
  const slackWebhook = Deno.env.get('SLACK_WEBHOOK_URL');
  if (!slackWebhook) return;
  
  const severityEmoji = {
    low: '🟢',
    medium: '🟡',
    high: '🟠',
    critical: '🔴',
  };
  
  await fetch(slackWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${severityEmoji[feedback.severity]} New Feedback: ${feedback.category}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: feedback.ai_summary || feedback.raw_text.slice(0, 200),
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Page: ${feedback.page_url || 'Unknown'}`,
            },
          ],
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'View in Dashboard' },
              url: `https://yourapp.com/admin/feedback/${feedback.id}`,
            },
          ],
        },
      ],
    }),
  });
}
```

### Discord Integration

```typescript
async function sendToDiscord(feedback: FeedbackItem) {
  const discordWebhook = Deno.env.get('DISCORD_WEBHOOK_URL');
  if (!discordWebhook) return;
  
  await fetch(discordWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [{
        title: `New ${feedback.category} Feedback`,
        description: feedback.ai_summary || feedback.raw_text.slice(0, 500),
        color: feedback.severity === 'critical' ? 0xff0000 : 0x5865f2,
        fields: [
          { name: 'Severity', value: feedback.severity, inline: true },
          { name: 'Page', value: feedback.page_url || 'Unknown', inline: true },
        ],
        timestamp: feedback.created_at,
      }],
    }),
  });
}
```

### Linear Integration

```typescript
async function createLinearIssue(feedback: FeedbackItem) {
  const linearApiKey = Deno.env.get('LINEAR_API_KEY');
  const teamId = Deno.env.get('LINEAR_TEAM_ID');
  
  if (!linearApiKey || !teamId) return;
  
  const labelMap = {
    bug: 'Bug',
    feature: 'Feature',
    ui_ux: 'Design',
  };
  
  await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      'Authorization': linearApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation CreateIssue($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            success
            issue { id url }
          }
        }
      `,
      variables: {
        input: {
          teamId,
          title: feedback.ai_summary || feedback.raw_text.slice(0, 100),
          description: feedback.raw_text,
          priority: feedback.severity === 'critical' ? 1 : 3,
        },
      },
    }),
  });
}
```

---

## Multi-Tenant Setup

For SaaS applications with multiple customers:

### Database Schema

```sql
-- Add tenant support
ALTER TABLE public.feedback 
  ADD COLUMN tenant_id uuid REFERENCES tenants(id);

-- Create tenant isolation policy
CREATE POLICY "Tenant isolation"
  ON public.feedback FOR ALL
  USING (
    tenant_id = (
      SELECT tenant_id FROM user_tenants 
      WHERE user_id = auth.uid()
      LIMIT 1
    )
  );
```

### Configuration per Tenant

```typescript
// Fetch tenant config from database
async function getTenantConfig(tenantId: string): Promise<FeedbackConfig> {
  const { data } = await supabase
    .from('tenant_feedback_config')
    .select('*')
    .eq('tenant_id', tenantId)
    .single();
  
  return {
    ...DEFAULT_CONFIG,
    ...data?.config,
  };
}

// Usage
const tenantConfig = await getTenantConfig(currentTenantId);
<FeedbackButton config={tenantConfig} />
```

### White-Label Branding

```typescript
interface TenantBranding {
  primaryColor: string;
  logo?: string;
  buttonText?: string;
  thankYouMessage?: string;
}

function BrandedFeedbackButton({ 
  config, 
  branding 
}: { 
  config: FeedbackConfig; 
  branding: TenantBranding;
}) {
  return (
    <FeedbackButton 
      config={{
        ...config,
        buttonColor: branding.primaryColor,
      }}
      customContent={{
        buttonLabel: branding.buttonText || 'Feedback',
        successMessage: branding.thankYouMessage,
      }}
    />
  );
}
```

---

## Advanced: Custom AI Provider

Use a different AI provider:

```typescript
// In submit-feedback-ai edge function
async function enhanceWithCustomAI(feedback: FeedbackPayload): Promise<AIEnhancement> {
  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Analyze this feedback and respond with JSON: ${feedback.raw_text}`,
      }],
    }),
  });
  
  // Parse and return
}
```

---

For more help, see the [README](./README.md) or open an issue.
