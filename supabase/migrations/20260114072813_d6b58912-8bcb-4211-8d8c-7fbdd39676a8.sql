-- Add contact fields to feedback table for user information collection
ALTER TABLE public.feedback 
ADD COLUMN IF NOT EXISTS submitter_name TEXT,
ADD COLUMN IF NOT EXISTS submitter_email TEXT,
ADD COLUMN IF NOT EXISTS submitter_phone TEXT;