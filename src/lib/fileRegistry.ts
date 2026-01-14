/**
 * File Registry - Metadata for all project files
 * Used by the Code Map feature to visualize and navigate the codebase
 */

export type FileCategory =
  | "pages"
  | "components-common"
  | "components-landing"
  | "components-feedback"
  | "components-admin"
  | "components-setup"
  | "components-tiers"
  | "components-download"
  | "components-auth"
  | "components-testing"
  | "components-codemap"
  | "components-ui"
  | "hooks"
  | "contexts"
  | "lib"
  | "integrations"
  | "edge-functions"
  | "config"
  | "types"
  | "examples";

export interface FileEntry {
  id: string;
  name: string;
  path: string;
  category: FileCategory;
  description: string;
  lines: number;
  imports?: string[];
  usedBy?: string[];
}

export const fileRegistry: FileEntry[] = [
  // ============================================
  // PAGES
  // ============================================
  {
    id: "page-index",
    name: "Index.tsx",
    path: "src/pages/Index.tsx",
    category: "pages",
    description: "Landing page with hero, features, tiers, and download options",
    lines: 55,
    imports: ["Navbar", "TierComparison", "DownloadTemplate", "AccuracyTest", "FeedbackButton", "HeroSection", "QuickStartSection", "FeaturesGrid", "TiersSection", "GetTemplateSection", "Footer"],
    usedBy: ["AnimatedRoutes"],
  },
  {
    id: "page-admin",
    name: "Admin.tsx",
    path: "src/pages/Admin.tsx",
    category: "pages",
    description: "Protected admin dashboard for viewing feedback submissions",
    lines: 45,
    imports: ["AdminGuard", "FeedbackDashboard", "Navbar"],
    usedBy: ["AnimatedRoutes"],
  },
  {
    id: "page-setup",
    name: "Setup.tsx",
    path: "src/pages/Setup.tsx",
    category: "pages",
    description: "Setup wizard and guide for configuring the feedback widget",
    lines: 35,
    imports: ["SetupGuide", "OnboardingWizard", "Navbar"],
    usedBy: ["AnimatedRoutes"],
  },
  {
    id: "page-demo",
    name: "ClientDemo.tsx",
    path: "src/pages/ClientDemo.tsx",
    category: "pages",
    description: "Interactive demo page showing the feedback widget in action",
    lines: 120,
    imports: ["FeedbackButton", "Navbar"],
    usedBy: ["AnimatedRoutes"],
  },
  {
    id: "page-login",
    name: "Login.tsx",
    path: "src/pages/Login.tsx",
    category: "pages",
    description: "User login page with authentication form",
    lines: 85,
    imports: ["AuthContext"],
    usedBy: ["AnimatedRoutes"],
  },
  {
    id: "page-signup",
    name: "Signup.tsx",
    path: "src/pages/Signup.tsx",
    category: "pages",
    description: "User registration page with signup form",
    lines: 90,
    imports: ["AuthContext"],
    usedBy: ["AnimatedRoutes"],
  },
  {
    id: "page-install",
    name: "Install.tsx",
    path: "src/pages/Install.tsx",
    category: "pages",
    description: "Installation instructions page",
    lines: 60,
    imports: ["Navbar"],
    usedBy: ["AnimatedRoutes"],
  },
  {
    id: "page-notfound",
    name: "NotFound.tsx",
    path: "src/pages/NotFound.tsx",
    category: "pages",
    description: "404 error page for unmatched routes",
    lines: 25,
    imports: [],
    usedBy: ["AnimatedRoutes"],
  },
  {
    id: "page-codemap",
    name: "CodeMap.tsx",
    path: "src/pages/CodeMap.tsx",
    category: "pages",
    description: "Visual file browser with search and category filters",
    lines: 199,
    imports: ["Navbar", "CategoryFilter", "FileCard", "fileRegistry"],
    usedBy: ["AnimatedRoutes"],
  },

  // ============================================
  // COMMON COMPONENTS
  // ============================================
  {
    id: "comp-navbar",
    name: "Navbar.tsx",
    path: "src/components/common/Navbar.tsx",
    category: "components-common",
    description: "Global navigation header with responsive mobile menu",
    lines: 131,
    imports: ["ThemeToggle", "Button"],
    usedBy: ["Index", "Admin", "Setup", "ClientDemo", "Install", "CodeMap"],
  },
  {
    id: "comp-theme-toggle",
    name: "ThemeToggle.tsx",
    path: "src/components/common/ThemeToggle.tsx",
    category: "components-common",
    description: "Dark/light mode toggle button with sun/moon icons",
    lines: 85,
    imports: ["Button", "DropdownMenu"],
    usedBy: ["Navbar"],
  },
  {
    id: "comp-theme-provider",
    name: "ThemeProvider.tsx",
    path: "src/components/common/ThemeProvider.tsx",
    category: "components-common",
    description: "Theme context provider for dark/light mode",
    lines: 45,
    imports: [],
    usedBy: ["App"],
  },
  {
    id: "comp-page-transition",
    name: "PageTransition.tsx",
    path: "src/components/common/PageTransition.tsx",
    category: "components-common",
    description: "Animated page transition wrapper using framer-motion",
    lines: 44,
    imports: ["framer-motion"],
    usedBy: ["AnimatedRoutes"],
  },
  {
    id: "comp-animated-routes",
    name: "AnimatedRoutes.tsx",
    path: "src/components/AnimatedRoutes.tsx",
    category: "components-common",
    description: "Route definitions with page transition animations",
    lines: 95,
    imports: ["PageTransition", "all pages"],
    usedBy: ["App"],
  },
  {
    id: "comp-common-index",
    name: "index.ts",
    path: "src/components/common/index.ts",
    category: "components-common",
    description: "Re-exports for common components",
    lines: 9,
    imports: [],
    usedBy: ["multiple pages"],
  },

  // ============================================
  // LANDING PAGE COMPONENTS
  // ============================================
  {
    id: "landing-hero",
    name: "HeroSection.tsx",
    path: "src/components/landing/HeroSection.tsx",
    category: "components-landing",
    description: "Hero section with animated tagline and CTA buttons",
    lines: 120,
    imports: ["Badge", "Button", "framer-motion"],
    usedBy: ["Index"],
  },
  {
    id: "landing-quickstart",
    name: "QuickStartSection.tsx",
    path: "src/components/landing/QuickStartSection.tsx",
    category: "components-landing",
    description: "3-step quickstart guide with code example",
    lines: 180,
    imports: ["Card", "Badge", "framer-motion"],
    usedBy: ["Index"],
  },
  {
    id: "landing-features",
    name: "FeaturesGrid.tsx",
    path: "src/components/landing/FeaturesGrid.tsx",
    category: "components-landing",
    description: "Feature cards grid with icons and descriptions",
    lines: 150,
    imports: ["Card", "Badge", "framer-motion"],
    usedBy: ["Index"],
  },
  {
    id: "landing-tiers",
    name: "TiersSection.tsx",
    path: "src/components/landing/TiersSection.tsx",
    category: "components-landing",
    description: "Pricing tiers section with TierComparison",
    lines: 108,
    imports: ["TierComparison", "Badge", "framer-motion"],
    usedBy: ["Index"],
  },
  {
    id: "landing-gettemplate",
    name: "GetTemplateSection.tsx",
    path: "src/components/landing/GetTemplateSection.tsx",
    category: "components-landing",
    description: "Download options cards with SetupGuide",
    lines: 147,
    imports: ["SetupGuide", "Card", "Button", "framer-motion"],
    usedBy: ["Index"],
  },
  {
    id: "landing-footer",
    name: "Footer.tsx",
    path: "src/components/landing/Footer.tsx",
    category: "components-landing",
    description: "Footer with links and branding",
    lines: 80,
    imports: [],
    usedBy: ["Index"],
  },
  {
    id: "landing-index",
    name: "index.ts",
    path: "src/components/landing/index.ts",
    category: "components-landing",
    description: "Re-exports for landing page components",
    lines: 13,
    imports: [],
    usedBy: ["Index"],
  },

  // ============================================
  // FEEDBACK USER COMPONENTS
  // ============================================
  {
    id: "feedback-button",
    name: "FeedbackButton.tsx",
    path: "src/feedback/components/user/FeedbackButton.tsx",
    category: "components-feedback",
    description: "Floating feedback trigger button",
    lines: 80,
    imports: ["FeedbackForm"],
    usedBy: ["Index", "ClientDemo"],
  },
  {
    id: "feedback-form",
    name: "FeedbackForm.tsx",
    path: "src/feedback/components/user/FeedbackForm.tsx",
    category: "components-feedback",
    description: "Modal form for submitting feedback with screenshot capability",
    lines: 250,
    imports: ["ElementPicker", "useFeedback"],
    usedBy: ["FeedbackButton"],
  },
  {
    id: "element-picker",
    name: "ElementPicker.tsx",
    path: "src/feedback/components/user/ElementPicker.tsx",
    category: "components-feedback",
    description: "Visual element selector for targeting specific UI elements",
    lines: 150,
    imports: [],
    usedBy: ["FeedbackForm"],
  },

  // ============================================
  // FEEDBACK ADMIN COMPONENTS
  // ============================================
  {
    id: "feedback-dashboard",
    name: "FeedbackDashboard.tsx",
    path: "src/feedback/components/admin/FeedbackDashboard.tsx",
    category: "components-admin",
    description: "Main admin dashboard container for feedback management",
    lines: 120,
    imports: ["FeedbackList", "FeedbackStats", "FeedbackDetail"],
    usedBy: ["Admin"],
  },
  {
    id: "feedback-list",
    name: "FeedbackList.tsx",
    path: "src/feedback/components/admin/FeedbackList.tsx",
    category: "components-admin",
    description: "Paginated list of feedback submissions with filters",
    lines: 180,
    imports: ["Table", "Badge"],
    usedBy: ["FeedbackDashboard"],
  },
  {
    id: "feedback-detail",
    name: "FeedbackDetail.tsx",
    path: "src/feedback/components/admin/FeedbackDetail.tsx",
    category: "components-admin",
    description: "Detailed view of a single feedback submission",
    lines: 200,
    imports: ["Card", "Badge"],
    usedBy: ["FeedbackDashboard"],
  },
  {
    id: "feedback-stats",
    name: "FeedbackStats.tsx",
    path: "src/feedback/components/admin/FeedbackStats.tsx",
    category: "components-admin",
    description: "Statistics and charts for feedback analytics",
    lines: 150,
    imports: ["Card", "recharts"],
    usedBy: ["FeedbackDashboard"],
  },

  // ============================================
  // SETUP COMPONENTS
  // ============================================
  {
    id: "setup-guide",
    name: "SetupGuide.tsx",
    path: "src/components/setup/SetupGuide.tsx",
    category: "components-setup",
    description: "Comprehensive setup guide with file structure and SQL",
    lines: 508,
    imports: ["SetupVerification", "DownloadTemplate", "Card", "Tabs"],
    usedBy: ["GetTemplateSection"],
  },
  {
    id: "setup-verification",
    name: "SetupVerification.tsx",
    path: "src/components/setup/SetupVerification.tsx",
    category: "components-setup",
    description: "Connection tests for database, edge functions, and AI",
    lines: 350,
    imports: ["Card", "supabase"],
    usedBy: ["SetupGuide"],
  },
  {
    id: "setup-index",
    name: "index.ts",
    path: "src/components/setup/index.ts",
    category: "components-setup",
    description: "Re-exports for setup components",
    lines: 7,
    imports: [],
    usedBy: ["GetTemplateSection"],
  },

  // ============================================
  // AUTH COMPONENTS
  // ============================================
  {
    id: "admin-guard",
    name: "AdminGuard.tsx",
    path: "src/components/auth/AdminGuard.tsx",
    category: "components-auth",
    description: "Route protection for admin-only pages",
    lines: 128,
    imports: ["useAuth", "Button"],
    usedBy: ["Admin"],
  },
  {
    id: "onboarding-modal",
    name: "OnboardingModal.tsx",
    path: "src/components/auth/OnboardingModal.tsx",
    category: "components-auth",
    description: "Welcome modal for first-time users",
    lines: 169,
    imports: ["Dialog"],
    usedBy: ["Setup"],
  },
  {
    id: "onboarding-wizard",
    name: "OnboardingWizard.tsx",
    path: "src/components/auth/OnboardingWizard.tsx",
    category: "components-auth",
    description: "Step-by-step onboarding wizard with verification",
    lines: 459,
    imports: ["Card", "Button", "Progress"],
    usedBy: ["SetupGuide"],
  },
  {
    id: "auth-index",
    name: "index.ts",
    path: "src/components/auth/index.ts",
    category: "components-auth",
    description: "Re-exports for auth components",
    lines: 8,
    imports: [],
    usedBy: ["multiple pages"],
  },

  // ============================================
  // TIER COMPONENTS
  // ============================================
  {
    id: "tier-comparison",
    name: "TierComparison.tsx",
    path: "src/components/tiers/TierComparison.tsx",
    category: "components-tiers",
    description: "Feature comparison table with PDF/image export",
    lines: 434,
    imports: ["Card", "Dialog", "vendorScripts"],
    usedBy: ["TiersSection"],
  },
  {
    id: "tiers-index",
    name: "index.ts",
    path: "src/components/tiers/index.ts",
    category: "components-tiers",
    description: "Re-exports for tier comparison components",
    lines: 6,
    imports: [],
    usedBy: ["TiersSection"],
  },

  // ============================================
  // TESTING COMPONENTS
  // ============================================
  {
    id: "accuracy-test",
    name: "AccuracyTest.tsx",
    path: "src/components/testing/AccuracyTest.tsx",
    category: "components-testing",
    description: "AI categorization accuracy testing tool with real API calls",
    lines: 435,
    imports: ["Card", "Button", "Badge", "Progress", "framer-motion"],
    usedBy: ["Index"],
  },
  {
    id: "testing-index",
    name: "index.ts",
    path: "src/components/testing/index.ts",
    category: "components-testing",
    description: "Re-exports for testing components",
    lines: 6,
    imports: [],
    usedBy: ["Index"],
  },

  // ============================================
  // CODEMAP COMPONENTS
  // ============================================
  {
    id: "codemap-filter",
    name: "CategoryFilter.tsx",
    path: "src/components/codemap/CategoryFilter.tsx",
    category: "components-codemap",
    description: "Category dropdown filter for Code Map",
    lines: 39,
    imports: ["Select", "fileRegistry"],
    usedBy: ["CodeMap"],
  },
  {
    id: "codemap-card",
    name: "FileCard.tsx",
    path: "src/components/codemap/FileCard.tsx",
    category: "components-codemap",
    description: "File entry card with expandable metadata display",
    lines: 128,
    imports: ["Card", "Badge", "framer-motion"],
    usedBy: ["CodeMap"],
  },
  {
    id: "codemap-index",
    name: "index.ts",
    path: "src/components/codemap/index.ts",
    category: "components-codemap",
    description: "Re-exports for code map components",
    lines: 7,
    imports: [],
    usedBy: ["CodeMap"],
  },

  // ============================================
  // DOWNLOAD COMPONENTS
  // ============================================
  {
    id: "download-template",
    name: "DownloadTemplate.tsx",
    path: "src/components/DownloadTemplate.tsx",
    category: "components-download",
    description: "ZIP template generator with all feedback widget files",
    lines: 438,
    imports: ["Button", "jszip", "template files"],
    usedBy: ["Index", "SetupGuide"],
  },

  // ============================================
  // DOWNLOAD TEMPLATE FILES
  // ============================================
  {
    id: "template-types",
    name: "types.template.ts",
    path: "src/components/download/templates/types.template.ts",
    category: "components-download",
    description: "Template string for TypeScript type definitions",
    lines: 148,
    imports: [],
    usedBy: ["DownloadTemplate"],
  },
  {
    id: "template-config",
    name: "config.template.ts",
    path: "src/components/download/templates/config.template.ts",
    category: "components-download",
    description: "Template string for configuration presets",
    lines: 68,
    imports: [],
    usedBy: ["DownloadTemplate"],
  },
  {
    id: "template-hooks",
    name: "hooks.template.ts",
    path: "src/components/download/templates/hooks.template.ts",
    category: "components-download",
    description: "Template string for React hooks (useFeedback, useFeedbackStats)",
    lines: 127,
    imports: [],
    usedBy: ["DownloadTemplate"],
  },
  {
    id: "template-user-components",
    name: "user-components.template.ts",
    path: "src/components/download/templates/user-components.template.ts",
    category: "components-download",
    description: "Template strings for FeedbackButton, FeedbackForm, ElementPicker",
    lines: 296,
    imports: [],
    usedBy: ["DownloadTemplate"],
  },
  {
    id: "template-admin-components",
    name: "admin-components.template.ts",
    path: "src/components/download/templates/admin-components.template.ts",
    category: "components-download",
    description: "Template strings for admin dashboard components",
    lines: 224,
    imports: [],
    usedBy: ["DownloadTemplate"],
  },
  {
    id: "template-edge-functions",
    name: "edge-functions.template.ts",
    path: "src/components/download/templates/edge-functions.template.ts",
    category: "components-download",
    description: "Template strings for Supabase Edge Functions",
    lines: 135,
    imports: [],
    usedBy: ["DownloadTemplate"],
  },
  {
    id: "template-misc",
    name: "misc.template.ts",
    path: "src/components/download/templates/misc.template.ts",
    category: "components-download",
    description: "Template strings for SQL, index, QuickStart, and README",
    lines: 213,
    imports: [],
    usedBy: ["DownloadTemplate"],
  },
  {
    id: "template-index",
    name: "index.ts",
    path: "src/components/download/templates/index.ts",
    category: "components-download",
    description: "Re-exports all template constants",
    lines: 29,
    imports: [],
    usedBy: ["DownloadTemplate"],
  },

  // ============================================
  // HOOKS
  // ============================================
  {
    id: "hook-feedback",
    name: "useFeedback.ts",
    path: "src/feedback/hooks/useFeedback.ts",
    category: "hooks",
    description: "Hook for submitting feedback to the backend",
    lines: 80,
    imports: ["supabase", "feedbackConfig"],
    usedBy: ["FeedbackForm"],
  },
  {
    id: "hook-admin",
    name: "useAdmin.ts",
    path: "src/hooks/useAdmin.ts",
    category: "hooks",
    description: "Hook for checking admin status",
    lines: 45,
    imports: ["supabase", "AuthContext"],
    usedBy: ["AdminGuard", "FeedbackDashboard"],
  },
  {
    id: "hook-toast",
    name: "use-toast.ts",
    path: "src/hooks/use-toast.ts",
    category: "hooks",
    description: "Toast notification hook",
    lines: 100,
    imports: [],
    usedBy: ["multiple components"],
  },
  {
    id: "hook-mobile",
    name: "use-mobile.tsx",
    path: "src/hooks/use-mobile.tsx",
    category: "hooks",
    description: "Hook for detecting mobile viewport",
    lines: 20,
    imports: [],
    usedBy: ["Navbar", "FeedbackForm"],
  },

  // ============================================
  // CONTEXTS
  // ============================================
  {
    id: "ctx-auth",
    name: "AuthContext.tsx",
    path: "src/contexts/AuthContext.tsx",
    category: "contexts",
    description: "Authentication context with user state and methods",
    lines: 120,
    imports: ["supabase"],
    usedBy: ["App", "Login", "Signup", "AdminGuard"],
  },

  // ============================================
  // LIB/UTILS
  // ============================================
  {
    id: "lib-utils",
    name: "utils.ts",
    path: "src/lib/utils.ts",
    category: "lib",
    description: "Utility functions including cn() for class merging",
    lines: 10,
    imports: ["clsx", "tailwind-merge"],
    usedBy: ["all components"],
  },
  {
    id: "lib-vendor",
    name: "vendorScripts.ts",
    path: "src/lib/vendorScripts.ts",
    category: "lib",
    description: "Dynamic loader for html2canvas and jspdf vendor scripts",
    lines: 50,
    imports: [],
    usedBy: ["TierComparison"],
  },
  {
    id: "lib-fileregistry",
    name: "fileRegistry.ts",
    path: "src/lib/fileRegistry.ts",
    category: "lib",
    description: "Metadata registry for all project files with helper functions",
    lines: 920,
    imports: [],
    usedBy: ["CodeMap", "CategoryFilter", "FileCard"],
  },

  // ============================================
  // INTEGRATIONS
  // ============================================
  {
    id: "int-supabase-client",
    name: "client.ts",
    path: "src/integrations/supabase/client.ts",
    category: "integrations",
    description: "Supabase client instance (auto-generated)",
    lines: 15,
    imports: ["@supabase/supabase-js"],
    usedBy: ["useFeedback", "useAdmin", "SetupVerification"],
  },
  {
    id: "int-supabase-types",
    name: "types.ts",
    path: "src/integrations/supabase/types.ts",
    category: "integrations",
    description: "TypeScript types for Supabase tables (auto-generated)",
    lines: 226,
    imports: [],
    usedBy: ["useFeedback", "FeedbackDashboard"],
  },

  // ============================================
  // EDGE FUNCTIONS
  // ============================================
  {
    id: "edge-health",
    name: "health-check/index.ts",
    path: "supabase/functions/health-check/index.ts",
    category: "edge-functions",
    description: "Health check endpoint for verifying edge function deployment",
    lines: 25,
    imports: [],
    usedBy: ["SetupVerification"],
  },
  {
    id: "edge-submit",
    name: "submit-feedback/index.ts",
    path: "supabase/functions/submit-feedback/index.ts",
    category: "edge-functions",
    description: "Basic feedback submission endpoint",
    lines: 80,
    imports: ["supabase-js"],
    usedBy: ["useFeedback"],
  },
  {
    id: "edge-submit-ai",
    name: "submit-feedback-ai/index.ts",
    path: "supabase/functions/submit-feedback-ai/index.ts",
    category: "edge-functions",
    description: "AI-powered feedback submission with categorization",
    lines: 150,
    imports: ["supabase-js", "Lovable AI"],
    usedBy: ["useFeedback", "AccuracyTest"],
  },

  // ============================================
  // CONFIG
  // ============================================
  {
    id: "cfg-feedback",
    name: "feedback.config.ts",
    path: "src/feedback/config/feedback.config.ts",
    category: "config",
    description: "Configuration options for the feedback widget",
    lines: 60,
    imports: [],
    usedBy: ["FeedbackButton", "FeedbackForm", "useFeedback"],
  },
  {
    id: "cfg-tailwind",
    name: "tailwind.config.ts",
    path: "tailwind.config.ts",
    category: "config",
    description: "Tailwind CSS configuration with custom theme",
    lines: 80,
    imports: [],
    usedBy: [],
  },
  {
    id: "cfg-vite",
    name: "vite.config.ts",
    path: "vite.config.ts",
    category: "config",
    description: "Vite build configuration with PWA plugin",
    lines: 40,
    imports: [],
    usedBy: [],
  },

  // ============================================
  // TYPES
  // ============================================
  {
    id: "type-feedback",
    name: "feedback.ts",
    path: "src/feedback/types/feedback.ts",
    category: "types",
    description: "TypeScript interfaces for feedback data structures",
    lines: 45,
    imports: [],
    usedBy: ["useFeedback", "FeedbackForm", "FeedbackDashboard"],
  },

  // ============================================
  // EXAMPLES
  // ============================================
  {
    id: "ex-basic",
    name: "basic-tier.tsx",
    path: "examples/basic-tier.tsx",
    category: "examples",
    description: "Example implementation of Basic tier configuration",
    lines: 30,
    imports: [],
    usedBy: [],
  },
  {
    id: "ex-standard",
    name: "standard-tier.tsx",
    path: "examples/standard-tier.tsx",
    category: "examples",
    description: "Example implementation of Standard tier configuration",
    lines: 35,
    imports: [],
    usedBy: [],
  },
  {
    id: "ex-pro",
    name: "pro-tier.tsx",
    path: "examples/pro-tier.tsx",
    category: "examples",
    description: "Example implementation of Pro tier with AI",
    lines: 40,
    imports: [],
    usedBy: [],
  },
  {
    id: "ex-auth",
    name: "with-auth.tsx",
    path: "examples/with-auth.tsx",
    category: "examples",
    description: "Example with authentication integration",
    lines: 50,
    imports: [],
    usedBy: [],
  },
  {
    id: "ex-custom",
    name: "custom-integration.tsx",
    path: "examples/custom-integration.tsx",
    category: "examples",
    description: "Example with custom backend integration",
    lines: 60,
    imports: [],
    usedBy: [],
  },

  // ============================================
  // ROOT FILES
  // ============================================
  {
    id: "root-app",
    name: "App.tsx",
    path: "src/App.tsx",
    category: "config",
    description: "Root application component with providers",
    lines: 35,
    imports: ["ThemeProvider", "AuthContext", "AnimatedRoutes", "QueryClient"],
    usedBy: ["main.tsx"],
  },
  {
    id: "root-main",
    name: "main.tsx",
    path: "src/main.tsx",
    category: "config",
    description: "Application entry point",
    lines: 15,
    imports: ["App"],
    usedBy: [],
  },
  {
    id: "root-index-css",
    name: "index.css",
    path: "src/index.css",
    category: "config",
    description: "Global CSS with Tailwind imports and CSS variables",
    lines: 120,
    imports: [],
    usedBy: ["main.tsx"],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getCategoryLabel = (category: FileCategory): string => {
  const labels: Record<FileCategory, string> = {
    pages: "Pages",
    "components-common": "Common Components",
    "components-landing": "Landing Page",
    "components-feedback": "Feedback (User)",
    "components-admin": "Feedback (Admin)",
    "components-setup": "Setup",
    "components-tiers": "Tier Comparison",
    "components-download": "Download Template",
    "components-auth": "Authentication",
    "components-testing": "Testing",
    "components-codemap": "Code Map",
    "components-ui": "UI Components",
    hooks: "Hooks",
    contexts: "Contexts",
    lib: "Libraries",
    integrations: "Integrations",
    "edge-functions": "Edge Functions",
    config: "Configuration",
    types: "Types",
    examples: "Examples",
  };
  return labels[category];
};

export const getCategoryColor = (category: FileCategory): string => {
  const colors: Record<FileCategory, string> = {
    pages: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "components-common": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "components-landing": "bg-pink-500/20 text-pink-400 border-pink-500/30",
    "components-feedback": "bg-green-500/20 text-green-400 border-green-500/30",
    "components-admin": "bg-orange-500/20 text-orange-400 border-orange-500/30",
    "components-setup": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    "components-tiers": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "components-download": "bg-red-500/20 text-red-400 border-red-500/30",
    "components-auth": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    "components-testing": "bg-teal-500/20 text-teal-400 border-teal-500/30",
    "components-codemap": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "components-ui": "bg-slate-500/20 text-slate-400 border-slate-500/30",
    hooks: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    contexts: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
    lib: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    integrations: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "edge-functions": "bg-rose-500/20 text-rose-400 border-rose-500/30",
    config: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    types: "bg-sky-500/20 text-sky-400 border-sky-500/30",
    examples: "bg-lime-500/20 text-lime-400 border-lime-500/30",
  };
  return colors[category];
};

export const getFilesByCategory = (category: FileCategory): FileEntry[] => {
  return fileRegistry.filter((file) => file.category === category);
};

export const getAllCategories = (): FileCategory[] => {
  return [...new Set(fileRegistry.map((file) => file.category))];
};

export const searchFiles = (query: string): FileEntry[] => {
  const lowerQuery = query.toLowerCase();
  return fileRegistry.filter(
    (file) =>
      file.name.toLowerCase().includes(lowerQuery) ||
      file.description.toLowerCase().includes(lowerQuery) ||
      file.path.toLowerCase().includes(lowerQuery)
  );
};

export const getFileById = (id: string): FileEntry | undefined => {
  return fileRegistry.find((file) => file.id === id);
};

export const getTotalLines = (): number => {
  return fileRegistry.reduce((sum, file) => sum + file.lines, 0);
};

export const getStats = () => {
  const categories = getAllCategories();
  return {
    totalFiles: fileRegistry.length,
    totalLines: getTotalLines(),
    categoryCounts: categories.map((cat) => ({
      category: cat,
      label: getCategoryLabel(cat),
      count: getFilesByCategory(cat).length,
      lines: getFilesByCategory(cat).reduce((sum, f) => sum + f.lines, 0),
    })),
  };
};
