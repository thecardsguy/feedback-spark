# Documentation Images

This folder contains visual assets for the project README and documentation.

## Required Assets

| File | Description | Dimensions | Format |
|------|-------------|------------|--------|
| `hero-screenshot.png` | Landing page showing hero section and widget button | 1280×720px | PNG |
| `demo.gif` | Animated demo: click widget → select element → fill form → submit | 800×600px | GIF (<5MB) |
| `admin-dashboard.png` | Admin dashboard with feedback list and stats | 1280×720px | PNG |
| `feedback-widget.png` | Close-up of the open feedback form | 400×600px | PNG |
| `element-picker.png` | Element selection in action with highlight | 800×500px | PNG |

## Optional Assets (Dark Mode)

For theme-aware documentation, create dark mode variants:

| File | Description |
|------|-------------|
| `hero-screenshot-dark.png` | Hero screenshot in dark mode |
| `admin-dashboard-dark.png` | Admin dashboard in dark mode |

## Creating Assets

### Screenshots

1. Open browser DevTools (F12)
2. Click device toolbar icon or press `Ctrl+Shift+M`
3. Set custom dimensions to match required size
4. Take screenshot: `Ctrl+Shift+P` → "Capture screenshot"

### Demo GIF

**Recommended Tools:**
- Windows: [ScreenToGif](https://www.screentogif.com/)
- macOS: [Kap](https://getkap.co/) or [LICEcap](https://www.cockos.com/licecap/)
- Online: [ezgif.com](https://ezgif.com/) for optimization

**Recording Tips:**
- Keep duration 15–30 seconds
- Use consistent mouse movements
- Record at actual size, not scaled
- Optimize to under 5MB for fast loading

### Optimization

Use [TinyPNG](https://tinypng.com/) for PNG compression (typically 50–70% size reduction).

## Naming Convention

- Use lowercase with hyphens: `hero-screenshot.png`
- Include variant suffix for themes: `hero-screenshot-dark.png`
- No spaces or special characters

## Usage in README

```markdown
<!-- Standard image -->
![Hero](docs/images/hero-screenshot.png)

<!-- Theme-aware image -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/hero-screenshot-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="docs/images/hero-screenshot.png">
  <img alt="Hero" src="docs/images/hero-screenshot.png" width="800">
</picture>
```
