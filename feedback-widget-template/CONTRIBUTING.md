# Contributing to Feedback Widget Template

First off, thank you for considering contributing! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## 📜 Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code.

**Our Standards:**
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what's best for the community
- Show empathy towards others

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- Supabase CLI (optional, for testing edge functions)

### Fork and Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/feedback-widget-template.git
cd feedback-widget-template
```

---

## 🤝 How to Contribute

### Types of Contributions

| Type | Description |
|------|-------------|
| 🐛 **Bug Fixes** | Fix issues in existing code |
| ✨ **Features** | Add new functionality |
| 📖 **Documentation** | Improve docs, examples, comments |
| 🧪 **Tests** | Add or improve tests |
| 🎨 **Design** | UI/UX improvements |
| 🔧 **Refactoring** | Code quality improvements |

### Good First Issues

Look for issues labeled `good first issue` - these are great for newcomers!

---

## 💻 Development Setup

### 1. Install Dependencies

```bash
npm install
# or
bun install
```

### 2. Set Up Supabase (Optional)

For testing edge functions locally:

```bash
supabase start
supabase functions serve
```

### 3. Run Development Server

```bash
npm run dev
```

---

## 📝 Pull Request Process

### Before Submitting

1. **Check existing PRs** - Avoid duplicates
2. **Create an issue first** - For significant changes
3. **Write tests** - If applicable
4. **Update documentation** - If you change behavior

### PR Checklist

- [ ] Code follows the [style guide](#style-guide)
- [ ] All tests pass
- [ ] Documentation updated (if needed)
- [ ] CHANGELOG.md updated (for notable changes)
- [ ] Commit messages are clear

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting (no code change)
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

**Examples:**
```
feat(form): add file attachment support
fix(picker): handle nested shadow DOM elements
docs(readme): add troubleshooting section
```

### Review Process

1. Submit your PR
2. Maintainers will review within 3-5 days
3. Address any feedback
4. Once approved, your PR will be merged

---

## 🎨 Style Guide

### TypeScript

```typescript
// ✅ Good
interface FeedbackConfig {
  appName: string;
  position?: 'bottom-right' | 'bottom-left';
}

// ❌ Bad
interface feedbackConfig {
  appname: string;
  position?: string;
}
```

### React Components

```tsx
// ✅ Good - Named exports, typed props
export function FeedbackButton({ config }: FeedbackButtonProps) {
  // ...
}

// ❌ Bad - Default exports, any types
export default function FeedbackButton({ config }: any) {
  // ...
}
```

### File Naming

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- Types: `camelCase.ts`

### Code Principles

1. **Keep it simple** - Avoid over-engineering
2. **Be explicit** - Prefer clarity over cleverness
3. **Document why** - Comments explain intent, not what
4. **Stay consistent** - Match existing patterns

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Try the latest version
3. Reproduce in a minimal setup

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Version: [e.g., 1.0.0]
```

---

## 💡 Requesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Any other context or screenshots.
```

---

## 🏷️ Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `enhancement` | New feature or request |
| `documentation` | Improvements to docs |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention needed |
| `question` | Further information needed |

---

## 📞 Getting Help

- 💬 [GitHub Discussions](https://github.com/YOUR_USERNAME/feedback-widget-template/discussions)
- 🐛 [Issue Tracker](https://github.com/YOUR_USERNAME/feedback-widget-template/issues)

---

## 🙏 Acknowledgments

Thank you to all contributors who help make this project better!

---

<p align="center">
  Happy Contributing! 🎉
</p>
