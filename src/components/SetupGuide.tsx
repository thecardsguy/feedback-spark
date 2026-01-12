/**
 * Setup Guide Component
 * 
 * Shows users exactly what they need to implement the feedback widget,
 * including file structure, API requirements, and direct links.
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Folder,
  File,
  ExternalLink,
  Check,
  Copy,
  ChevronDown,
  ChevronRight,
  Database,
  Key,
  Cloud,
  Zap,
  AlertCircle,
  BookOpen,
  Settings,
  Download,
} from 'lucide-react';
import SetupVerification from './SetupVerification';
import OnboardingWizard from './OnboardingWizard';
import DownloadTemplate from './DownloadTemplate';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  description?: string;
  required?: boolean;
  children?: FileNode[];
}

const FILE_STRUCTURE: FileNode[] = [
  {
    name: 'src/feedback/',
    type: 'folder',
    required: true,
    description: 'Main widget folder - copy this entire folder',
    children: [
      { name: 'QuickStart.tsx', type: 'file', description: 'Simple drop-in component', required: true },
      { name: 'index.ts', type: 'file', description: 'Main exports', required: true },
      {
        name: 'components/',
        type: 'folder',
        children: [
          {
            name: 'user/',
            type: 'folder',
            children: [
              { name: 'FeedbackButton.tsx', type: 'file', description: 'Floating button', required: true },
              { name: 'FeedbackForm.tsx', type: 'file', description: 'Submission form', required: true },
              { name: 'ElementPicker.tsx', type: 'file', description: 'Element targeting', required: true },
            ],
          },
          {
            name: 'admin/',
            type: 'folder',
            children: [
              { name: 'FeedbackDashboard.tsx', type: 'file', description: 'Admin view' },
              { name: 'FeedbackList.tsx', type: 'file', description: 'Feedback list' },
              { name: 'FeedbackDetail.tsx', type: 'file', description: 'Detail view' },
              { name: 'FeedbackStats.tsx', type: 'file', description: 'Statistics' },
            ],
          },
        ],
      },
      {
        name: 'config/',
        type: 'folder',
        children: [
          { name: 'feedback.config.ts', type: 'file', description: 'Configuration presets', required: true },
        ],
      },
      {
        name: 'hooks/',
        type: 'folder',
        children: [
          { name: 'useFeedback.ts', type: 'file', description: 'Data hooks', required: true },
        ],
      },
      {
        name: 'types/',
        type: 'folder',
        children: [
          { name: 'feedback.ts', type: 'file', description: 'TypeScript types', required: true },
        ],
      },
    ],
  },
  {
    name: 'supabase/functions/',
    type: 'folder',
    required: true,
    description: 'Backend edge functions',
    children: [
      {
        name: 'submit-feedback/',
        type: 'folder',
        children: [
          { name: 'index.ts', type: 'file', description: 'Basic submission (no AI)', required: true },
        ],
      },
      {
        name: 'submit-feedback-ai/',
        type: 'folder',
        children: [
          { name: 'index.ts', type: 'file', description: 'AI-powered submission', required: true },
        ],
      },
    ],
  },
];

interface ApiRequirement {
  name: string;
  description: string;
  required: boolean;
  envVar: string;
  url: string;
  buttonText: string;
  tier: 'basic' | 'standard' | 'pro';
}

const API_REQUIREMENTS: ApiRequirement[] = [
  {
    name: 'Lovable Cloud',
    description: 'Provides database, auth, and backend functions. Auto-configured in Lovable projects.',
    required: true,
    envVar: 'Auto-configured',
    url: 'https://docs.lovable.dev/features/cloud',
    buttonText: 'Learn about Cloud',
    tier: 'basic',
  },
  {
    name: 'Lovable AI Gateway',
    description: 'AI-powered categorization, summaries, and developer prompts. Free tier included.',
    required: false,
    envVar: 'LOVABLE_API_KEY',
    url: 'https://docs.lovable.dev/features/ai',
    buttonText: 'Enable AI Features',
    tier: 'pro',
  },
];

const DATABASE_SQL = `-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  raw_text TEXT NOT NULL,
  category TEXT DEFAULT 'other',
  severity TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  page_url TEXT,
  target_element JSONB,
  device_type TEXT,
  context JSONB,
  ai_summary TEXT,
  ai_category TEXT,
  ai_question_for_dev TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback
CREATE POLICY "Anyone can submit feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (true);

-- Only admins can read all feedback
CREATE POLICY "Admins can read all feedback"
  ON public.feedback FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Create admin_users table
CREATE TABLE public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;`;

function FileTree({ nodes, depth = 0 }: { nodes: FileNode[]; depth?: number }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'src/feedback/': true,
    'supabase/functions/': true,
  });

  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <div key={node.name}>
          <div
            className={`flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 cursor-pointer ${
              depth === 0 ? 'font-medium' : ''
            }`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => node.type === 'folder' && setExpanded(e => ({ ...e, [node.name]: !e[node.name] }))}
          >
            {node.type === 'folder' ? (
              <>
                {expanded[node.name] ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <Folder className="w-4 h-4 text-blue-500" />
              </>
            ) : (
              <>
                <span className="w-4" />
                <File className="w-4 h-4 text-muted-foreground" />
              </>
            )}
            <span className="text-sm text-foreground">{node.name}</span>
            {node.required && (
              <Badge variant="outline" className="text-xs ml-auto bg-green-500/10 text-green-600 border-green-500/20">
                Required
              </Badge>
            )}
            {node.description && !node.required && (
              <span className="text-xs text-muted-foreground ml-auto">{node.description}</span>
            )}
          </div>
          {node.type === 'folder' && node.children && expanded[node.name] && (
            <FileTree nodes={node.children} depth={depth + 1} />
          )}
        </div>
      ))}
    </div>
  );
}

export function SetupGuide() {
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [activeTab, setActiveTab] = useState('wizard');

  const copySQL = () => {
    navigator.clipboard.writeText(DATABASE_SQL);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Implementation Guide
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to add the feedback widget to your project. 
          Choose your preferred setup method below.
        </p>
      </div>

      {/* Quick Actions Row */}
      <div className="grid md:grid-cols-3 gap-4">
        <SetupVerification />
        <DownloadTemplate />
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="wizard" className="gap-2">
            <Settings className="w-4 h-4" />
            Setup Wizard
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Manual Guide
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wizard">
          <OnboardingWizard />
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          {/* Step 1: API Requirements */}
          <Card className="p-6 bg-card/80 backdrop-blur border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Step 1: Required Services</h3>
                <p className="text-sm text-muted-foreground">What you need before starting</p>
              </div>
            </div>

            <div className="space-y-4">
              {API_REQUIREMENTS.map((api) => (
                <div
                  key={api.name}
                  className={`p-4 rounded-xl border ${
                    api.required 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-muted/30 border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{api.name}</h4>
                        {api.required ? (
                          <Badge className="bg-primary text-primary-foreground text-xs">Required</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Optional (Pro Tier)</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{api.description}</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded text-foreground">
                        {api.envVar}
                      </code>
                    </div>
                    <Button
                      variant={api.required ? 'default' : 'outline'}
                      size="sm"
                      className="gap-2 shrink-0"
                      onClick={() => window.open(api.url, '_blank')}
                    >
                      {api.buttonText}
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Using Lovable?
                  </p>
                  <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                    Lovable Cloud is automatically enabled. The LOVABLE_API_KEY for AI features 
                    is also pre-configured - no setup needed!
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 2: File Structure */}
          <Card className="p-6 bg-card/80 backdrop-blur border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Folder className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Step 2: Copy These Files</h3>
                <p className="text-sm text-muted-foreground">Add these folders to your project</p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 border border-border">
              <FileTree nodes={FILE_STRUCTURE} />
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-green-500" />
              <span>Files marked "Required" are essential for basic functionality</span>
            </div>
          </Card>

          {/* Step 3: Database Setup */}
          <Card className="p-6 bg-card/80 backdrop-blur border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Step 3: Database Setup</h3>
                <p className="text-sm text-muted-foreground">Run this SQL in your database</p>
              </div>
            </div>

            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={copySQL}
                className="absolute top-3 right-3 gap-2 z-10"
              >
                {copiedSQL ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy SQL
                  </>
                )}
              </Button>
              <pre className="bg-muted/50 rounded-xl p-4 overflow-x-auto text-xs text-foreground border border-border max-h-64">
                <code>{DATABASE_SQL}</code>
              </pre>
            </div>
          </Card>

          {/* Step 4: Deploy Edge Functions */}
          <Card className="p-6 bg-card/80 backdrop-blur border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Step 4: Deploy Functions</h3>
                <p className="text-sm text-muted-foreground">Backend functions for processing feedback</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">submit-feedback</span>
                  <Badge variant="outline" className="text-xs">Basic</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Basic feedback submission. No AI features.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">submit-feedback-ai</span>
                  <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-600">Pro</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI-powered with summaries, categorization, and developer prompts.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Auto-deployed in Lovable
                  </p>
                  <p className="text-sm text-green-600/80 dark:text-green-400/80">
                    Edge functions in the <code className="px-1 bg-green-500/10 rounded">supabase/functions</code> folder 
                    are automatically deployed when you save.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 5: Add to App */}
          <Card className="p-6 bg-card/80 backdrop-blur border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Step 5: Add to Your App</h3>
                <p className="text-sm text-muted-foreground">One line of code</p>
              </div>
            </div>

            <pre className="bg-muted/50 rounded-xl p-4 overflow-x-auto text-sm border border-border">
              <code className="text-foreground">{`import { FeedbackWidget } from '@/feedback';

function App() {
  return (
    <div>
      {/* Your app content */}
      <FeedbackWidget enableAI />
    </div>
  );
}`}</code>
            </pre>

            <div className="mt-4 text-center">
              <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-sm py-1 px-3">
                🎉 You're done! The widget is now live in your app.
              </Badge>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SetupGuide;
