/**
 * Template: Miscellaneous (Database SQL, README, Index, QuickStart)
 * Extracted from DownloadTemplate.tsx for better organization
 */

export const DATABASE_SQL = `-- Feedback Widget - Database Setup
-- Run this in your Supabase SQL editor

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  raw_text TEXT NOT NULL,
  category TEXT DEFAULT 'other',
  severity TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  page_url TEXT,
  device_type TEXT,
  context JSONB,
  target_element JSONB,
  user_id UUID,
  ai_summary TEXT,
  ai_category TEXT,
  ai_question_for_dev TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Anyone can submit feedback
CREATE POLICY "Anyone can submit feedback" ON public.feedback FOR INSERT
WITH CHECK ((user_id IS NULL) OR (user_id = auth.uid()));

-- Users can view their own feedback, admins can view all
CREATE POLICY "Users and admins can view feedback" ON public.feedback FOR SELECT
USING (((auth.uid() IS NOT NULL) AND (auth.uid() = user_id)) OR is_admin());

-- Admins can update all feedback
CREATE POLICY "Admins can update all feedback" ON public.feedback FOR UPDATE
USING (is_admin());

-- Admins can delete feedback
CREATE POLICY "Admins can delete feedback" ON public.feedback FOR DELETE
USING (is_admin());

-- Users can update their own feedback
CREATE POLICY "Users can update own feedback" ON public.feedback FOR UPDATE
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin list" ON public.admin_users FOR SELECT USING (is_admin());
CREATE POLICY "Admins can add new admins" ON public.admin_users FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can remove admins" ON public.admin_users FOR DELETE USING (is_admin());

-- Admin check function
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
$$;
`;

export const INDEX_FILE = `/**
 * Feedback Widget - Main Export
 */

export { FeedbackWidget } from './QuickStart';
export * from './types/feedback';
export * from './config/feedback.config';
export * from './hooks/useFeedback';
export { FeedbackButton } from './components/user/FeedbackButton';
export { FeedbackForm } from './components/user/FeedbackForm';
export { ElementPicker } from './components/user/ElementPicker';
export { FeedbackDashboard } from './components/admin/FeedbackDashboard';
export { FeedbackList } from './components/admin/FeedbackList';
export { FeedbackDetail } from './components/admin/FeedbackDetail';
export { FeedbackStats } from './components/admin/FeedbackStats';
`;

export const QUICKSTART_FILE = `/**
 * Feedback Widget - Quick Start
 * 
 * Drop-in component with zero configuration.
 */

import React from 'react';
import { FeedbackButton } from './components/user/FeedbackButton';
import { createConfig } from './config/feedback.config';
import type { WidgetTier } from './types/feedback';

export interface FeedbackWidgetProps {
  appName?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  enableAI?: boolean;
  showElementPicker?: boolean;
  buttonColor?: string;
  onSubmit?: (feedbackId: string) => void;
  onError?: (error: Error) => void;
}

export function FeedbackWidget({
  appName = 'My App',
  position = 'bottom-right',
  enableAI = false,
  showElementPicker = true,
  buttonColor,
  onSubmit,
  onError,
}: FeedbackWidgetProps) {
  const tier: WidgetTier = enableAI ? 'pro' : 'standard';
  
  const config = createConfig({
    appName,
    position,
    buttonColor,
    features: { elementPicker: showElementPicker, categories: true, severityLevels: true, anonymousSubmission: true },
    ai: { enabled: enableAI, provider: enableAI ? 'lovable' : undefined, summarize: enableAI, categorize: enableAI, generateDevPrompt: enableAI },
    onSuccess: onSubmit ? (item) => onSubmit(item.id) : undefined,
    onError,
  }, tier);

  return <FeedbackButton config={config} />;
}

export { useFeedback } from './hooks/useFeedback';
export { createConfig } from './config/feedback.config';
export default FeedbackWidget;
`;

export const README_FILE = `# Feedback Widget Template

A drop-in feedback collection system with AI-powered analysis.

## Quick Start

\`\`\`tsx
import { FeedbackWidget } from './feedback';

function App() {
  return (
    <div>
      <FeedbackWidget enableAI />
    </div>
  );
}
\`\`\`

## Installation Steps

1. **Copy the \`feedback/\` folder** to your project's \`src/\` directory
2. **Update the import path** in \`feedback/hooks/useFeedback.ts\` to match your Supabase client location
3. **Run the database SQL** in your Supabase dashboard (use \`database.sql\`)
4. **Deploy edge functions** from \`supabase/functions/\`
5. **Install framer-motion**: \`npm install framer-motion\`
6. **Import and use** the FeedbackWidget component

## Dependencies

- React 18+
- framer-motion
- Supabase client

## Configuration

\`\`\`tsx
<FeedbackWidget
  appName="MyApp"
  position="bottom-right"  // bottom-left, top-right, top-left
  enableAI={true}          // Enable AI summaries
  showElementPicker={true} // Allow element targeting
  buttonColor="#3b82f6"    // Custom button color
/>
\`\`\`

## Admin Dashboard

\`\`\`tsx
import { FeedbackDashboard, createConfig } from './feedback';

const config = createConfig({
  appName: 'MyApp',
  ai: { enabled: true, provider: 'lovable' },
  admin: { showStats: true, copyToClipboard: true, exportEnabled: true, statusUpdates: true },
}, 'pro');

function AdminPage() {
  return <FeedbackDashboard config={config} />;
}
\`\`\`

## Features

- 🎯 Element targeting - users click to highlight issues
- 🤖 AI analysis - automatic categorization & summaries
- 📊 Admin dashboard - manage all feedback
- 🎨 Fully customizable - colors, position, features
- 🌙 Dark mode support

## Full Documentation

https://github.com/thecardsguy/feedback-chatbot

## License

MIT License
`;
