/**
 * Onboarding Wizard Component
 * Step-by-step guide with validation checks for setting up the feedback widget
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Database,
  Zap,
  Code,
  CheckCircle2,
  Circle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Download,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StepStatus {
  completed: boolean;
  verified: boolean;
  verifying: boolean;
  error?: string;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  content: React.ReactNode;
  verifyFn?: () => Promise<boolean>;
}

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const verifyDatabase = async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('feedback')
        .select('id', { count: 'exact', head: true });
      return !error;
    } catch {
      return false;
    }
  };

  const verifyEdgeFunctions = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('health-check');
      return !error && data?.database?.ok;
    } catch {
      return false;
    }
  };

  const verifyAI = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('submit-feedback-ai', {
        body: {
          raw_text: 'Verification test',
          category: 'other',
          page_url: window.location.href,
          device_type: 'desktop',
        },
      });
      return !error && (data?.ai_summary || data?.demo_mode);
    } catch {
      return false;
    }
  };

  const databaseSQL = `-- Run this in your database
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

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit
CREATE POLICY "Anyone can submit feedback"
ON public.feedback FOR INSERT
WITH CHECK ((user_id IS NULL) OR (user_id = auth.uid()));`;

  const integrationCode = `// Add to your App.tsx or main layout
import { FeedbackWidget } from '@/feedback';

function App() {
  return (
    <div>
      {/* Your app content */}
      <FeedbackWidget enableAI />
    </div>
  );
}`;

  const steps: WizardStep[] = [
    {
      id: 'database',
      title: 'Database Setup',
      description: 'Create the feedback table in your database',
      icon: Database,
      verifyFn: verifyDatabase,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            First, create the feedback table to store submissions. Run this SQL in your database:
          </p>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 gap-2 z-10"
              onClick={() => copyToClipboard(databaseSQL, 'db')}
            >
              {copied === 'db' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied === 'db' ? 'Copied!' : 'Copy'}
            </Button>
            <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-xs max-h-48 border border-border">
              <code className="text-foreground">{databaseSQL}</code>
            </pre>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>In Lovable, this table is already created for you!</span>
          </div>
        </div>
      ),
    },
    {
      id: 'functions',
      title: 'Edge Functions',
      description: 'Deploy the backend functions for processing feedback',
      icon: Zap,
      verifyFn: verifyEdgeFunctions,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            The template includes two edge functions:
          </p>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">Required</Badge>
                <span className="font-mono text-sm text-foreground">submit-feedback</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Basic feedback submission without AI features
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-600">Pro</Badge>
                <span className="font-mono text-sm text-foreground">submit-feedback-ai</span>
              </div>
              <p className="text-xs text-muted-foreground">
                AI-powered with summarization and categorization
              </p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-sm text-green-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              In Lovable, functions deploy automatically when you save!
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'ai',
      title: 'AI Configuration',
      description: 'Optional: Enable AI-powered feedback analysis',
      icon: Sparkles,
      verifyFn: verifyAI,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            The AI features use Lovable AI Gateway to:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Summarize feedback into actionable insights
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Auto-categorize (bug, feature, UI, etc.)
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Generate developer prompts
            </li>
          </ul>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.open('https://docs.lovable.dev/features/ai', '_blank')}
          >
            Learn about Lovable AI
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
    {
      id: 'integrate',
      title: 'Add to Your App',
      description: 'Import and use the FeedbackWidget component',
      icon: Code,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Add the widget to your app with just one component:
          </p>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 gap-2 z-10"
              onClick={() => copyToClipboard(integrationCode, 'code')}
            >
              {copied === 'code' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied === 'code' ? 'Copied!' : 'Copy'}
            </Button>
            <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto text-sm border border-border">
              <code className="text-foreground">{integrationCode}</code>
            </pre>
          </div>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-sm font-medium text-primary mb-1">🎉 That's it!</p>
            <p className="text-sm text-primary/80">
              The feedback button will appear in the bottom-right corner of your app.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const verifyStep = async (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (!step?.verifyFn) {
      setStepStatuses(prev => ({
        ...prev,
        [stepId]: { completed: true, verified: true, verifying: false },
      }));
      return;
    }

    setStepStatuses(prev => ({
      ...prev,
      [stepId]: { ...prev[stepId], verifying: true },
    }));

    const success = await step.verifyFn();

    setStepStatuses(prev => ({
      ...prev,
      [stepId]: {
        completed: success,
        verified: true,
        verifying: false,
        error: success ? undefined : 'Verification failed',
      },
    }));
  };

  useEffect(() => {
    // Auto-verify current step when it changes
    const step = steps[currentStep];
    if (step && !stepStatuses[step.id]?.verified) {
      verifyStep(step.id);
    }
  }, [currentStep]);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  const currentStatus = stepStatuses[currentStepData.id];

  return (
    <Card className="overflow-hidden border-border">
      {/* Progress Header */}
      <div className="p-4 bg-muted/30 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Setup Wizard</h3>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps Indicator */}
      <div className="flex border-b border-border">
        {steps.map((step, idx) => {
          const status = stepStatuses[step.id];
          const isCurrent = idx === currentStep;
          const isCompleted = status?.completed;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              className={`flex-1 p-3 flex items-center justify-center gap-2 transition-colors ${
                isCurrent 
                  ? 'bg-primary/10 border-b-2 border-primary' 
                  : isCompleted 
                    ? 'bg-green-500/5' 
                    : 'hover:bg-muted/50'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : status?.verifying ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              ) : (
                <Icon className={`w-4 h-4 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
              )}
              <span className={`text-sm hidden sm:inline ${
                isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepData.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-foreground mb-2">
                {currentStepData.title}
              </h4>
              <p className="text-muted-foreground">
                {currentStepData.description}
              </p>
            </div>

            {currentStepData.content}

            {/* Verification Status */}
            {currentStatus && currentStepData.verifyFn && (
              <div className={`mt-6 p-3 rounded-lg flex items-center gap-3 ${
                currentStatus.verifying 
                  ? 'bg-muted/50'
                  : currentStatus.completed 
                    ? 'bg-green-500/10' 
                    : 'bg-orange-500/10'
              }`}>
                {currentStatus.verifying ? (
                  <>
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    <span className="text-sm text-muted-foreground">Verifying...</span>
                  </>
                ) : currentStatus.completed ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-600">Step verified successfully!</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-5 h-5 text-orange-500" />
                    <span className="text-sm text-orange-600">
                      Not verified yet. Complete the step above, then proceed.
                    </span>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => verifyStep(currentStepData.id)}
                  disabled={currentStatus.verifying}
                >
                  Re-check
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-4 bg-muted/20 border-t border-border flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={() => setCurrentStep(prev => prev + 1)}
            className="gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button className="gap-2 bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4" />
            Complete Setup
          </Button>
        )}
      </div>
    </Card>
  );
}

export default OnboardingWizard;
