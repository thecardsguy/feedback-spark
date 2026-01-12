# Feedback Chatbot

> **A template for the AI Feedback Chatbot system** — Drop this into any React + Supabase project to collect, organize, and act on user feedback. AI interprets issues and generates prompts you can paste directly into Lovable.

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)
![Supabase](https://img.shields.io/badge/Supabase-Ready-3ecf8e.svg)

---

## 🎯 Why Use This Template?

### Built for Lovable Users

This template turns your feedback collection into an **AI-powered issue tracker** that integrates seamlessly with Lovable:

| Feature | Benefit |
|---------|---------|
| **🎯 Element Picker** | Click anywhere on your page to select the exact element with an issue. Captured context helps Lovable understand precisely what needs fixing. |
| **💳 Save Credits** | Precise element targeting means fewer back-and-forth corrections and more accurate first-try fixes. |
| **⏰ Queue Issues** | Log issues instantly and keep browsing. Batch-prompt fixes when you have dedicated dev time. |
| **🤖 AI-Ready Prompts** | Pro tier AI interprets your feedback and generates clear, actionable prompts you can paste directly into Lovable. |

### The Workflow

1. **See an issue** — While using your app, notice a bug or something to improve
2. **Click & describe** — Select the element, describe the issue, and submit
3. **Collect & organize** — Issues are saved with full context in your admin dashboard
4. **Batch prompt** — When ready, copy the AI-generated prompts to Lovable and fix everything

---

## ✨ Features

### Three Tiers

| Tier | Features |
|------|----------|
| **Basic** | Floating feedback button, category selection, severity levels, auto-capture page context |
| **Standard** | Everything in Basic + Admin dashboard, status management, feedback statistics, search & filtering |
| **Pro** | Everything in Standard + AI categorization, auto-generated summaries, developer questions, sentiment analysis |

---

## 🚀 Quick Start

### Option 1: Use with Lovable (Recommended)

1. **Use this template** — Click "Use this template" on GitHub to create your own copy
2. **Connect to Lovable** — Go to [lovable.dev](https://lovable.dev), create a new project, and connect your GitHub repo
3. **Enable Lovable Cloud** — In the Lovable editor, enable Cloud to get a database automatically
4. **Run the migration** — Ask Lovable to run the database migration (see below)
5. **Done!** — The feedback widget is ready to use

### Option 2: Self-Hosted with Supabase

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/feedback-chatbot.git
   cd feedback-chatbot
   npm install
   ```

2. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Run the database migration**
   
   Execute this SQL in your Supabase SQL editor:
   
   ```sql
   -- Create feedback table
   CREATE TABLE public.feedback (
     id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
     raw_text TEXT NOT NULL,
     category TEXT,
     severity TEXT,
     page_url TEXT,
     target_element JSONB,
     context JSONB,
     device_type TEXT,
     user_id UUID,
     status TEXT DEFAULT 'new',
     ai_summary TEXT,
     ai_category TEXT,
     ai_question_for_dev TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );

   -- Enable Row Level Security
   ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

   -- Allow anyone to insert feedback (for anonymous submissions)
   CREATE POLICY "Anyone can submit feedback"
     ON public.feedback FOR INSERT
     WITH CHECK (true);

   -- Allow anyone to read feedback (adjust for your needs)
   CREATE POLICY "Anyone can view feedback"
     ON public.feedback FOR SELECT
     USING (true);

   -- Allow updates (for status changes)
   CREATE POLICY "Anyone can update feedback"
     ON public.feedback FOR UPDATE
     USING (true);
   ```

5. **Deploy edge functions** (for AI features)
   ```bash
   supabase functions deploy submit-feedback
   supabase functions deploy submit-feedback-ai
   ```

6. **Start development**
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```
src/
├── feedback/                    # 📦 Core feedback module
│   ├── components/
│   │   ├── admin/               # Admin dashboard components
│   │   │   ├── FeedbackDashboard.tsx
│   │   │   ├── FeedbackDetail.tsx
│   │   │   ├── FeedbackList.tsx
│   │   │   └── FeedbackStats.tsx
│   │   └── user/                # User-facing components
│   │       ├── ElementPicker.tsx
│   │       ├── FeedbackButton.tsx
│   │       └── FeedbackForm.tsx
│   ├── config/
│   │   └── feedback.config.ts   # Tier presets and configuration
│   ├── hooks/
│   │   └── useFeedback.ts       # Data fetching hooks
│   ├── types/
│   │   └── feedback.ts          # TypeScript types
│   └── index.ts                 # Public exports
├── pages/
│   ├── Index.tsx                # Demo landing page
│   └── Admin.tsx                # Admin dashboard page
└── integrations/
    └── supabase/                # Auto-generated Supabase client

supabase/
├── functions/
│   ├── submit-feedback/         # Basic submission endpoint
│   └── submit-feedback-ai/      # AI-enhanced submission endpoint
└── config.toml                  # Supabase configuration
```

---

## ⚙️ Configuration

### Using Presets

```tsx
import { FeedbackButton } from '@/feedback';
import { BASIC_PRESET, STANDARD_PRESET, PRO_PRESET } from '@/feedback/config/feedback.config';

// Basic - Just the feedback button
<FeedbackButton config={BASIC_PRESET} />

// Standard - With admin features
<FeedbackButton config={STANDARD_PRESET} />

// Pro - With AI features
<FeedbackButton config={PRO_PRESET} />
```

### Custom Configuration

```tsx
import { FeedbackButton } from '@/feedback';
import { createConfig } from '@/feedback/config/feedback.config';

const myConfig = createConfig({
  appName: 'My App',
  position: 'bottom-left',        // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  buttonIcon: 'message',          // 'message' | 'bug' | 'help'
  features: {
    elementPicker: true,          // Allow selecting page elements
    categories: true,             // Show category dropdown
    severityLevels: true,         // Show severity options
    anonymousSubmission: true,    // Allow without login
  },
  ai: {
    enabled: true,                // Enable AI features
    provider: 'lovable',          // 'lovable' | 'openai'
    summarize: true,              // Generate summaries
    categorize: true,             // Auto-categorize
    generateDevPrompt: true,      // Generate Lovable prompts
  },
  admin: {
    showStats: true,              // Show statistics
    copyToClipboard: true,        // Enable copy button
    exportEnabled: true,          // Enable export
    statusUpdates: true,          // Allow status changes
  },
  categories: [
    { id: 'bug', label: 'Bug Report', icon: 'Bug', color: 'red' },
    { id: 'feature', label: 'Feature Request', icon: 'Lightbulb', color: 'blue' },
    { id: 'ui_ux', label: 'UI/UX Issue', icon: 'Palette', color: 'purple' },
    { id: 'suggestion', label: 'Suggestion', icon: 'MessageCircle', color: 'green' },
    { id: 'other', label: 'Other', icon: 'HelpCircle', color: 'gray' },
  ],
}, 'standard');  // Base tier: 'basic' | 'standard' | 'pro'

<FeedbackButton config={myConfig} />
```

### Admin Dashboard

```tsx
import { FeedbackDashboard } from '@/feedback';
import { STANDARD_PRESET } from '@/feedback/config/feedback.config';

// In your admin page
<FeedbackDashboard config={STANDARD_PRESET} />
```

---

## 🎨 Customization

### Theming

The template uses Tailwind CSS with semantic design tokens. Customize colors in `src/index.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --accent: 210 40% 96.1%;
  /* ... other tokens */
}
```

### Custom Categories

```tsx
const customCategories = [
  { id: 'critical', label: 'Critical Bug', icon: 'AlertTriangle', color: 'red' },
  { id: 'enhancement', label: 'Enhancement', icon: 'Sparkles', color: 'purple' },
  { id: 'question', label: 'Question', icon: 'HelpCircle', color: 'blue' },
];

const config = createConfig({
  categories: customCategories,
}, 'standard');
```

### Styling the Button

The `FeedbackButton` component accepts standard className props:

```tsx
<FeedbackButton 
  config={config}
  className="custom-button-class"
/>
```

---

## 🔐 Security

- **Row Level Security (RLS)** — All database tables have RLS enabled
- **Input Validation** — All feedback is sanitized before storage
- **Rate Limiting** — Edge functions include rate limiting protection
- **No Secrets in Code** — API keys stored securely in environment

### Adjusting RLS Policies

For stricter access control, modify the policies:

```sql
-- Only authenticated users can submit
CREATE POLICY "Authenticated users can submit feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only admins can view feedback
CREATE POLICY "Admins can view feedback"
  ON public.feedback FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM admins));
```

---

## 🤖 AI Features (Pro Tier)

The Pro tier uses **Lovable AI** (no API key needed when using Lovable Cloud) for:

| Feature | Description |
|---------|-------------|
| **AI Summary** | Concise summary of the feedback |
| **Auto-Category** | Automatically categorizes the feedback type |
| **Developer Question** | Generates a clear question/prompt for Lovable |

### How It Works

1. User submits feedback via the widget
2. Edge function sends to Lovable AI Gateway
3. AI generates summary, category, and developer prompt
4. All stored in the `feedback` table
5. Admin copies the prompt to Lovable to implement fixes

---

## 📖 Examples

See the `feedback-widget-template/examples/` directory:

- `basic-setup.tsx` — Minimal implementation
- `with-auth.tsx` — With user authentication
- `pro-tier.tsx` — Full AI features

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

---

## 📄 License

MIT License — See [LICENSE](./LICENSE) for details.

---

## 🙋 Support

- **Documentation**: [docs.lovable.dev](https://docs.lovable.dev)
- **Issues**: [GitHub Issues](https://github.com/thecardsguy/feedback-chatbot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/thecardsguy/feedback-chatbot/discussions)

---

**Made with ❤️ for the Lovable community**
