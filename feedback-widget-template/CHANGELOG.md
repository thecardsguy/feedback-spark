# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- _Nothing yet_

### Changed
- _Nothing yet_

### Fixed
- _Nothing yet_

---

## [1.0.0] - 2026-01-12

### Added

#### Core Components
- **FeedbackButton** - Floating button that opens the feedback form
- **FeedbackForm** - Full-featured feedback submission form
- **ElementPicker** - Visual element targeting for UI feedback
- **FeedbackDashboard** - Complete admin dashboard
- **FeedbackList** - Sortable, filterable feedback list
- **FeedbackDetail** - Detailed view with actions and AI features
- **FeedbackStats** - Statistics and analytics display

#### Configuration System
- Three-tier presets: Basic, Standard, Pro
- `createConfig()` helper with sensible defaults
- Customizable categories, colors, and callbacks
- Position options (bottom-right, bottom-left, top-right, top-left)

#### AI Features (Pro Tier)
- AI-powered feedback summarization
- Automatic categorization
- Developer question generation
- Support for Lovable AI and OpenAI providers

#### Edge Functions
- `submit-feedback` - Standard feedback submission
- `submit-feedback-ai` - AI-enhanced submission with analysis

#### Security
- Rate limiting (50 requests/hour default)
- Input validation and XSS prevention
- Row Level Security (RLS) policies
- Safe error messages (no internal details leaked)
- CORS configuration

#### Database
- Complete schema with `feedback` table
- RLS policies for user-scoped access
- Audit logging support
- Multi-tenant ready

#### Documentation
- README with quick start guide
- SECURITY.md with security best practices
- CUSTOMIZATION.md with advanced configuration
- Example files for each tier

#### Examples
- `basic-setup.tsx` - Minimal user widget
- `with-auth.tsx` - User authentication integration
- `pro-tier.tsx` - Full AI features

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-01-12 | Initial release |

---

## Upgrade Guide

### Upgrading to 1.x

This is the initial release. No upgrade steps required.

---

## Links

- [GitHub Releases](https://github.com/YOUR_USERNAME/feedback-widget-template/releases)
- [Documentation](./README.md)
- [Security Policy](./SECURITY.md)
- [Customization Guide](./CUSTOMIZATION.md)
