# Feedback Widget Template

<!-- PROJECT HERO -->
<div align="center">
  <a href="https://feedback-chatbot.lovable.app">
    <img src="docs/images/hero-screenshot.png" alt="Feedback Widget Template - AI-Powered Feedback Collection" width="800">
  </a>

  <p align="center">
    <strong>Drop-in AI-powered feedback collection for React + Supabase apps</strong>
    <br />
    <br />
    <a href="https://feedback-chatbot.lovable.app"><strong>🚀 Live Demo</strong></a>
    &nbsp;·&nbsp;
    <a href="#-quick-start"><strong>⚡ Quick Start</strong></a>
    &nbsp;·&nbsp;
    <a href="https://github.com/thecardsguy/feedback-chatbot/issues">Report Bug</a>
  </p>
</div>

<br />

<!-- Quick Links -->
[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-blue?style=for-the-badge)](https://feedback-chatbot.lovable.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/thecardsguy/feedback-chatbot)

<!-- Status Badges (Dynamic) -->
[![Version](https://img.shields.io/github/v/release/thecardsguy/feedback-chatbot?style=flat-square&label=version&color=blue)](https://github.com/thecardsguy/feedback-chatbot/releases)
[![Build Status](https://img.shields.io/github/actions/workflow/status/thecardsguy/feedback-chatbot/ci.yml?branch=main&style=flat-square&label=build)](https://github.com/thecardsguy/feedback-chatbot/actions)
[![License](https://img.shields.io/github/license/thecardsguy/feedback-chatbot?style=flat-square)](LICENSE)

<!-- Tech Stack Badges -->
[![React](https://img.shields.io/badge/React-18.x-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-3ecf8e?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)

<!-- Lovable Badges -->
[![Made with Lovable](https://img.shields.io/badge/Made_with-Lovable-ff69b4?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjFsLTEuNS0xLjM1QzUuNCAxNS4zNiAyIDEyLjI4IDIgOC41IDIgNS40MiA0LjQyIDMgNy41IDNjMS43NCAwIDMuNDEuODEgNC41IDIuMDlDMTMuMDkgMy44MSAxNC43NiAzIDE2LjUgMyAxOS41OCAzIDIyIDUuNDIgMjIgOC41YzAgMy43OC0zLjQgNi44Ni04LjU1IDExLjE1TDEyIDIxeiIgZmlsbD0iI2ZmNjliNCIvPjwvc3ZnPg==)](https://lovable.dev)
[![Lovable Cloud Ready](https://img.shields.io/badge/Lovable-Cloud_Ready-blueviolet?style=flat-square)](https://docs.lovable.dev/features/cloud)

---

## 🎬 Demo

<div align="center">
  <img src="docs/images/demo.gif" alt="Demo - Submit feedback with AI-powered categorization in seconds" width="700">
  <br />
  <em>Submit feedback with AI-powered categorization in seconds</em>
</div>

---

<details>
<summary><strong>📑 Table of Contents</strong></summary>

- [Demo](#-demo)
- [Why Use This Template?](#-why-use-this-template)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Demo Mode & Setup](#-demo-mode--setup-wizard)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Configuration](#️-configuration)
- [Customization](#-customization)
- [Security](#-security)
- [AI Features](#-ai-features-pro-tier)
- [Examples](#-examples)
- [Development](#️-development)
- [License](#-license)
- [Support](#-support)

</details>

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
| **Basic** | Floating feedback button, category selection, element picker, auto-capture page context |
| **Standard** | Everything in Basic + Admin dashboard, severity levels, screenshot capture, status management, statistics |
| **Pro** | Everything in Standard + AI categorization, auto-generated summaries, developer questions, sentiment analysis |

### New in v2.0
- 📱 **PWA Support** — Installable on mobile devices, works offline
- 📸 **Screenshot Capture** — One-click page screenshots attached to feedback
- 📊 **Export Presets** — Web, Print, and Presentation export profiles

### New in v2.1
- 🔍 **AI Semantic Code Search** — Natural language search across your codebase
- ✅ **Implementation Audit** — 28-task interactive checklist with copy-paste prompts
- ⚡ **Real-time Updates** — Live feedback updates via database subscriptions
- 🎯 **Optimistic UI** — Instant feedback with automatic rollback on errors
- 📱 **Enhanced Mobile UX** — Touch-friendly 44px targets, responsive layouts
- 🎙️ **Voice Search** — Speech-to-text for AI code search (admin only)

---

## 📸 Screenshots

<details>
<summary><strong>Click to expand screenshots</strong></summary>

<br />

### Feedback Widget

<div align="center">
  <img src="docs/images/feedback-widget.png" alt="Feedback Widget - Glassmorphism design with smooth animations" width="400">
  <br />
  <em>Beautiful glassmorphism design with smooth animations</em>
</div>

<br />

### Element Picker

<div align="center">
  <img src="docs/images/element-picker.png" alt="Element Picker - Click anywhere to highlight the exact element" width="700">
  <br />
  <em>Click anywhere to highlight the exact element with an issue</em>
</div>

<br />

### Admin Dashboard

<div align="center">
  <img src="docs/images/admin-dashboard.png" alt="Admin Dashboard - Manage all feedback with AI-generated summaries" width="700">
  <br />
  <em>Manage all feedback with AI-generated summaries and developer prompts</em>
</div>

</details>

---

## 🧪 Demo Mode & Setup Wizard

### Try Without Using Credits

This template includes a **Demo Mode** that lets you test the full AI-powered feedback flow without consuming any API credits:

- **Demo Mode**: Mock AI responses that simulate real output
- **Setup Wizard** (`/setup`): Verify your configuration and test submissions
- **Interactive Demo**: Try the feedback flow right on the landing page

Demo mode activates automatically when:
1. You explicitly request it (`demo_mode: true`)
2. No AI API key is configured
3. You're testing from the Setup Wizard

### Setup Wizard

Visit `/setup` after deploying to:

1. ✅ Check database connectivity
2. ✅ Verify AI provider status (Lovable AI / Demo Mode)
3. ✅ Test basic feedback submission
4. ✅ Test AI-enhanced submission (demo mode)

---

## 🚀 Quick Start

### Option 1: Use with Lovable (Recommended)

1. **Use this template** — Click "Use this template" on GitHub to create your own copy
2. **Connect to Lovable** — Go to [lovable.dev](https://lovable.dev), create a new project, and connect your GitHub repo
3. **Enable Lovable Cloud** — In the Lovable editor, enable Cloud to get a database automatically
4. **Run the migration** — Ask Lovable to run the database migration (see below)
5. **Visit /setup** — Run through the Setup Wizard to verify everything works
6. **Done!** — The feedback widget is ready to use

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
│   ├── Admin.tsx                # Admin dashboard page
│   └── Setup.tsx                # Setup wizard for template users
└── integrations/
    └── supabase/                # Auto-generated Supabase client

supabase/
├── functions/
│   ├── submit-feedback/         # Basic submission endpoint
│   ├── submit-feedback-ai/      # AI-enhanced submission endpoint
│   └── health-check/            # System health verification
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
    demoMode: false,              // Use mock AI (no credits)
    provider: 'lovable',          // 'lovable' | 'openai'
    summarize: true,              // Generate summaries
    categorize: true,             // Auto-categorize
    generateDevPrompt: true,      // Generate Lovable prompts
  },
  admin: {
    showStats: true,              // Show statistics
    copyToClipboard: true,        // Enable copy button
    exportEnabled: true,          // Enable CSV export
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

This template is designed with **production-ready security** in mind:

### Security Features

| Feature | Description |
|---------|-------------|
| **Row Level Security (RLS)** | All database tables have RLS enabled with proper policies |
| **Admin Authentication** | `admin_users` table controls who can view/manage all feedback |
| **Input Validation** | All feedback is sanitized and validated before storage |
| **Rate Limiting** | Edge functions include rate limiting (10/hour per user/IP) |
| **No IP Logging** | IP addresses are NOT stored (GDPR compliant) |
| **No Secrets in Code** | API keys stored securely in environment variables |
| **CORS Configuration** | Edge functions have proper CORS headers |

### Admin Access Control

The template uses an `admin_users` table for role-based access:

```sql
-- Add yourself as an admin (run in Supabase SQL editor)
INSERT INTO public.admin_users (user_id)
VALUES ('YOUR_USER_ID_HERE');

-- Find your user_id in Authentication > Users
```

### Demo Mode Security

The admin dashboard includes a **demo mode** for testing. In production:

1. Set `demoMode={false}` in `src/pages/Admin.tsx`
2. Add your user_id to the `admin_users` table
3. Implement authentication (see `src/hooks/useAdmin.ts`)

### RLS Policies

The template includes these security policies:

```sql
-- Anyone can submit feedback (anonymous allowed)
CREATE POLICY "Anyone can submit feedback"
  ON public.feedback FOR INSERT
  WITH CHECK ((user_id IS NULL) OR (user_id = auth.uid()));

-- Admins can view ALL feedback
CREATE POLICY "Admins can view all feedback"
  ON public.feedback FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Only admins can update/delete feedback
CREATE POLICY "Admins can update all feedback"
  ON public.feedback FOR UPDATE
  USING (public.is_admin());
```

### Stricter Security (Optional)

For production apps, consider these additional policies:

```sql
-- Only authenticated users can submit
DROP POLICY "Anyone can submit feedback" ON public.feedback;
CREATE POLICY "Authenticated users can submit feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
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

See the [`examples/`](./examples/) directory for complete, copy-paste ready integration patterns:

| Example | Description |
|---------|-------------|
| [`basic-tier.tsx`](./examples/basic-tier.tsx) | Minimal zero-config setup |
| [`standard-tier.tsx`](./examples/standard-tier.tsx) | Admin dashboard integration |
| [`pro-tier.tsx`](./examples/pro-tier.tsx) | Full AI-powered workflow |
| [`custom-integration.tsx`](./examples/custom-integration.tsx) | Advanced customization patterns |
| [`with-auth.tsx`](./examples/with-auth.tsx) | User authentication integration |

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

<div align="center">
  <strong>Made with ❤️ for the Lovable community</strong>
  <br />
  <br />
  <a href="https://lovable.dev">
    <img src="https://img.shields.io/badge/Built_with-Lovable-ff69b4?style=for-the-badge" alt="Built with Lovable">
  </a>
</div>
