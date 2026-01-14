/**
 * Audit Tasks Registry
 * 28 tasks across 7 phases for implementing the Feedback Widget
 */

export interface AuditTask {
  id: string;
  title: string;
  description: string;
  prompt: string;
  phase: number;
  order: number;
}

export interface AuditPhase {
  id: number;
  title: string;
  description: string;
  tasks: AuditTask[];
}

export const auditTasks: AuditTask[] = [
  // Phase 1: Database Setup
  {
    id: "db-feedback-table",
    title: "Create Feedback Table",
    description: "Create the main feedback table with all required columns",
    prompt: `Create a feedback table with: id (UUID primary key), user_id (UUID nullable), raw_text (TEXT not null), category (TEXT), severity (TEXT), page_url (TEXT), target_element (JSONB), device_type (TEXT), status (TEXT default 'pending'), context (JSONB), ai_summary (TEXT), ai_category (TEXT), ai_question_for_dev (TEXT), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ). Add appropriate indexes for status, created_at, and user_id.`,
    phase: 1,
    order: 1,
  },
  {
    id: "db-admin-table",
    title: "Create Admin Users Table",
    description: "Create table to track admin users",
    prompt: `Create an admin_users table with: id (UUID primary key), user_id (UUID not null unique), created_at (TIMESTAMPTZ). Add a unique constraint on user_id.`,
    phase: 1,
    order: 2,
  },
  {
    id: "db-is-admin-function",
    title: "Create is_admin() Function",
    description: "Database function to check if current user is admin",
    prompt: `Create a SECURITY DEFINER function called is_admin() that returns BOOLEAN. It should check if auth.uid() exists in the admin_users table. Set search_path to 'public' for security.`,
    phase: 1,
    order: 3,
  },
  {
    id: "db-updated-at-trigger",
    title: "Create Updated Timestamp Trigger",
    description: "Auto-update updated_at on feedback changes",
    prompt: `Create a trigger function feedback_update_timestamp() that sets NEW.updated_at = now(). Create a trigger set_feedback_updated_at that runs BEFORE UPDATE on the feedback table.`,
    phase: 1,
    order: 4,
  },

  // Phase 2: Security & RLS
  {
    id: "rls-enable",
    title: "Enable RLS on Tables",
    description: "Enable Row Level Security on all tables",
    prompt: `Enable Row Level Security (RLS) on both the feedback and admin_users tables using ALTER TABLE ... ENABLE ROW LEVEL SECURITY.`,
    phase: 2,
    order: 1,
  },
  {
    id: "rls-feedback-insert",
    title: "Feedback Insert Policy",
    description: "Allow anyone to insert feedback",
    prompt: `Create an RLS policy "Anyone can submit feedback" on feedback FOR INSERT WITH CHECK (true). This allows anonymous feedback submission.`,
    phase: 2,
    order: 2,
  },
  {
    id: "rls-feedback-select",
    title: "Feedback Select Policy",
    description: "Only admins can view all feedback",
    prompt: `Create an RLS policy "Admins can view all feedback" on feedback FOR SELECT USING (is_admin()). This restricts feedback viewing to admin users only.`,
    phase: 2,
    order: 3,
  },
  {
    id: "rls-admin-policies",
    title: "Admin Users Policies",
    description: "Secure the admin_users table",
    prompt: `Create RLS policies on admin_users: 1) "Admins can view admin list" FOR SELECT USING (is_admin()), 2) "Only admins can manage admins" FOR ALL USING (is_admin()). This prevents non-admins from seeing or modifying the admin list.`,
    phase: 2,
    order: 4,
  },

  // Phase 3: Edge Functions
  {
    id: "edge-submit-feedback",
    title: "Basic Submit Feedback Function",
    description: "Edge function for submitting feedback without AI",
    prompt: `Create supabase/functions/submit-feedback/index.ts that: 1) Handles CORS with an allowlist (not wildcard), 2) Validates raw_text is at least 5 characters, 3) Inserts into feedback table with status 'pending', 4) Returns the new feedback ID. Use verify_jwt = false in config.toml.`,
    phase: 3,
    order: 1,
  },
  {
    id: "edge-submit-feedback-ai",
    title: "AI-Enhanced Submit Function",
    description: "Edge function with AI categorization and summarization",
    prompt: `Create supabase/functions/submit-feedback-ai/index.ts that: 1) Does everything submit-feedback does, 2) Calls Lovable AI Gateway to generate ai_summary, ai_category, and ai_question_for_dev, 3) Has graceful fallback if AI is unavailable, 4) Uses rate limiting. Set verify_jwt = false in config.toml.`,
    phase: 3,
    order: 2,
  },
  {
    id: "edge-health-check",
    title: "Health Check Function",
    description: "Edge function for monitoring service status",
    prompt: `Create supabase/functions/health-check/index.ts that: 1) Checks database connectivity, 2) Checks AI service availability, 3) Returns JSON with status for each service. Use CORS allowlist, not wildcard.`,
    phase: 3,
    order: 3,
  },
  {
    id: "edge-config-toml",
    title: "Configure Edge Functions",
    description: "Update supabase/config.toml for all functions",
    prompt: `Update supabase/config.toml to include all three edge functions (submit-feedback, submit-feedback-ai, health-check) with verify_jwt = false for each since we handle auth ourselves.`,
    phase: 3,
    order: 4,
  },

  // Phase 4: Frontend Components
  {
    id: "fe-feedback-button",
    title: "Feedback Button Component",
    description: "Floating action button to trigger feedback form",
    prompt: `Create src/feedback/components/user/FeedbackButton.tsx with: configurable position (corner), tier-based styling, click handler to open FeedbackForm. Use framer-motion for animations.`,
    phase: 4,
    order: 1,
  },
  {
    id: "fe-feedback-form",
    title: "Feedback Form Component",
    description: "Modal form for users to submit feedback",
    prompt: `Create src/feedback/components/user/FeedbackForm.tsx with: text input (required), optional category select, optional severity select, screenshot capture (Pro tier), element picker (Standard+ tier). Use react-hook-form for validation.`,
    phase: 4,
    order: 2,
  },
  {
    id: "fe-element-picker",
    title: "Element Picker Component",
    description: "UI for selecting page elements to report",
    prompt: `Create src/feedback/components/user/ElementPicker.tsx that: overlays the page, highlights elements on hover, captures element info (tag, classes, text) on click, returns the target_element data.`,
    phase: 4,
    order: 3,
  },
  {
    id: "fe-quick-start",
    title: "QuickStart Integration Component",
    description: "Easy drop-in component for integrating feedback",
    prompt: `Create src/feedback/QuickStart.tsx that: accepts tier prop ('basic'|'standard'|'pro'), configures features based on tier, renders FeedbackButton with correct settings. Export from src/feedback/index.ts.`,
    phase: 4,
    order: 4,
  },

  // Phase 5: Admin Dashboard
  {
    id: "admin-dashboard",
    title: "Feedback Dashboard",
    description: "Main admin dashboard component",
    prompt: `Create src/feedback/components/admin/FeedbackDashboard.tsx that: shows stats at top (total, pending, reviewed), has filter controls (status, category, date range), renders FeedbackList below.`,
    phase: 5,
    order: 1,
  },
  {
    id: "admin-list",
    title: "Feedback List Component",
    description: "Paginated list of feedback items",
    prompt: `Create src/feedback/components/admin/FeedbackList.tsx that: fetches feedback with pagination, shows summary cards for each item, handles loading/error states, supports clicking to view details.`,
    phase: 5,
    order: 2,
  },
  {
    id: "admin-detail",
    title: "Feedback Detail View",
    description: "Detailed view of a single feedback item",
    prompt: `Create src/feedback/components/admin/FeedbackDetail.tsx that: shows full feedback text, AI analysis (summary, category, question), status controls, page URL and element info, timestamps.`,
    phase: 5,
    order: 3,
  },
  {
    id: "admin-stats",
    title: "Feedback Stats Component",
    description: "Analytics cards for the dashboard",
    prompt: `Create src/feedback/components/admin/FeedbackStats.tsx that: calculates counts by status, shows trend indicators, displays category breakdown chart. Use recharts for visualization.`,
    phase: 5,
    order: 4,
  },

  // Phase 6: Authentication
  {
    id: "auth-context",
    title: "Auth Context Provider",
    description: "React context for authentication state",
    prompt: `Create src/contexts/AuthContext.tsx with: user state, session state, isAdmin state, signIn/signUp/signOut methods. Use Supabase auth and call is_admin() RPC to check admin status.`,
    phase: 6,
    order: 1,
  },
  {
    id: "auth-admin-guard",
    title: "Admin Guard Component",
    description: "Route protection for admin pages",
    prompt: `Create src/components/auth/AdminGuard.tsx that: checks isAdmin from AuthContext, shows loading state while checking, redirects to login if not admin, renders children if admin.`,
    phase: 6,
    order: 2,
  },
  {
    id: "auth-login-page",
    title: "Login Page",
    description: "User login form page",
    prompt: `Create src/pages/Login.tsx with: email/password form, validation, error handling, redirect to admin on success. Style with glassmorphism design.`,
    phase: 6,
    order: 3,
  },
  {
    id: "auth-signup-page",
    title: "Signup Page",
    description: "User registration form page",
    prompt: `Create src/pages/Signup.tsx with: email/password/confirm form, validation, auto-confirm email (non-production), redirect to login on success. Use same styling as Login.`,
    phase: 6,
    order: 4,
  },

  // Phase 7: Polish & Testing
  {
    id: "polish-design-system",
    title: "Design System Setup",
    description: "Configure colors, gradients, and animations",
    prompt: `Update src/index.css with: CSS variables for light/dark themes, gradient definitions (--gradient-primary, --gradient-hero), glassmorphism classes (.glass-card), animation keyframes. Update tailwind.config.ts to use these tokens.`,
    phase: 7,
    order: 1,
  },
  {
    id: "polish-responsive",
    title: "Responsive Design",
    description: "Ensure mobile-friendly layouts",
    prompt: `Review all components for responsive design. Add mobile-specific styles using Tailwind breakpoints (sm:, md:, lg:). Ensure feedback button is accessible on mobile, forms are touch-friendly.`,
    phase: 7,
    order: 2,
  },
  {
    id: "test-feedback-flow",
    title: "Test Feedback Submission",
    description: "Verify end-to-end feedback flow",
    prompt: `Test the complete feedback flow: 1) Click feedback button, 2) Fill out form, 3) Submit and verify it appears in admin dashboard, 4) Check AI fields are populated if using AI endpoint. Fix any issues found.`,
    phase: 7,
    order: 3,
  },
  {
    id: "test-admin-flow",
    title: "Test Admin Dashboard",
    description: "Verify admin features work correctly",
    prompt: `Test admin dashboard: 1) Login as admin, 2) View feedback list, 3) Filter by status/category, 4) View feedback details, 5) Update status. Verify RLS policies work correctly.`,
    phase: 7,
    order: 4,
  },
];

