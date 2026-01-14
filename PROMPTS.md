# 🚀 Feedback Widget Template - Complete Prompt System

> **Copy any prompt below to implement the Feedback Widget Template in your Lovable project.**

---

## 📋 Table of Contents

| # | Prompt | Purpose |
|---|--------|---------|
| [1](#prompt-1-database-setup) | Database Setup | Tables, indexes, functions, triggers |
| [2](#prompt-2-security--rls-policies) | Security & RLS | Row Level Security policies |
| [3](#prompt-3-edge-functions) | Edge Functions | Backend API endpoints |
| [4](#prompt-4-frontend-components) | Frontend Components | UI components and hooks |
| [5](#prompt-5-admin-dashboard--auth) | Admin Dashboard & Auth | Authentication and admin area |
| [6](#prompt-6-design-system--styling) | Design System | Modern styling and animations |
| [7](#prompt-7-verification--testing) | Verification | Test everything works |
| [8](#prompt-8-bootstrap-first-admin) | Bootstrap Admin | Make yourself an admin |
| [9](#prompt-9-ai-semantic-code-search) | AI Semantic Code Search | Natural language code search |
| [🎯](#-master-prompt-all-in-one) | **MASTER PROMPT** | **Complete setup in one prompt** |

---

## Prompt 1: Database Setup

```
Set up the Feedback Widget database with these tables:

1. CREATE FEEDBACK TABLE:
- id (UUID, primary key, auto-generated)
- raw_text (TEXT, required - the user's feedback)
- category (TEXT - bug, feature, ui_ux, suggestion, other)
- severity (TEXT - low, medium, high, critical)
- page_url (TEXT - captured automatically)
- target_element (JSONB - element selector and details)
- context (JSONB - browser info, timestamp)
- device_type (TEXT - desktop, mobile, tablet)
- user_id (UUID, nullable - for authenticated users)
- status (TEXT, default 'pending' - pending, in_progress, resolved, dismissed)
- ai_summary (TEXT - AI-generated summary, Pro tier)
- ai_category (TEXT - AI-detected category, Pro tier)
- ai_question_for_dev (TEXT - AI prompt for developers, Pro tier)
- created_at (TIMESTAMP WITH TIME ZONE, default now())
- updated_at (TIMESTAMP WITH TIME ZONE, default now())

2. CREATE ADMIN_USERS TABLE:
- id (UUID, primary key, auto-generated)
- user_id (UUID, unique, required - references auth user)
- created_at (TIMESTAMP WITH TIME ZONE, default now())

3. ADD PERFORMANCE INDEXES:
- idx_feedback_status ON feedback(status)
- idx_feedback_created_at ON feedback(created_at DESC)
- idx_feedback_user_id ON feedback(user_id)
- idx_feedback_status_created ON feedback(status, created_at DESC)

4. CREATE HELPER FUNCTION:
- is_admin() function that returns true if current user is in admin_users table
- Must be SECURITY DEFINER with search_path set to 'public'

5. CREATE UPDATE TRIGGER:
- feedback_update_timestamp trigger to auto-update updated_at column on any UPDATE
```

---

## Prompt 2: Security & RLS Policies

```
Set up Row Level Security (RLS) for the Feedback Widget:

1. ENABLE RLS on both tables:
- ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY
- ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY

2. FEEDBACK TABLE POLICIES:

INSERT Policy - "Anyone can submit feedback":
- Allow INSERT for all users (authenticated and anonymous)
- No restrictions on WITH CHECK

SELECT Policies:
- "Users can view own feedback" - WHERE user_id = auth.uid()
- "Admins can view all feedback" - USING is_admin()

UPDATE Policy:
- "Admins can update feedback status" - USING is_admin()

DELETE Policy:
- "Admins can delete feedback" - USING is_admin()

3. ADMIN_USERS TABLE POLICIES:

All operations (SELECT, INSERT, UPDATE, DELETE):
- Only allow when is_admin() returns true
- This prevents non-admins from seeing or modifying the admin list

4. SECURITY REQUIREMENTS:
- is_admin() function must be SECURITY DEFINER
- All functions should SET search_path TO 'public'
- No direct access to auth schema tables from client
```

---

## Prompt 3: Edge Functions

```
Create three edge functions for the Feedback Widget:

1. SUBMIT-FEEDBACK (Basic endpoint):
Location: supabase/functions/submit-feedback/index.ts

Requirements:
- Accept POST requests only
- Validate raw_text exists and is at least 5 characters
- Sanitize input: trim whitespace, limit to 5000 characters
- Extract optional fields: category, severity, page_url, target_element, context, device_type
- Insert into feedback table with status 'pending'
- Use SUPABASE_SERVICE_ROLE_KEY for database access
- CORS headers for your allowed origins (not wildcard)
- Return JSON: { success: true, id: feedback_id }
- Handle errors gracefully with appropriate HTTP status codes

2. SUBMIT-FEEDBACK-AI (Pro tier endpoint):
Location: supabase/functions/submit-feedback-ai/index.ts

Requirements:
- All features from basic endpoint PLUS:
- Rate limiting: 10 submissions per hour per session fingerprint
- Send feedback text to Lovable AI API for analysis
- Request: ai_summary, ai_category, ai_question_for_dev
- Demo mode: Return sample AI responses when API unavailable
- Graceful degradation: If AI fails, still save feedback without AI fields
- Timeout: 30 seconds for AI request
- Log errors but don't expose to client

3. HEALTH-CHECK (Verification endpoint):
Location: supabase/functions/health-check/index.ts

Requirements:
- Accept GET requests
- Check database connectivity (simple query)
- Check if LOVABLE_API_KEY exists (AI availability)
- Return JSON: { database: "ok"|"error", ai: "ok"|"unavailable", timestamp: ISO string }
- CORS headers with allowed origins list (NOT wildcard *)
- Used for monitoring and setup verification
```

---

## Prompt 4: Frontend Components

```
Create the Feedback Widget frontend components:

1. DIRECTORY STRUCTURE:
src/feedback/
├── index.ts                    # Main exports
├── QuickStart.tsx              # Drop-in widget component
├── types/
│   └── feedback.ts             # TypeScript interfaces
├── config/
│   └── feedback.config.ts      # Tier presets and configuration
├── hooks/
│   └── useFeedback.ts          # Data fetching, submission, filtering hooks
└── components/
    ├── user/
    │   ├── FeedbackButton.tsx  # Floating trigger button
    │   ├── FeedbackForm.tsx    # Submission form with categories
    │   └── ElementPicker.tsx   # Visual element selector overlay
    └── admin/
        ├── FeedbackDashboard.tsx  # Main admin interface
        ├── FeedbackList.tsx       # Sortable feedback list
        ├── FeedbackDetail.tsx     # Single item detail view
        └── FeedbackStats.tsx      # Statistics cards

2. QUICKSTART COMPONENT (src/feedback/QuickStart.tsx):
Props:
- appName: string (your app name for branding)
- position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
- enableAI: boolean (use Pro tier AI features)
- showElementPicker: boolean (allow targeting specific elements)
- buttonColor: string (custom button color)
- onSubmit: (data) => void (callback after submission)
- onError: (error) => void (callback on error)

Usage: Just add <FeedbackWidget appName="My App" /> to your app

3. TIER PRESETS (src/feedback/config/feedback.config.ts):

BASIC_PRESET:
- Element picker: enabled
- Categories: enabled (bug, feature, ui_ux, suggestion, other)
- Severity levels: disabled
- Anonymous submission: enabled
- AI features: disabled
- Admin features: disabled

STANDARD_PRESET:
- All Basic features PLUS:
- Severity levels: enabled (low, medium, high, critical)
- Admin dashboard: enabled
- Statistics: enabled
- Export: enabled
- Status updates: enabled

PRO_PRESET:
- All Standard features PLUS:
- AI summarization: enabled
- AI categorization: enabled
- AI developer prompts: enabled

4. HOOKS (src/feedback/hooks/useFeedback.ts):

useFeedback():
- items: FeedbackItem[] (all feedback)
- isLoading: boolean
- error: Error | null
- submit: (data) => Promise<void>
- updateStatus: (id, status) => Promise<void>
- refresh: () => void

useFeedbackStats(items):
- totalCount, byCategory, bySeverity, byStatus, recentTrend

useFeedbackFilters(items):
- filteredItems, filters, setCategory, setSeverity, setStatus, setSearch
```

---

## Prompt 5: Admin Dashboard & Auth

```
Set up admin authentication and dashboard:

1. AUTH CONTEXT (src/contexts/AuthContext.tsx):
Provide:
- user: User | null (current authenticated user)
- session: Session | null (current session)
- isLoading: boolean (auth state loading)
- isAdmin: boolean (is user in admin_users table)
- signUp: (email, password) => Promise<void>
- signIn: (email, password) => Promise<void>
- signOut: () => Promise<void>

Implementation:
- Listen to onAuthStateChange for session updates
- Check admin_users table when user changes
- Persist across page refreshes
- Handle loading states properly

2. ADMIN GUARD (src/components/auth/AdminGuard.tsx):
Props:
- children: React.ReactNode
- fallback?: React.ReactNode (shown to non-admins)

Behavior:
- If loading: show spinner
- If not authenticated: redirect to /login
- If authenticated but not admin: show access denied or redirect
- If admin: render children

3. USEADMIN HOOK (src/hooks/useAdmin.ts):
Returns:
- isAdmin: boolean
- isLoading: boolean
- error: Error | null
- refresh: () => void

Implementation:
- Query admin_users table for current user
- Cache result to minimize queries
- Subscribe to realtime changes (optional)

4. ROUTES:

/login:
- Email and password form
- Link to /signup
- Redirect to / on success

/signup:
- Email and password form
- Link to /login
- Auto-confirm enabled (no email verification)
- Redirect to / on success

/admin:
- Protected by AdminGuard
- Renders FeedbackDashboard
- Full admin features enabled

5. ADMIN DASHBOARD FEATURES:
- View all feedback in sortable list
- Filter by category, severity, status
- Search by text content
- View detailed feedback with AI analysis (Pro)
- Update status (pending → in_progress → resolved → dismissed)
- Copy feedback to clipboard
- Export as JSON
- Statistics overview cards
```

---

## Prompt 6: Design System & Styling

```
Apply modern design system to the Feedback Widget:

1. COLOR PALETTE (CSS Variables in index.css):

:root (Light mode):
--background: 0 0% 100%
--foreground: 240 10% 4%
--primary: 250 90% 60%
--primary-foreground: 0 0% 100%
--secondary: 240 5% 96%
--muted: 240 5% 96%
--accent: 240 5% 90%
--destructive: 0 84% 60%

.dark (Dark mode):
--background: 240 10% 4%
--foreground: 0 0% 98%
--primary: 250 90% 65%
--muted: 240 4% 16%

2. GRADIENT EFFECTS:

Primary gradient: from primary (purple) to accent (blue)
Background mesh: Animated radial gradients with blur
Glass borders: Linear gradient with transparency

CSS Classes:
.gradient-mesh - Animated background gradient
.gradient-border - Border with gradient effect
.gradient-text - Text with gradient fill

3. GLASSMORPHISM:

.glass - Basic glass effect
  background: hsl(var(--background) / 0.8)
  backdrop-filter: blur(12px)
  border: 1px solid hsl(var(--foreground) / 0.1)

.glass-premium - Enhanced glass
  background: hsl(var(--background) / 0.6)
  backdrop-filter: blur(20px)
  border: 1px solid hsl(var(--foreground) / 0.15)
  box-shadow: 0 8px 32px hsl(var(--primary) / 0.1)

4. ANIMATIONS (Framer Motion):

Button hover:
- scale: 1.02
- Add subtle glow shadow
- Transition: 0.2s ease

Form entrance:
- Initial: opacity 0, y: 20
- Animate: opacity 1, y: 0
- Transition: 0.3s ease-out

Element picker highlight:
- Pulsing border animation
- 2px dashed primary color
- Animation: pulse 1.5s infinite

List items:
- Stagger children by 0.05s
- Fade in from opacity 0
- Slight y translation

5. MICRO-INTERACTIONS:

.hover-lift:
  transition: transform 0.2s, box-shadow 0.2s
  &:hover:
    transform: translateY(-2px)
    box-shadow: 0 4px 12px hsl(var(--primary) / 0.15)

.icon-bounce:
  &:hover svg:
    animation: bounce 0.5s ease

Success animation:
- Checkmark draws in with SVG stroke animation
- Green glow effect
- Scale up then settle

6. RESPONSIVE BREAKPOINTS:
- sm: 640px
- md: 768px  
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

Mobile optimizations:
- Touch targets minimum 44px
- Increased spacing on small screens
- Collapsible panels
- Bottom sheet for forms on mobile
```

---

## Prompt 7: Verification & Testing

```
Run complete verification of the Feedback Widget:

1. BUILD VERIFICATION:
- Run: npm run build
- Check for TypeScript errors (should be 0)
- Check for ESLint warnings
- Verify bundle size is reasonable

2. ROUTE TESTING (visit each, check for errors):

/ - Home page loads, FeedbackWidget visible
/demo - Demo page with widget works
/admin - Redirects to login if not authenticated
/admin - Shows dashboard if authenticated as admin
/setup - Setup guide page loads
/login - Login form works
/signup - Signup form works
/install - Installation guide loads
/codemap - Code map visualization works

3. FEEDBACK SUBMISSION TESTING:

Anonymous submission:
- Open widget (not logged in)
- Enter feedback text (min 5 chars)
- Select category
- Submit
- Should see success message
- Check database - new row with user_id = null

Authenticated submission:
- Log in first
- Submit feedback
- Check database - new row with your user_id

Element picker:
- Enable element picker
- Hover over page elements
- Click to select
- Should capture CSS selector
- Submit and verify target_element saved

4. ADMIN FEATURES TESTING:

View feedback:
- Log in as admin
- Go to /admin
- Should see list of all feedback

Update status:
- Click on a feedback item
- Change status from pending to in_progress
- Should update immediately
- Refresh and verify persisted

Statistics:
- Stats cards should show correct counts
- By category, by severity, by status

Export:
- Click export button
- Should download JSON file
- Verify JSON contains feedback data

5. EDGE FUNCTION TESTING:

Test submit-feedback:
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/submit-feedback \
  -H "Content-Type: application/json" \
  -d '{"raw_text": "Test feedback from curl"}'
  
Expected: { "success": true, "id": "uuid" }

Test submit-feedback-ai:
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/submit-feedback-ai \
  -H "Content-Type: application/json" \
  -d '{"raw_text": "The login button is not visible on mobile"}'
  
Expected: { "success": true, "id": "uuid", "ai_summary": "...", ... }

Test health-check:
curl https://YOUR_PROJECT.supabase.co/functions/v1/health-check

Expected: { "database": "ok", "ai": "ok", "timestamp": "..." }

6. RESPONSIVE TESTING:

320px (small mobile):
- Widget button visible and tappable
- Form fits screen width
- No horizontal scroll

768px (tablet):
- Two-column layout where appropriate
- Adequate touch targets

1024px (desktop):
- Full layout visible
- Sidebar navigation if applicable

1440px+ (large screen):
- Content centered or max-width
- No stretched layouts

7. DARK MODE TESTING:
- Toggle theme (if theme toggle exists)
- All components should adapt
- Check contrast is readable
- No white flashes on load
```

---

## Prompt 8: Bootstrap First Admin

```
I've signed up for my app and need to make myself an admin. Help me:

1. VERIFY I'M LOGGED IN:
- Confirm I have an active session
- Show me my user ID

2. ADD ME TO ADMIN_USERS:
- Insert my user_id into the admin_users table
- Verify the insert succeeded

3. VERIFY ADMIN ACCESS:
- Check that is_admin() now returns true for me
- Confirm I can access /admin

4. TROUBLESHOOTING (if needed):
- If I get "permission denied": Check RLS policies exist
- If is_admin() returns false: Verify user_id matches exactly
- If table doesn't exist: Run database setup first

After this, I should be able to:
- Access /admin without access denied
- See all feedback in the dashboard
- Update feedback status
- Export feedback data
```

---

## Prompt 9: AI Semantic Code Search

```
Implement AI-powered semantic code search for the Code Map page:

1. CREATE EDGE FUNCTION (supabase/functions/semantic-code-search/index.ts):
   - Accept POST with { query: string, files: FileEntry[] }
   - Use Lovable AI Gateway (google/gemini-2.5-flash model)
   - Return top 10 files with: { id, relevanceScore (0-100), matchReason }
   - Include CORS headers for allowed origins
   - Handle rate limiting gracefully

2. CREATE REACT HOOK (src/hooks/useSemanticSearch.ts):
   - State: results, isSearching, error
   - search(query) - calls edge function with file registry
   - clearResults() - resets state
   - Map AI results to FileEntry objects

3. CREATE SEARCH BAR (src/components/codemap/AISearchBar.tsx):
   - Dual-mode: Basic (instant filter) + AI (semantic)
   - Admin-only AI mode toggle
   - Debounced basic search (200ms)
   - Enter key triggers AI search
   - Voice input via VoiceSearchButton (optional)

4. INTEGRATE INTO CODEMAP (src/pages/CodeMap.tsx):
   - Show relevance scores as badges
   - Display AI match reasons
   - Sparkles icon for AI results
   - Fallback to basic for non-admins
```

---

## 🎯 MASTER PROMPT (All-in-One)

> **Copy this single prompt to set up everything at once:**

```
I want to implement the complete Feedback Widget Template for my app. Please execute all phases:

═══════════════════════════════════════════════════════════════════════════════
PHASE 1: DATABASE SETUP
═══════════════════════════════════════════════════════════════════════════════

Create the database schema:

FEEDBACK TABLE (14 columns):
- id: UUID, primary key, default gen_random_uuid()
- raw_text: TEXT, NOT NULL (user's feedback)
- category: TEXT (bug, feature, ui_ux, suggestion, other)
- severity: TEXT (low, medium, high, critical)
- page_url: TEXT
- target_element: JSONB
- context: JSONB
- device_type: TEXT
- user_id: UUID (nullable, for authenticated users)
- status: TEXT, default 'pending'
- ai_summary: TEXT (Pro tier)
- ai_category: TEXT (Pro tier)
- ai_question_for_dev: TEXT (Pro tier)
- created_at: TIMESTAMPTZ, default now()
- updated_at: TIMESTAMPTZ, default now()

ADMIN_USERS TABLE (3 columns):
- id: UUID, primary key, default gen_random_uuid()
- user_id: UUID, UNIQUE, NOT NULL
- created_at: TIMESTAMPTZ, default now()

INDEXES (4 total):
- idx_feedback_status ON feedback(status)
- idx_feedback_created_at ON feedback(created_at DESC)
- idx_feedback_user_id ON feedback(user_id) WHERE user_id IS NOT NULL
- idx_feedback_status_created ON feedback(status, created_at DESC)

FUNCTIONS:
- is_admin(): Returns true if auth.uid() is in admin_users, SECURITY DEFINER

TRIGGERS:
- set_feedback_updated_at: Updates updated_at on feedback changes

═══════════════════════════════════════════════════════════════════════════════
PHASE 2: ROW LEVEL SECURITY
═══════════════════════════════════════════════════════════════════════════════

Enable RLS on both tables, then create policies:

FEEDBACK POLICIES:
1. "Anyone can submit feedback" - INSERT for all
2. "Users can view own feedback" - SELECT where user_id = auth.uid()
3. "Admins can view all feedback" - SELECT using is_admin()
4. "Admins can update feedback" - UPDATE using is_admin()
5. "Admins can delete feedback" - DELETE using is_admin()

ADMIN_USERS POLICIES:
1. "Admins can view admin list" - SELECT using is_admin()
2. "Admins can add admins" - INSERT using is_admin()
3. "Admins can update admins" - UPDATE using is_admin()
4. "Admins can remove admins" - DELETE using is_admin()

═══════════════════════════════════════════════════════════════════════════════
PHASE 3: EDGE FUNCTIONS
═══════════════════════════════════════════════════════════════════════════════

Create three edge functions:

1. supabase/functions/submit-feedback/index.ts
   - POST only, validate raw_text (min 5 chars)
   - Sanitize input (max 5000 chars)
   - Insert to database, return { success, id }
   - Proper CORS with allowed origins

2. supabase/functions/submit-feedback-ai/index.ts
   - All basic features PLUS:
   - Rate limiting (10/hour per session)
   - AI enhancement via Lovable AI
   - Demo mode fallback
   - Graceful degradation on AI errors

3. supabase/functions/health-check/index.ts
   - GET request, check database and AI
   - Return { database, ai, timestamp }
   - CORS with allowed origins (not wildcard)

═══════════════════════════════════════════════════════════════════════════════
PHASE 4: FRONTEND COMPONENTS
═══════════════════════════════════════════════════════════════════════════════

Create src/feedback/ directory with:

FILES TO CREATE:
- index.ts (exports)
- QuickStart.tsx (drop-in widget)
- types/feedback.ts (TypeScript types)
- config/feedback.config.ts (tier presets)
- hooks/useFeedback.ts (data hooks)
- components/user/FeedbackButton.tsx
- components/user/FeedbackForm.tsx
- components/user/ElementPicker.tsx
- components/admin/FeedbackDashboard.tsx
- components/admin/FeedbackList.tsx
- components/admin/FeedbackDetail.tsx
- components/admin/FeedbackStats.tsx

TIER PRESETS:
- Basic: element picker, categories, anonymous
- Standard: + severity, admin dashboard, export
- Pro: + AI summarization, categorization, dev prompts

═══════════════════════════════════════════════════════════════════════════════
PHASE 5: AUTHENTICATION
═══════════════════════════════════════════════════════════════════════════════

Set up auth system:

- AuthContext with user, session, isAdmin, signUp, signIn, signOut
- AdminGuard component for protected routes
- useAdmin hook to check admin status
- /login page with email/password form
- /signup page with registration form
- /admin page protected by AdminGuard
- Enable auto-confirm for email signups

═══════════════════════════════════════════════════════════════════════════════
PHASE 6: DESIGN SYSTEM
═══════════════════════════════════════════════════════════════════════════════

Apply modern styling:

COLORS:
- Primary: Purple gradient (hsl 250)
- Dark theme with proper contrast
- Light mode support

EFFECTS:
- Glassmorphism (backdrop-blur, translucent backgrounds)
- Gradient borders and text
- Animated mesh backgrounds

ANIMATIONS:
- Button hover: scale + glow
- Form entrance: slide up + fade
- Element picker: pulsing highlight
- List items: staggered fade in

RESPONSIVE:
- Mobile-first approach
- Touch-friendly (44px targets)
- Breakpoints: 640, 768, 1024, 1280px

═══════════════════════════════════════════════════════════════════════════════
PHASE 7: VERIFICATION
═══════════════════════════════════════════════════════════════════════════════

After implementation, verify:

BUILD:
- No TypeScript errors
- No missing imports
- Bundle builds successfully

ROUTES (all load without error):
- /, /demo, /admin, /setup, /login, /signup

FEATURES:
- Anonymous feedback submission works
- Authenticated submission works
- Element picker captures selectors
- Admin dashboard shows all feedback
- Status updates persist
- Export downloads JSON

EDGE FUNCTIONS:
- submit-feedback returns success
- submit-feedback-ai returns AI data
- health-check returns ok status

═══════════════════════════════════════════════════════════════════════════════

Please implement all phases and provide a summary of what was created.
```

---

## 🔧 Troubleshooting Prompts

### If Database Setup Fails

```
The database migration failed. Please:
1. Check if tables already exist (might need ALTER instead of CREATE)
2. Verify I have permission to create tables
3. Check for syntax errors in the SQL
4. Try creating tables one at a time to isolate the issue
```

### If RLS Blocks Everything

```
My RLS policies are blocking all access. Please:
1. Check if RLS is enabled on the tables
2. Verify the is_admin() function exists and works
3. Test each policy individually
4. Add a temporary "allow all" policy to debug
5. Check auth.uid() is returning the expected value
```

### If Edge Functions Return Errors

```
My edge function is returning errors. Please:
1. Check the edge function logs for details
2. Verify CORS headers are correct
3. Check environment variables are set (SUPABASE_URL, SERVICE_ROLE_KEY)
4. Test with a minimal request body
5. Verify the function is deployed
```

### If Admin Access Denied

```
I'm getting access denied on /admin even though I should be an admin. Please:
1. Verify my user_id is in admin_users table
2. Check is_admin() function returns true for me
3. Verify AdminGuard is checking isAdmin correctly
4. Check AuthContext is setting isAdmin properly
5. Clear session and re-login
```

---

## 📚 Quick Reference

| Task | Prompt to Use |
|------|--------------|
| Start fresh | Master Prompt |
| Just database | Prompt 1 |
| Just security | Prompt 2 |
| Just backend | Prompts 1 + 2 + 3 |
| Just frontend | Prompts 4 + 5 |
| Just styling | Prompt 6 |
| Debug issues | Prompt 7 |
| Become admin | Prompt 8 |

---

*Generated for the Feedback Widget Template. For updates, visit the project repository.*
