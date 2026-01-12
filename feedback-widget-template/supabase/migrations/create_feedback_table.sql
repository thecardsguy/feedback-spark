-- Feedback Widget Template - Standalone Database Schema
-- This creates a standalone feedback table with RLS policies

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  
  -- Core fields
  raw_text text NOT NULL,
  category text DEFAULT 'other' CHECK (category IN ('bug', 'feature', 'ui_ux', 'suggestion', 'other')),
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  page_url text,
  
  -- Element targeting
  target_element jsonb,
  
  -- AI enhancement (optional, populated when AI enabled)
  ai_summary text,
  ai_category text,
  ai_question_for_dev text,
  
  -- Metadata
  device_type text,
  context jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit feedback (anonymous or authenticated)
CREATE POLICY "Anyone can submit feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (true);

-- Allow users to view their own feedback
CREATE POLICY "Users can view own feedback"
  ON public.feedback FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow admins to view all feedback (customize this policy as needed)
-- For single-user apps, this allows the owner to see all feedback
CREATE POLICY "Admins can view all feedback"
  ON public.feedback FOR SELECT
  USING (true);

-- Allow status updates
CREATE POLICY "Admins can update feedback"
  ON public.feedback FOR UPDATE
  USING (true);

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.feedback_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER feedback_updated_at
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.feedback_update_timestamp();
