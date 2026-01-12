/**
 * Download Template Component
 * Creates a downloadable ZIP file containing the essential template files
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Loader2,
  FileArchive,
  Check,
  Folder,
  File,
  ExternalLink,
} from 'lucide-react';

// Template file contents - these would be the actual file contents
const TEMPLATE_FILES = {
  'src/feedback/index.ts': `// Main exports for the feedback widget
export { FeedbackWidget } from './QuickStart';
export { FeedbackButton } from './components/user/FeedbackButton';
export { FeedbackForm } from './components/user/FeedbackForm';
export { ElementPicker } from './components/user/ElementPicker';
export { FeedbackDashboard } from './components/admin/FeedbackDashboard';
export { FeedbackList } from './components/admin/FeedbackList';
export { FeedbackDetail } from './components/admin/FeedbackDetail';
export { FeedbackStats } from './components/admin/FeedbackStats';
export { useFeedback } from './hooks/useFeedback';
export { createConfig, DEFAULT_CONFIGS } from './config/feedback.config';
export type { FeedbackItem, FeedbackConfig } from './types/feedback';
`,
  
  'src/feedback/QuickStart.tsx': `/**
 * FeedbackWidget - Drop-in component for instant feedback collection
 */
import { FeedbackButton } from './components/user/FeedbackButton';
import { createConfig } from './config/feedback.config';
import type { FeedbackConfig } from './types/feedback';

interface FeedbackWidgetProps {
  appName?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  enableAI?: boolean;
  showElementPicker?: boolean;
  buttonColor?: string;
  onSubmit?: (feedbackId: string) => void;
  config?: FeedbackConfig;
}

export function FeedbackWidget({
  appName = 'My App',
  position = 'bottom-right',
  enableAI = false,
  showElementPicker = true,
  buttonColor,
  onSubmit,
  config: customConfig,
}: FeedbackWidgetProps) {
  const config = customConfig || createConfig({
    appName,
    position,
    features: {
      elementPicker: showElementPicker,
      categories: true,
      severityLevels: true,
    },
    ai: {
      enabled: enableAI,
      summarize: enableAI,
      categorize: enableAI,
      generateDevPrompt: enableAI,
    },
    styling: buttonColor ? {
      primaryColor: buttonColor,
      borderRadius: '12px',
    } : undefined,
  }, enableAI ? 'pro' : 'standard');

  return <FeedbackButton config={config} onSubmit={onSubmit} />;
}

export default FeedbackWidget;
`,

  'README.md': `# Feedback Widget Template

A drop-in feedback collection system with AI-powered analysis.

## Quick Start

\`\`\`tsx
import { FeedbackWidget } from '@/feedback';

function App() {
  return (
    <div>
      <FeedbackWidget enableAI />
    </div>
  );
}
\`\`\`

## Features

- 🎯 Element targeting - users click to highlight issues
- 🤖 AI analysis - automatic categorization & summaries
- 📊 Admin dashboard - manage all feedback
- 🎨 Fully customizable - colors, position, features

## Requirements

- Lovable Cloud (or Supabase)
- Database with \`feedback\` table
- Edge functions deployed

## Documentation

See the full guide at: https://docs.lovable.dev
`,

  'supabase/functions/submit-feedback/index.ts': `import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        raw_text: body.raw_text,
        category: body.category || 'other',
        severity: body.severity || 'medium',
        page_url: body.page_url,
        device_type: body.device_type,
        target_element: body.target_element,
        context: body.context,
        user_id: body.user_id,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
`,

  'database-setup.sql': `-- Feedback Table
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

-- Policy: Anyone can submit feedback
CREATE POLICY "Anyone can submit feedback"
ON public.feedback FOR INSERT
WITH CHECK ((user_id IS NULL) OR (user_id = auth.uid()));

-- Policy: Admins can view all feedback
CREATE POLICY "Admins can view feedback"
ON public.feedback FOR SELECT
USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
`,
};

export function DownloadTemplate() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const generateAndDownloadZip = async () => {
    setIsGenerating(true);
    
    try {
      // Dynamically import JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add all template files
      Object.entries(TEMPLATE_FILES).forEach(([path, content]) => {
        zip.file(path, content);
      });

      // Generate the zip file
      const blob = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'feedback-widget-template.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (error) {
      console.error('Failed to generate ZIP:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const fileList = [
    { name: 'src/feedback/', type: 'folder', desc: 'Widget components & hooks' },
    { name: 'supabase/functions/', type: 'folder', desc: 'Backend edge functions' },
    { name: 'database-setup.sql', type: 'file', desc: 'Database schema' },
    { name: 'README.md', type: 'file', desc: 'Setup instructions' },
  ];

  return (
    <Card className="p-6 bg-card/80 backdrop-blur border-border">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileArchive className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">Download Template</h3>
          <p className="text-sm text-muted-foreground">
            Get all the essential files in one ZIP
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          ~15 KB
        </Badge>
      </div>

      {/* File Preview */}
      <div className="mb-6 p-4 rounded-xl bg-muted/30 border border-border">
        <p className="text-sm font-medium text-foreground mb-3">Included files:</p>
        <div className="space-y-2">
          {fileList.map((item) => (
            <div key={item.name} className="flex items-center gap-3 text-sm">
              {item.type === 'folder' ? (
                <Folder className="w-4 h-4 text-blue-500" />
              ) : (
                <File className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="font-mono text-foreground">{item.name}</span>
              <span className="text-muted-foreground text-xs ml-auto">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Download Button */}
      <Button
        onClick={generateAndDownloadZip}
        disabled={isGenerating}
        className="w-full gap-2"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating ZIP...
          </>
        ) : downloaded ? (
          <>
            <Check className="w-5 h-5" />
            Downloaded!
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Download Template ZIP
          </>
        )}
      </Button>

      {/* Alternative: GitHub */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center mb-3">
          Or get the full source from GitHub
        </p>
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => window.open('https://github.com/thecardsguy/feedback-chatbot', '_blank')}
        >
          View on GitHub
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

export default DownloadTemplate;
