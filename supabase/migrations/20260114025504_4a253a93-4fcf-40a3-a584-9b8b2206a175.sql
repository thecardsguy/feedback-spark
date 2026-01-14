-- ═══════════════════════════════════════════════════════════════════════════════
-- MASTER IMPLEMENTATION: Performance Indexes, Trigger, and Foreign Keys
-- ═══════════════════════════════════════════════════════════════════════════════

-- FIX 1: Performance Indexes for Dashboard Queries
-- Index for status filtering (most common dashboard filter)
CREATE INDEX IF NOT EXISTS idx_feedback_status 
ON public.feedback(status);

-- Index for date sorting (dashboard queries)
CREATE INDEX IF NOT EXISTS idx_feedback_created_at 
ON public.feedback(created_at DESC);

-- Index for user lookups (user-specific queries)
CREATE INDEX IF NOT EXISTS idx_feedback_user_id 
ON public.feedback(user_id) 
WHERE user_id IS NOT NULL;

-- Composite index for admin dashboard (status + date)
CREATE INDEX IF NOT EXISTS idx_feedback_status_created 
ON public.feedback(status, created_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════════
-- FIX 2: Attach Updated Timestamp Trigger
-- ═══════════════════════════════════════════════════════════════════════════════

-- Drop if exists to avoid conflicts
DROP TRIGGER IF EXISTS set_feedback_updated_at ON public.feedback;

-- Create trigger to auto-update updated_at on row changes
CREATE TRIGGER set_feedback_updated_at
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.feedback_update_timestamp();

-- ═══════════════════════════════════════════════════════════════════════════════
-- FIX 5: Foreign Key Constraints for Data Integrity
-- ═══════════════════════════════════════════════════════════════════════════════

-- Cascade delete for admin_users when auth user is deleted
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_admin_users_user_id'
  ) THEN
    ALTER TABLE public.admin_users
    ADD CONSTRAINT fk_admin_users_user_id
    FOREIGN KEY (user_id) REFERENCES auth.users(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Set null for feedback when user is deleted (preserve feedback history)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_feedback_user_id'
  ) THEN
    ALTER TABLE public.feedback
    ADD CONSTRAINT fk_feedback_user_id
    FOREIGN KEY (user_id) REFERENCES auth.users(id)
    ON DELETE SET NULL;
  END IF;
END $$;