export const auditPhases: AuditPhase[] = [
  {
    id: 1,
    title: "Database Setup",
    description: "Create tables, functions, and triggers",
    tasks: auditTasks.filter((t) => t.phase === 1),
  },
  {
    id: 2,
    title: "Security & RLS",
    description: "Configure Row Level Security policies",
    tasks: auditTasks.filter((t) => t.phase === 2),
  },
  {
    id: 3,
    title: "Edge Functions",
    description: "Create Supabase Edge Functions",
    tasks: auditTasks.filter((t) => t.phase === 3),
  },
  {
    id: 4,
    title: "Frontend Components",
    description: "Build user-facing feedback components",
    tasks: auditTasks.filter((t) => t.phase === 4),
  },
  {
    id: 5,
    title: "Admin Dashboard",
    description: "Create admin interface for managing feedback",
    tasks: auditTasks.filter((t) => t.phase === 5),
  },
  {
    id: 6,
    title: "Authentication",
    description: "Set up auth context and admin guards",
    tasks: auditTasks.filter((t) => t.phase === 6),
  },
  {
    id: 7,
    title: "Polish & Testing",
    description: "Design system, responsiveness, and verification",
    tasks: auditTasks.filter((t) => t.phase === 7),
  },
];

export function getTaskById(id: string): AuditTask | undefined {
  return auditTasks.find((t) => t.id === id);
}

export function getPhaseProgress(
  phaseId: number,
  completedTasks: string[]
): { completed: number; total: number; percentage: number } {
  const phaseTasks = auditTasks.filter((t) => t.phase === phaseId);
  const completed = phaseTasks.filter((t) => completedTasks.includes(t.id)).length;
  return {
    completed,
    total: phaseTasks.length,
    percentage: Math.round((completed / phaseTasks.length) * 100),
  };
}

export function getTotalProgress(completedTasks: string[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  const completed = completedTasks.length;
  return {
    completed,
    total: auditTasks.length,
    percentage: Math.round((completed / auditTasks.length) * 100),
  };
}
