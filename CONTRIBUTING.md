# Contributing to Feedback Widget Template

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Start

1. **Fork & Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/feedback-chatbot.git
   cd feedback-chatbot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Add your Supabase credentials
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Use semantic Tailwind CSS tokens (not hardcoded colors)
- Write small, focused components

### Security Best Practices

⚠️ **Critical**: This is a security-hardened template. Please follow these guidelines:

1. **Never log sensitive data**
   - No IP addresses
   - No user credentials
   - No API keys in console

2. **Always validate input**
   - Use Zod schemas for form validation
   - Validate on both client and server

3. **Use RLS policies**
   - All new tables must have Row Level Security
   - Test policies with different user roles

4. **CORS configuration**
   - Never use wildcard (`*`) in production
   - Add domains to `ALLOWED_ORIGINS` whitelist

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feedback category
fix: resolve rate limiting bypass
docs: update installation guide
security: patch XSS vulnerability
```

## 🧪 Testing

Before submitting a PR:

1. Run the linter:
   ```bash
   npm run lint
   ```

2. Check TypeScript:
   ```bash
   npm run typecheck
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Test all three tiers manually:
   - Basic: Feedback submission
   - Standard: Admin dashboard
   - Pro: AI analysis

## 📝 Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the guidelines above
3. Update documentation if needed
4. Submit a PR with a clear description
5. Wait for review

### PR Checklist

- [ ] Code follows existing patterns
- [ ] No security vulnerabilities introduced
- [ ] TypeScript compiles without errors
- [ ] Tested in all relevant tiers
- [ ] Documentation updated (if applicable)

## 🔒 Security Vulnerabilities

If you discover a security vulnerability, please **do not** open a public issue. Instead:

1. Email security concerns privately
2. Provide steps to reproduce
3. Wait for acknowledgment before disclosure

## 📚 Resources

- [README.md](README.md) - Project overview
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [Lovable Docs](https://docs.lovable.dev) - Platform documentation

## 💬 Getting Help

- Open a [Discussion](https://github.com/lovableai/feedback-chatbot/discussions)
- Join the [Lovable Discord](https://discord.gg/lovable)
- Check existing [Issues](https://github.com/lovableai/feedback-chatbot/issues)

---

Thank you for contributing! 🎉
