# 💬 Feedback Widget Template

> A modular, drop-in feedback collection system for React + Supabase projects. From simple bug reports to AI-powered insights in minutes.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 📸 Screenshots

<!-- Add your screenshots here -->
<p align="center">
  <img src="docs/images/feedback-button.png" alt="Feedback Button" width="200" />
  <img src="docs/images/feedback-form.png" alt="Feedback Form" width="300" />
  <img src="docs/images/admin-dashboard.png" alt="Admin Dashboard" width="400" />
</p>

> 💡 **No screenshots yet?** After setup, take screenshots of your widget and save them to `docs/images/`

---

## ✨ Why Use This?

| Building from Scratch | Using This Template |
|----------------------|---------------------|
| ⏱️ 2-4 weeks of work | ⚡ 10 minutes setup |
| 🔒 Roll your own security | ✅ Battle-tested security |
| 🤖 Integrate AI separately | 🎁 AI included (optional) |
| 📊 Build admin dashboard | 📊 Dashboard ready |
| 🧪 Write all the tests | 🧪 Tested & documented |

**Perfect for:**
- 🚀 **Startups** - Ship faster with built-in feedback
- 👨‍💻 **Solo developers** - Focus on your product, not plumbing
- 🏢 **Teams** - Standardized feedback across projects
- 📚 **Learning** - Great example of React + Supabase patterns

---

## 🎯 Features

| Tier | For | Features | AI? |
|------|-----|----------|-----|
| **Basic** | End Users | Submit feedback, pin UI elements | ❌ |
| **Standard** | Admins | Dashboard, stats, status management | ❌ |
| **Pro** | Power Users | AI summaries, auto-categorization, dev prompts | ✅ |

### User Features
- 📝 Simple feedback form with categories
- 🎯 **Element Picker** - Click any UI element to reference it
- 🔐 Works with or without authentication
- 📱 Fully responsive design

### Admin Features
- 📊 Statistics dashboard
- 📋 Filterable feedback list
- ✏️ Status updates and notes
- 📤 Export to CSV
- 📋 Copy as developer prompt

### AI Features (Pro)
- 🤖 Automatic summarization
- 🏷️ Smart categorization
- 💡 Generated developer questions
- 🔌 Lovable AI or OpenAI

---

## 🚀 Quick Start (5 Minutes)

### 1. Copy the template

```bash
# Copy to your project
cp -r feedback-widget-template/ your-project/src/feedback/
```

### 2. Run the migration

```bash
# Using Supabase CLI
supabase migration up

# Or run manually in Supabase SQL Editor:
# File: supabase/migrations/create_feedback_table.sql
```

### 3. Deploy edge functions

```bash
cp -r feedback-widget-template/supabase/functions/* supabase/functions/
supabase functions deploy submit-feedback
supabase functions deploy submit-feedback-ai  # Optional: Pro tier only
```

### 4. Add the widget

```tsx
import { FeedbackButton, createConfig } from './feedback';

function App() {
  const config = createConfig({ appName: "My App" }, 'basic');
  
  return (
    <>
      <YourApp />
      <FeedbackButton config={config} />
    </>
  );
}
```

**That's it!** 🎉

---

## 📖 Configuration

```typescript
import { createConfig } from './feedback';

// Basic - just feedback collection
const basicConfig = createConfig({ appName: "My App" }, 'basic');

// Standard - with admin dashboard
const standardConfig = createConfig({ appName: "My App" }, 'standard');

// Pro - full AI features
const proConfig = createConfig({ 
  appName: "My App",
  ai: { enabled: true, provider: 'lovable' }
}, 'pro');
```

### Full Configuration Reference

```typescript
const config = createConfig({
  // Required
  appName: "My App",
  
  // Position
  position: 'bottom-right', // bottom-left, top-right, top-left
  buttonColor: '#3B82F6',
  
  // Features
  features: {
    elementPicker: true,      // Allow targeting UI elements
    categories: true,         // Show category selector
    severityLevels: true,     // Show severity selector
    anonymousSubmission: true // Allow without login
  },
  
  // AI (Pro tier)
  ai: {
    enabled: true,
    provider: 'lovable',      // or 'openai'
    summarize: true,
    categorize: true,
    generateDevPrompt: true
  },
  
  // Custom categories
  categories: [
    { id: 'bug', label: 'Bug', icon: '🐛', color: '#EF4444' },
    { id: 'feature', label: 'Feature', icon: '✨', color: '#3B82F6' },
    { id: 'ux', label: 'UX Issue', icon: '🎨', color: '#8B5CF6' }
  ],
  
  // Callbacks
  onSubmit: (feedback) => console.log('Submitted:', feedback),
  onError: (error) => console.error('Error:', error)
}, 'pro');
```

---

## 🏗️ Project Structure

```
feedback-widget-template/
├── src/
│   ├── components/
│   │   ├── user/              # User-facing components
│   │   │   ├── FeedbackButton.tsx
│   │   │   ├── FeedbackForm.tsx
│   │   │   └── ElementPicker.tsx
│   │   └── admin/             # Admin dashboard
│   │       ├── FeedbackDashboard.tsx
│   │       ├── FeedbackList.tsx
│   │       ├── FeedbackDetail.tsx
│   │       └── FeedbackStats.tsx
│   ├── config/
│   │   └── feedback.config.ts # Configuration system
│   ├── hooks/
│   │   └── useFeedback.ts     # React hooks
│   ├── types/
│   │   └── feedback.ts        # TypeScript types
│   └── index.ts               # Main exports
├── supabase/
│   ├── functions/
│   │   ├── submit-feedback/   # Standard submission
│   │   └── submit-feedback-ai/# AI-enhanced submission
│   └── migrations/
│       └── create_feedback_table.sql
├── examples/
│   ├── basic-setup.tsx
│   ├── with-auth.tsx
│   └── pro-tier.tsx
├── docs/
│   └── images/                # Screenshots
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CUSTOMIZATION.md
└── LICENSE
```

---

## 🔒 Security

This template includes enterprise-grade security:

- ✅ **Rate Limiting** - 50 req/hour (configurable)
- ✅ **Input Validation** - XSS prevention, length limits
- ✅ **Row Level Security** - User-scoped data access
- ✅ **Safe Errors** - No internal details leaked
- ✅ **CORS** - Configurable origins

See [SECURITY.md](SECURITY.md) for complete documentation.

---

## 🎨 Customization

See [CUSTOMIZATION.md](CUSTOMIZATION.md) for:

- Custom categories and theming
- CSS variables for styling
- Custom backend integration
- Webhook notifications
- Slack/Discord/Linear integration
- Multi-tenant setup

---

## 📚 Examples

| Example | Description |
|---------|-------------|
| [Basic Setup](examples/basic-setup.tsx) | Minimal user widget |
| [With Auth](examples/with-auth.tsx) | User authentication |
| [Pro Tier](examples/pro-tier.tsx) | Full AI features |

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## 🆘 Support

- 📖 [Documentation](./README.md)
- 🐛 [Report a Bug](https://github.com/YOUR_USERNAME/feedback-widget-template/issues)
- 💡 [Request a Feature](https://github.com/YOUR_USERNAME/feedback-widget-template/issues)
- 💬 [Discussions](https://github.com/YOUR_USERNAME/feedback-widget-template/discussions)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## ⭐ Star This Repo

If this template saved you time, consider giving it a star! It helps others discover it.

[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/feedback-widget-template?style=social)](https://github.com/YOUR_USERNAME/feedback-widget-template)

---

<p align="center">
  Made with ❤️ using <a href="https://lovable.dev">Lovable</a>
</p>
