# Security Guide

This document covers all security features and best practices for the Feedback Widget Template.

## Security Features

### 1. Input Validation & Sanitization

All user input is validated and sanitized before storage:

| Field | Validation | Limit |
|-------|------------|-------|
| `raw_text` | XSS stripped, trimmed | 5,000 chars |
| `category` | Enum whitelist | Fixed values |
| `severity` | Enum whitelist | Fixed values |
| `page_url` | URL validation | 2,000 chars |
| `target_element` | Object structure | 500 char selector |
| `context` | JSON size limit | 10,000 chars |

**Sanitization includes:**
- Script tag removal
- HTML tag stripping
- Length truncation
- Type validation

### 2. Rate Limiting

Built-in rate limiting protects against abuse:

| Tier | Limit | Window |
|------|-------|--------|
| Basic/Standard | 50 requests | 1 hour |
| Pro (AI) | 30 requests | 1 hour |

Rate limits are tracked by:
1. **Authenticated users**: User ID
2. **Anonymous users**: IP address

**Customizing rate limits:**

```typescript
// In submit-feedback/index.ts
const CONFIG = {
  RATE_LIMIT_PER_HOUR: 100,  // Increase limit
  RATE_LIMIT_WINDOW_MINUTES: 30,  // Shorter window
}
```

### 3. Row Level Security (RLS)

The database uses PostgreSQL RLS policies:

```sql
-- Users can only submit feedback (not read others')
CREATE POLICY "Anyone can submit feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (true);

-- Only admins can read all feedback
CREATE POLICY "Admins can view feedback"
  ON public.feedback FOR SELECT
  USING (auth.uid() IN (SELECT admin_user_id FROM admin_config));
```

**Customizing RLS for your app:**

```sql
-- Option 1: User-specific (users can see their own feedback)
CREATE POLICY "Users view own feedback"
  ON public.feedback FOR SELECT
  USING (auth.uid() = user_id);

-- Option 2: Team-based
CREATE POLICY "Team members view feedback"
  ON public.feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.user_id = auth.uid()
    )
  );

-- Option 3: Role-based
CREATE POLICY "Admins only"
  ON public.feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

### 4. CORS Configuration

Default CORS allows all origins (for development):

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  // ...
}
```

**Production configuration:**

```typescript
const ALLOWED_ORIGINS = [
  'https://yourapp.com',
  'https://admin.yourapp.com',
]

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
}
```

### 5. Authentication (Optional)

JWT authentication is supported but optional:

```typescript
// In edge function
const authHeader = req.headers.get('authorization')
if (authHeader?.startsWith('Bearer ')) {
  const token = authHeader.replace('Bearer ', '')
  const { data: { user } } = await supabase.auth.getUser(token)
  userId = user?.id || null
}
```

**Requiring authentication:**

```typescript
// Make auth required
if (!userId) {
  return new Response(
    JSON.stringify({ error: 'Authentication required' }),
    { status: 401, headers: corsHeaders }
  )
}
```

### 6. Safe Error Messages

Error messages never expose internal details:

| Internal Error | User-Facing Message |
|----------------|---------------------|
| Database connection failed | "Failed to submit feedback. Please try again." |
| AI API timeout | "Failed to submit feedback. Please try again." |
| Invalid SQL | "An unexpected error occurred" |

Detailed errors are logged server-side only:

```typescript
console.error('Insert error:', insertError)  // Server log
return { error: 'Failed to submit feedback' }  // User sees this
```

## Security Checklist

### Before Deployment

- [ ] Configure production CORS origins
- [ ] Review and customize RLS policies
- [ ] Set appropriate rate limits
- [ ] Enable authentication if needed
- [ ] Configure allowed categories/severities
- [ ] Test input validation edge cases

### Production Monitoring

- [ ] Monitor rate limit hits
- [ ] Alert on unusual submission patterns
- [ ] Review error logs regularly
- [ ] Audit admin access periodically

## API Key Security

### Lovable AI (LOVABLE_API_KEY)

- Automatically provided in Lovable Cloud
- Server-side only (never expose to client)
- Used for AI summarization/categorization

### OpenAI (OPENAI_API_KEY)

- Optional fallback for AI features
- Store as Supabase secret
- Never commit to version control

```bash
# Add via Supabase CLI
supabase secrets set OPENAI_API_KEY=sk-...
```

### Service Role Key

- **NEVER** expose to client
- Only used server-side in edge functions
- Has full database access (bypasses RLS)

## Attack Prevention

### XSS Prevention

React automatically escapes rendered content. Additional measures:

```typescript
// Sanitization in edge function
function sanitizeText(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
}
```

### SQL Injection

Using Supabase client prevents SQL injection:

```typescript
// Safe - parameterized query
const { data } = await supabase
  .from('feedback')
  .insert({ raw_text: userInput })

// NEVER do this
// await supabase.rpc('execute_sql', { sql: userInput })
```

### CSRF Protection

For authenticated requests, the JWT token serves as CSRF protection. For anonymous submissions, rate limiting by IP provides protection.

### DoS Protection

1. **Rate limiting**: Limits requests per IP/user
2. **Input size limits**: Prevents large payload attacks
3. **Timeout limits**: AI requests timeout after 15 seconds

## Multi-Tenant Security

For SaaS applications with multiple tenants:

```sql
-- Add tenant_id to feedback table
ALTER TABLE public.feedback ADD COLUMN tenant_id uuid;

-- RLS policy for tenant isolation
CREATE POLICY "Tenant isolation"
  ON public.feedback FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants 
      WHERE user_id = auth.uid()
    )
  );
```

## Audit Logging

For compliance requirements, add audit logging:

```sql
-- Create audit table
CREATE TABLE feedback_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id uuid REFERENCES feedback(id),
  action text NOT NULL,
  actor_id uuid,
  changed_at timestamptz DEFAULT now(),
  old_values jsonb,
  new_values jsonb
);

-- Trigger for automatic logging
CREATE TRIGGER audit_feedback_changes
  AFTER UPDATE OR DELETE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION log_feedback_audit();
```

## Incident Response

If you suspect a security incident:

1. **Immediately**: Revoke any exposed API keys
2. **Investigate**: Review error logs and rate limit data
3. **Mitigate**: Temporarily increase rate limits or enable auth
4. **Notify**: Inform affected users if data was exposed
5. **Remediate**: Fix the vulnerability and update policies

## Security Updates

Stay updated with security patches:

- Subscribe to Supabase security advisories
- Update edge function dependencies regularly
- Review and update RLS policies quarterly
- Rotate API keys periodically

---

For security questions or to report vulnerabilities, please contact [your security contact].
