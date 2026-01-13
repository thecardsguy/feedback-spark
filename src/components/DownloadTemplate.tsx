/**
 * Download Template Component
 * 
 * Creates a downloadable ZIP file containing all template files.
 * Files are generated inline to ensure consistency with the source.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Download,
  Loader2,
  FileArchive,
  Check,
  Folder,
  File,
  ExternalLink,
  MessageCircle,
  X,
  Target,
  Bug,
  Lightbulb,
  Palette,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Template file structure preview
const FILE_STRUCTURE = [
  { name: 'feedback/', type: 'folder', desc: 'Main feedback module' },
  { name: 'feedback/index.ts', type: 'file', desc: 'Exports' },
  { name: 'feedback/QuickStart.tsx', type: 'file', desc: 'Drop-in widget' },
  { name: 'feedback/types/', type: 'folder', desc: 'TypeScript types' },
  { name: 'feedback/config/', type: 'folder', desc: 'Configuration' },
  { name: 'feedback/hooks/', type: 'folder', desc: 'React hooks' },
  { name: 'feedback/components/', type: 'folder', desc: 'UI components' },
  { name: 'supabase/functions/', type: 'folder', desc: 'Edge functions' },
  { name: 'database.sql', type: 'file', desc: 'DB schema + RLS' },
  { name: 'README.md', type: 'file', desc: 'Setup guide' },
];

export function DownloadTemplate() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const generateAndDownloadZip = async () => {
    setIsGenerating(true);
    
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // ===========================================
      // TYPES
      // ===========================================
      zip.file('feedback/types/feedback.ts', TYPES_FILE);

      // ===========================================
      // CONFIG
      // ===========================================
      zip.file('feedback/config/feedback.config.ts', CONFIG_FILE);

      // ===========================================
      // HOOKS
      // ===========================================
      zip.file('feedback/hooks/useFeedback.ts', HOOKS_FILE);

      // ===========================================
      // USER COMPONENTS
      // ===========================================
      zip.file('feedback/components/user/FeedbackButton.tsx', FEEDBACK_BUTTON_FILE);
      zip.file('feedback/components/user/FeedbackForm.tsx', FEEDBACK_FORM_FILE);
      zip.file('feedback/components/user/ElementPicker.tsx', ELEMENT_PICKER_FILE);

      // ===========================================
      // ADMIN COMPONENTS
      // ===========================================
      zip.file('feedback/components/admin/FeedbackDashboard.tsx', FEEDBACK_DASHBOARD_FILE);
      zip.file('feedback/components/admin/FeedbackList.tsx', FEEDBACK_LIST_FILE);
      zip.file('feedback/components/admin/FeedbackDetail.tsx', FEEDBACK_DETAIL_FILE);
      zip.file('feedback/components/admin/FeedbackStats.tsx', FEEDBACK_STATS_FILE);

      // ===========================================
      // EXPORTS
      // ===========================================
      zip.file('feedback/index.ts', INDEX_FILE);
      zip.file('feedback/QuickStart.tsx', QUICKSTART_FILE);

      // ===========================================
      // EDGE FUNCTIONS
      // ===========================================
      zip.file('supabase/functions/submit-feedback/index.ts', EDGE_FUNCTION_BASIC);
      zip.file('supabase/functions/submit-feedback-ai/index.ts', EDGE_FUNCTION_AI);

      // ===========================================
      // DATABASE
      // ===========================================
      zip.file('database.sql', DATABASE_SQL);

      // ===========================================
      // README
      // ===========================================
      zip.file('README.md', README_FILE);

      // Generate and download
      const blob = await zip.generateAsync({ type: 'blob' });
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

  return (
    <Card className="p-6 bg-card/80 backdrop-blur border-border">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileArchive className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">Download Template</h3>
          <p className="text-sm text-muted-foreground">
            Complete template with all files
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          15 files
        </Badge>
      </div>

      {/* Tabs for Preview and Files */}
      <Tabs defaultValue="preview" className="mb-6">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="preview" className="flex-1">Live Preview</TabsTrigger>
          <TabsTrigger value="files" className="flex-1">Files List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview">
          <WidgetPreview />
        </TabsContent>
        
        <TabsContent value="files">
          {/* File Preview */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border max-h-48 overflow-y-auto">
            <p className="text-sm font-medium text-foreground mb-3">Included files:</p>
            <div className="space-y-1.5">
              {FILE_STRUCTURE.map((item) => (
                <div key={item.name} className="flex items-center gap-3 text-sm">
                  {item.type === 'folder' ? (
                    <Folder className="w-4 h-4 text-blue-500 shrink-0" />
                  ) : (
                    <File className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  <span className="font-mono text-xs text-foreground truncate">{item.name}</span>
                  <span className="text-muted-foreground text-xs ml-auto shrink-0">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

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

      {/* GitHub Link */}
      <div className="mt-4 pt-4 border-t border-border">
        <a
          href="https://github.com/thecardsguy/feedback-chatbot"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View on GitHub
        </a>
      </div>
    </Card>
  );
}

// Interactive Widget Preview Component with Dark Mode Toggle
function WidgetPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<string>('bug');
  const [severity, setSeverity] = useState<string>('medium');
  const [text, setText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const categories = [
    { value: 'bug', label: 'Bug', emoji: '🐛', icon: Bug },
    { value: 'feature', label: 'Feature', emoji: '✨', icon: Lightbulb },
    { value: 'ui_ux', label: 'Design', emoji: '🎨', icon: Palette },
  ];

  const severities = [
    { value: 'low', label: 'Minor', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'Major', color: 'bg-orange-500' },
  ];

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsOpen(false);
      setText('');
    }, 1500);
  };

  // Theme-specific styles
  const theme = isDark ? {
    bg: 'bg-zinc-900',
    bgGradient: 'from-zinc-800/40 via-zinc-900/60 to-zinc-800/40',
    skeleton: 'bg-zinc-700/30',
    skeletonLight: 'bg-zinc-700/20',
    card: 'bg-zinc-800 border-zinc-700',
    text: 'text-zinc-100',
    textMuted: 'text-zinc-400',
    input: 'bg-zinc-700/50 border-zinc-600',
    button: 'bg-blue-600 text-white',
    buttonMuted: 'bg-zinc-700/50 text-zinc-400 border-zinc-600',
    success: 'bg-green-900/30',
  } : {
    bg: 'bg-gray-50',
    bgGradient: 'from-gray-100/40 via-white/60 to-gray-100/40',
    skeleton: 'bg-gray-300/40',
    skeletonLight: 'bg-gray-200/60',
    card: 'bg-white border-gray-200',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    input: 'bg-gray-100 border-gray-300',
    button: 'bg-blue-600 text-white',
    buttonMuted: 'bg-gray-100 text-gray-500 border-gray-300',
    success: 'bg-green-100',
  };

  return (
    <div className="space-y-3">
      {/* Theme Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Preview theme:</span>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
          <button
            onClick={() => setIsDark(false)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              !isDark ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            ☀️ Light
          </button>
          <button
            onClick={() => setIsDark(true)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              isDark ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🌙 Dark
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className={`relative h-64 ${theme.bg} bg-gradient-to-br ${theme.bgGradient} rounded-xl border border-border overflow-hidden transition-colors duration-300`}>
        {/* Mock app background */}
        <div className="absolute inset-0 p-4">
          <div className={`h-3 w-24 ${theme.skeleton} rounded mb-2`} />
          <div className={`h-2 w-full ${theme.skeletonLight} rounded mb-1`} />
          <div className={`h-2 w-3/4 ${theme.skeletonLight} rounded mb-1`} />
          <div className={`h-2 w-5/6 ${theme.skeletonLight} rounded mb-4`} />
          <div className="flex gap-2 mb-4">
            <div className={`h-16 w-16 ${theme.skeleton} rounded-lg`} />
            <div className="flex-1">
              <div className={`h-2 w-1/2 ${theme.skeleton} rounded mb-1`} />
              <div className={`h-2 w-3/4 ${theme.skeletonLight} rounded mb-1`} />
              <div className={`h-2 w-2/3 ${theme.skeletonLight} rounded`} />
            </div>
          </div>
          <div className={`h-8 w-24 ${isDark ? 'bg-blue-600/30' : 'bg-blue-500/20'} rounded-lg`} />
        </div>

        {/* Floating feedback button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute bottom-4 right-4 w-12 h-12 rounded-full ${theme.button} shadow-lg flex items-center justify-center z-20`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </motion.button>

        {/* Feedback form popup */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`absolute bottom-20 right-4 w-64 ${theme.card} rounded-xl shadow-xl overflow-hidden z-10 border`}
            >
              {showSuccess ? (
                <div className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-full ${theme.success} flex items-center justify-center mx-auto mb-3`}>
                    <Check className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-sm font-semibold text-green-500">Thank you!</p>
                  <p className={`text-xs ${theme.textMuted}`}>Feedback submitted</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold text-sm ${theme.text}`}>Send Feedback</h4>
                    <button onClick={() => setIsOpen(false)} className={`${theme.textMuted} hover:${theme.text}`}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Category buttons */}
                  <div className="flex gap-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`flex-1 py-1.5 rounded-md text-xs transition-colors ${
                          category === cat.value
                            ? 'bg-blue-600/20 text-blue-500 border border-blue-500/30'
                            : `${theme.buttonMuted} border hover:opacity-80`
                        }`}
                      >
                        {cat.emoji}
                      </button>
                    ))}
                  </div>

                  {/* Severity buttons */}
                  <div className="flex gap-1">
                    {severities.map((sev) => (
                      <button
                        key={sev.value}
                        onClick={() => setSeverity(sev.value)}
                        className={`flex-1 py-1 rounded text-xs transition-colors ${
                          severity === sev.value
                            ? `${isDark ? 'bg-zinc-700' : 'bg-gray-200'} ${theme.text} font-medium`
                            : `${theme.textMuted} hover:opacity-80`
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${sev.color}`} />
                          {sev.label}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Textarea */}
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Describe your feedback..."
                    className={`w-full h-14 px-2.5 py-2 text-xs ${theme.input} rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme.text}`}
                  />

                  {/* Element picker hint */}
                  <button className={`w-full py-1.5 border border-dashed ${isDark ? 'border-zinc-600' : 'border-gray-300'} rounded-lg text-xs ${theme.textMuted} hover:opacity-80 transition-colors flex items-center justify-center gap-1.5`}>
                    <Target className="w-3 h-3" />
                    Target element
                  </button>

                  {/* Submit button */}
                  <button
                    onClick={handleSubmit}
                    disabled={!text.trim()}
                    className={`w-full h-8 text-xs rounded-md font-medium transition-colors ${
                      text.trim()
                        ? `${theme.button} hover:opacity-90`
                        : `${isDark ? 'bg-zinc-700 text-zinc-500' : 'bg-gray-200 text-gray-400'} cursor-not-allowed`
                    } flex items-center justify-center gap-1.5`}
                  >
                    <Send className="w-3 h-3" />
                    Submit
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Label */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className={`text-[10px] ${isDark ? 'bg-zinc-800/80' : 'bg-white/80'} backdrop-blur`}>
            Interactive Preview
          </Badge>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// FILE CONTENTS
// =============================================================================

const TYPES_FILE = `/**
 * Feedback Widget - Type Definitions
 */

export type FeedbackCategory = 'bug' | 'feature' | 'ui_ux' | 'suggestion' | 'other';
export type FeedbackSeverity = 'low' | 'medium' | 'high' | 'critical';
export type FeedbackStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export type WidgetTier = 'basic' | 'standard' | 'pro';

export interface TargetElement {
  selector: string;
  tagName: string;
  className: string;
  textPreview: string;
  boundingBox?: { top: number; left: number; width: number; height: number };
}

export interface FeedbackItem {
  id: string;
  user_id?: string;
  raw_text: string;
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  page_url?: string;
  target_element?: TargetElement;
  ai_summary?: string;
  ai_category?: FeedbackCategory;
  ai_question_for_dev?: string;
  device_type?: DeviceType;
  context?: Record<string, unknown>;
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
}

export interface CustomCategory {
  id: string;
  label: string;
  icon?: string;
  color?: string;
}

export interface FeedbackConfig {
  appName: string;
  position: WidgetPosition;
  buttonColor?: string;
  buttonIcon?: 'message' | 'bug' | 'lightbulb' | 'help';
  features: {
    elementPicker: boolean;
    categories: boolean;
    severityLevels: boolean;
    anonymousSubmission: boolean;
    screenshotCapture?: boolean;
  };
  ai: {
    enabled: boolean;
    provider?: 'lovable' | 'openai';
    demoMode?: boolean;
    summarize: boolean;
    categorize: boolean;
    generateDevPrompt: boolean;
  };
  admin: {
    showStats: boolean;
    copyToClipboard: boolean;
    exportEnabled: boolean;
    statusUpdates: boolean;
  };
  categories?: CustomCategory[];
  onSubmit?: (feedback: FeedbackSubmission) => void;
  onError?: (error: Error) => void;
  onSuccess?: (feedback: FeedbackItem) => void;
}

export interface FeedbackSubmission {
  raw_text: string;
  category?: FeedbackCategory;
  severity?: FeedbackSeverity;
  page_url?: string;
  target_element?: TargetElement;
  screenshot?: string; // Base64 encoded screenshot
  context?: Record<string, unknown>;
}

export interface FeedbackButtonProps {
  config: FeedbackConfig;
  className?: string;
}

export interface FeedbackFormProps {
  config: FeedbackConfig;
  onSubmit: (data: FeedbackSubmission) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface ElementPickerProps {
  isActive: boolean;
  onSelect: (element: TargetElement) => void;
  onCancel: () => void;
}

export interface FeedbackDashboardProps {
  config: FeedbackConfig;
}

export interface FeedbackListProps {
  items: FeedbackItem[];
  onSelect: (item: FeedbackItem) => void;
  selectedId?: string;
  isLoading?: boolean;
}

export interface FeedbackDetailProps {
  item: FeedbackItem;
  config: FeedbackConfig;
  onStatusChange?: (status: FeedbackStatus) => void;
  onClose: () => void;
}

export interface FeedbackStatsProps {
  items: FeedbackItem[];
}

export interface UseFeedbackReturn {
  items: FeedbackItem[];
  isLoading: boolean;
  error: Error | null;
  submit: (data: FeedbackSubmission) => Promise<FeedbackItem>;
  updateStatus: (id: string, status: FeedbackStatus) => Promise<void>;
  refresh: () => void;
}

export interface UseFeedbackStatsReturn {
  totalCount: number;
  byCategory: Record<FeedbackCategory, number>;
  bySeverity: Record<FeedbackSeverity, number>;
  byStatus: Record<FeedbackStatus, number>;
  recentTrend: 'up' | 'down' | 'stable';
}
`;

const CONFIG_FILE = `/**
 * Feedback Widget - Configuration
 */

import type { FeedbackConfig, CustomCategory, WidgetTier } from '../types/feedback';

export const DEFAULT_CATEGORIES: CustomCategory[] = [
  { id: 'bug', label: 'Bug Report', icon: 'Bug', color: 'red' },
  { id: 'feature', label: 'Feature Request', icon: 'Lightbulb', color: 'blue' },
  { id: 'ui_ux', label: 'UI/UX Issue', icon: 'Palette', color: 'purple' },
  { id: 'suggestion', label: 'Suggestion', icon: 'MessageCircle', color: 'green' },
  { id: 'other', label: 'Other', icon: 'HelpCircle', color: 'gray' },
];

export const BASIC_PRESET: FeedbackConfig = {
  appName: 'My App',
  position: 'bottom-right',
  buttonIcon: 'message',
  features: { elementPicker: true, categories: true, severityLevels: false, anonymousSubmission: true },
  ai: { enabled: false, summarize: false, categorize: false, generateDevPrompt: false },
  admin: { showStats: false, copyToClipboard: false, exportEnabled: false, statusUpdates: false },
  categories: DEFAULT_CATEGORIES,
};

export const STANDARD_PRESET: FeedbackConfig = {
  ...BASIC_PRESET,
  features: { ...BASIC_PRESET.features, severityLevels: true },
  admin: { showStats: true, copyToClipboard: true, exportEnabled: true, statusUpdates: true },
};

export const PRO_PRESET: FeedbackConfig = {
  ...STANDARD_PRESET,
  ai: { enabled: true, provider: 'lovable', summarize: true, categorize: true, generateDevPrompt: true },
};

export function getPreset(tier: WidgetTier): FeedbackConfig {
  switch (tier) {
    case 'basic': return BASIC_PRESET;
    case 'standard': return STANDARD_PRESET;
    case 'pro': return PRO_PRESET;
    default: return BASIC_PRESET;
  }
}

export function createConfig(userConfig: Partial<FeedbackConfig>, baseTier: WidgetTier = 'basic'): FeedbackConfig {
  const preset = getPreset(baseTier);
  return {
    ...preset,
    ...userConfig,
    features: { ...preset.features, ...userConfig.features },
    ai: { ...preset.ai, ...userConfig.ai },
    admin: { ...preset.admin, ...userConfig.admin },
    categories: userConfig.categories || preset.categories,
  };
}

export function validateConfig(config: FeedbackConfig): string[] {
  const errors: string[] = [];
  if (!config.appName?.trim()) errors.push('appName is required');
  if (config.ai.enabled && !config.ai.provider) errors.push('AI provider must be specified when AI is enabled');
  return errors;
}
`;

const HOOKS_FILE = `/**
 * Feedback Widget - Data Hooks
 * 
 * UPDATE: Change the import path to match your Supabase client location
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client'; // <-- UPDATE THIS PATH
import type {
  FeedbackItem,
  FeedbackSubmission,
  FeedbackStatus,
  FeedbackCategory,
  FeedbackSeverity,
  UseFeedbackReturn,
  UseFeedbackStatsReturn,
} from '../types/feedback';

interface FeedbackHookConfig {
  aiEnabled?: boolean;
  userId?: string;
}

export function useFeedback(hookConfig: FeedbackHookConfig = {}): UseFeedbackReturn {
  const { aiEnabled = false, userId } = hookConfig;
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      setItems((data || []) as unknown as FeedbackItem[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch feedback'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const submit = useCallback(async (data: FeedbackSubmission): Promise<FeedbackItem> => {
    const functionName = aiEnabled ? 'submit-feedback-ai' : 'submit-feedback';
    const { data: result, error: submitError } = await supabase.functions.invoke(functionName, {
      body: { ...data, user_id: userId, page_url: data.page_url || window.location.href, device_type: getDeviceType() },
    });
    if (submitError) throw submitError;
    await fetchItems();
    return result as FeedbackItem;
  }, [aiEnabled, userId, fetchItems]);

  const updateStatus = useCallback(async (id: string, status: FeedbackStatus): Promise<void> => {
    const { error: updateError } = await supabase
      .from('feedback')
      .update({ status, updated_at: new Date().toISOString() } as any)
      .eq('id', id);
    if (updateError) throw updateError;
    setItems(prev => prev.map(item => item.id === id ? { ...item, status, updated_at: new Date().toISOString() } : item));
  }, []);

  return { items, isLoading, error, submit, updateStatus, refresh: fetchItems };
}

export function useFeedbackStats(items: FeedbackItem[]): UseFeedbackStatsReturn {
  return useMemo(() => {
    const byCategory: Record<FeedbackCategory, number> = { bug: 0, feature: 0, ui_ux: 0, suggestion: 0, other: 0 };
    const bySeverity: Record<FeedbackSeverity, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    const byStatus: Record<FeedbackStatus, number> = { pending: 0, reviewed: 0, resolved: 0, dismissed: 0 };

    items.forEach(item => {
      if (byCategory[item.category] !== undefined) byCategory[item.category]++;
      if (bySeverity[item.severity] !== undefined) bySeverity[item.severity]++;
      if (byStatus[item.status] !== undefined) byStatus[item.status]++;
    });

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const recentCount = items.filter(item => new Date(item.created_at) >= weekAgo).length;
    const previousCount = items.filter(item => new Date(item.created_at) >= twoWeeksAgo && new Date(item.created_at) < weekAgo).length;

    let recentTrend: 'up' | 'down' | 'stable' = 'stable';
    if (recentCount > previousCount * 1.2) recentTrend = 'up';
    else if (recentCount < previousCount * 0.8) recentTrend = 'down';

    return { totalCount: items.length, byCategory, bySeverity, byStatus, recentTrend };
  }, [items]);
}

export function useFeedbackFilters(items: FeedbackItem[]) {
  const [filters, setFilters] = useState<{ category?: FeedbackCategory; severity?: FeedbackSeverity; status?: FeedbackStatus; search?: string }>({});

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.severity && item.severity !== filters.severity) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!item.raw_text.toLowerCase().includes(searchLower) && !item.ai_summary?.toLowerCase().includes(searchLower)) return false;
      }
      return true;
    });
  }, [items, filters]);

  return {
    filteredItems,
    filters,
    setCategory: (c?: FeedbackCategory) => setFilters(f => ({ ...f, category: c })),
    setSeverity: (s?: FeedbackSeverity) => setFilters(f => ({ ...f, severity: s })),
    setStatus: (s?: FeedbackStatus) => setFilters(f => ({ ...f, status: s })),
    setSearch: (s?: string) => setFilters(f => ({ ...f, search: s })),
    clearFilters: () => setFilters({}),
  };
}

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}
`;

const INDEX_FILE = `/**
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

const QUICKSTART_FILE = `/**
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

const FEEDBACK_BUTTON_FILE = `/**
 * Feedback Button - Floating button that opens the feedback form
 * 
 * Requires: framer-motion
 * npm install framer-motion
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackForm } from './FeedbackForm';
import { useFeedback } from '../../hooks/useFeedback';
import type { FeedbackButtonProps, FeedbackSubmission, WidgetPosition } from '../../types/feedback';

const MessageIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const CheckIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>;

const getPositionStyles = (position: WidgetPosition): React.CSSProperties => {
  const base: React.CSSProperties = { position: 'fixed', zIndex: 9999 };
  switch (position) {
    case 'bottom-right': return { ...base, bottom: 20, right: 20 };
    case 'bottom-left': return { ...base, bottom: 20, left: 20 };
    case 'top-right': return { ...base, top: 20, right: 20 };
    case 'top-left': return { ...base, top: 20, left: 20 };
    default: return { ...base, bottom: 20, right: 20 };
  }
};

export function FeedbackButton({ config, className }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { submit } = useFeedback({ aiEnabled: config.ai?.enabled });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) setIsOpen(false); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSubmit = useCallback(async (data: FeedbackSubmission) => {
    setIsSubmitting(true);
    try {
      config.onSubmit?.(data);
      const result = await submit(data);
      config.onSuccess?.(result);
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); setIsOpen(false); }, 2000);
    } catch (error) {
      config.onError?.(error instanceof Error ? error : new Error('Submission failed'));
    } finally {
      setIsSubmitting(false);
    }
  }, [config, submit]);

  const buttonColor = config.buttonColor || '#3b82f6';
  const isBottom = config.position.startsWith('bottom');
  const isRight = config.position.endsWith('right');

  return (
    <div style={getPositionStyles(config.position)} className={className}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: buttonColor, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
      >
        {isOpen ? <CloseIcon /> : <MessageIcon />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ position: 'absolute', [isBottom ? 'bottom' : 'top']: 64, [isRight ? 'right' : 'left']: 0, width: 360, backgroundColor: 'white', borderRadius: 12, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)', overflow: 'hidden' }}
          >
            {showSuccess ? (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#22c55e' }}><CheckIcon /></div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#22c55e' }}>Thank you!</div>
                <div style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Your feedback has been submitted.</div>
              </div>
            ) : (
              <FeedbackForm config={config} onSubmit={handleSubmit} onCancel={() => setIsOpen(false)} isSubmitting={isSubmitting} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FeedbackButton;
`;

const FEEDBACK_FORM_FILE = `/**
 * Feedback Form Component
 */

import React, { useState, useCallback } from 'react';
import { ElementPicker } from './ElementPicker';
import type { FeedbackFormProps, FeedbackSubmission, FeedbackCategory, FeedbackSeverity, TargetElement } from '../../types/feedback';

const CATEGORIES: { value: FeedbackCategory; label: string; emoji: string }[] = [
  { value: 'bug', label: 'Bug', emoji: '🐛' },
  { value: 'feature', label: 'Feature', emoji: '✨' },
  { value: 'ui_ux', label: 'Design', emoji: '🎨' },
  { value: 'suggestion', label: 'Idea', emoji: '💡' },
  { value: 'other', label: 'Other', emoji: '📝' },
];

const SEVERITIES: { value: FeedbackSeverity; label: string; color: string }[] = [
  { value: 'low', label: 'Minor', color: '#22c55e' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'Major', color: '#f97316' },
  { value: 'critical', label: 'Critical', color: '#ef4444' },
];

export function FeedbackForm({ config, onSubmit, onCancel, isSubmitting }: FeedbackFormProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('other');
  const [severity, setSeverity] = useState<FeedbackSeverity>('medium');
  const [targetElement, setTargetElement] = useState<TargetElement | null>(null);
  const [isPickingElement, setIsPickingElement] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const submission: FeedbackSubmission = {
      raw_text: text.trim(),
      category: config.features.categories ? category : undefined,
      severity: config.features.severityLevels ? severity : undefined,
      target_element: targetElement || undefined,
      page_url: window.location.href,
    };
    await onSubmit(submission);
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Send Feedback</h3>
          <button type="button" onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        {config.features.categories && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                style={{ padding: 10, border: category === cat.value ? '2px solid #3b82f6' : '2px solid transparent', borderRadius: 8, background: category === cat.value ? '#eff6ff' : '#f9fafb', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 16 }}>{cat.emoji}</span>
                <span style={{ fontSize: 10, color: '#6b7280' }}>{cat.label}</span>
              </button>
            ))}
          </div>
        )}

        {config.features.severityLevels && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {SEVERITIES.map(sev => (
              <button key={sev.value} type="button" onClick={() => setSeverity(sev.value)}
                style={{ padding: 8, border: severity === sev.value ? \`2px solid \${sev.color}\` : '1px solid #e5e7eb', borderRadius: 6, background: severity === sev.value ? \`\${sev.color}15\` : 'transparent', color: severity === sev.value ? sev.color : '#6b7280', cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
                {sev.label}
              </button>
            ))}
          </div>
        )}

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Your feedback</label>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>{text.length}/500</span>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value.slice(0, 500))} placeholder="Describe your feedback..." style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, resize: 'none', minHeight: 100, fontSize: 14, boxSizing: 'border-box' }} required />
        </div>

        {config.features.elementPicker && (
          targetElement ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3b82f6' }}>
                <span>🎯</span>
                <span style={{ fontWeight: 500 }}>&lt;{targetElement.tagName}&gt;</span>
              </div>
              <button type="button" onClick={() => setTargetElement(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>
          ) : (
            <button type="button" onClick={() => setIsPickingElement(true)} style={{ padding: 12, border: '1px dashed #d1d5db', borderRadius: 8, background: 'transparent', cursor: 'pointer', color: '#6b7280', fontSize: 13 }}>
              🎯 Target a specific element
            </button>
          )
        )}

        <button type="submit" disabled={!text.trim() || isSubmitting}
          style={{ padding: 12, border: 'none', borderRadius: 8, background: !text.trim() || isSubmitting ? '#e5e7eb' : '#3b82f6', color: 'white', fontWeight: 600, cursor: !text.trim() || isSubmitting ? 'not-allowed' : 'pointer', fontSize: 14 }}>
          {isSubmitting ? 'Sending...' : 'Submit'}
        </button>
      </form>

      <ElementPicker isActive={isPickingElement} onSelect={(el) => { setTargetElement(el); setIsPickingElement(false); }} onCancel={() => setIsPickingElement(false)} />
    </>
  );
}

export default FeedbackForm;
`;

const ELEMENT_PICKER_FILE = `/**
 * Element Picker - Visual element selection overlay
 */

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { ElementPickerProps, TargetElement } from '../../types/feedback';

function generateSelector(element: HTMLElement): string {
  if (element.id) return \`#\${element.id}\`;
  const path: string[] = [];
  let current: HTMLElement | null = element;
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    if (current.className && typeof current.className === 'string') {
      const classes = current.className.split(' ').filter(c => c.trim()).slice(0, 2).join('.');
      if (classes) selector += \`.\${classes}\`;
    }
    path.unshift(selector);
    current = current.parentElement;
  }
  return path.join(' > ');
}

export function ElementPicker({ isActive, onSelect, onCancel }: ElementPickerProps) {
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-feedback-picker]')) return;
    setHighlightRect(target.getBoundingClientRect());
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (target.closest('[data-feedback-picker]')) return;
    const elementData: TargetElement = {
      selector: generateSelector(target),
      tagName: target.tagName.toLowerCase(),
      className: target.className || '',
      textPreview: (target.textContent || '').slice(0, 100).trim(),
      boundingBox: { top: target.getBoundingClientRect().top, left: target.getBoundingClientRect().left, width: target.getBoundingClientRect().width, height: target.getBoundingClientRect().height },
    };
    onSelect(elementData);
  }, [onSelect]);

  useEffect(() => {
    if (!isActive) return;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);
    document.body.style.cursor = 'crosshair';
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.cursor = '';
    };
  }, [isActive, handleMouseMove, handleClick, onCancel]);

  if (!isActive) return null;

  return createPortal(
    <div data-feedback-picker="true">
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.1)', zIndex: 99998, pointerEvents: 'none' }} />
      {highlightRect && (
        <div style={{ position: 'fixed', top: highlightRect.top - 2, left: highlightRect.left - 2, width: highlightRect.width + 4, height: highlightRect.height + 4, border: '2px solid #3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 4, zIndex: 99999, pointerEvents: 'none' }} />
      )}
      <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1f2937', color: 'white', padding: '12px 24px', borderRadius: 8, zIndex: 100000, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span>Click on any element to select it</span>
        <button onClick={onCancel} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>Cancel (Esc)</button>
      </div>
    </div>,
    document.body
  );
}

export default ElementPicker;
`;

const FEEDBACK_DASHBOARD_FILE = `/**
 * Feedback Dashboard - Admin interface for managing feedback
 * 
 * See full implementation at: https://github.com/thecardsguy/feedback-chatbot
 */

import React, { useState, useCallback } from 'react';
import { FeedbackStats } from './FeedbackStats';
import { FeedbackList } from './FeedbackList';
import { FeedbackDetail } from './FeedbackDetail';
import { useFeedback, useFeedbackFilters } from '../../hooks/useFeedback';
import type { FeedbackDashboardProps, FeedbackItem, FeedbackStatus } from '../../types/feedback';

export function FeedbackDashboard({ config }: FeedbackDashboardProps) {
  const { items, isLoading, refresh, updateStatus } = useFeedback({ aiEnabled: config.ai.enabled });
  const { filteredItems, setSearch, clearFilters } = useFeedbackFilters(items);
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);

  const handleStatusChange = useCallback(async (status: FeedbackStatus) => {
    if (!selectedItem) return;
    await updateStatus(selectedItem.id, status);
    setSelectedItem(prev => prev ? { ...prev, status } : null);
  }, [selectedItem, updateStatus]);

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Feedback Dashboard</h1>
          <p style={{ margin: '4px 0 0', color: '#6b7280' }}>{items.length} feedback items</p>
        </div>
        <button onClick={refresh} style={{ padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: 6, background: 'white', cursor: 'pointer' }}>Refresh</button>
      </div>

      {config.admin.showStats && <div style={{ marginBottom: 24 }}><FeedbackStats items={items} /></div>}

      <input type="text" placeholder="Search feedback..." onChange={e => setSearch(e.target.value || undefined)} style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 16, fontSize: 14 }} />

      <div style={{ display: 'grid', gridTemplateColumns: selectedItem ? '1fr 400px' : '1fr', gap: 24 }}>
        <FeedbackList items={filteredItems} onSelect={setSelectedItem} selectedId={selectedItem?.id} isLoading={isLoading} />
        {selectedItem && <FeedbackDetail item={selectedItem} config={config} onStatusChange={config.admin.statusUpdates ? handleStatusChange : undefined} onClose={() => setSelectedItem(null)} />}
      </div>
    </div>
  );
}

export default FeedbackDashboard;
`;

const FEEDBACK_LIST_FILE = `/**
 * Feedback List - Displays feedback items
 */

import React from 'react';
import type { FeedbackListProps } from '../../types/feedback';

const CATEGORY_STYLES = {
  bug: { bg: '#fef2f2', text: '#dc2626', emoji: '🐛' },
  feature: { bg: '#eff6ff', text: '#2563eb', emoji: '✨' },
  ui_ux: { bg: '#f5f3ff', text: '#7c3aed', emoji: '🎨' },
  suggestion: { bg: '#f0fdf4', text: '#16a34a', emoji: '💡' },
  other: { bg: '#f9fafb', text: '#4b5563', emoji: '📝' },
};

const STATUS_STYLES = {
  pending: { bg: '#fef3c7', text: '#d97706' },
  reviewed: { bg: '#dbeafe', text: '#2563eb' },
  resolved: { bg: '#dcfce7', text: '#16a34a' },
  dismissed: { bg: '#f3f4f6', text: '#6b7280' },
};

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return \`\${Math.floor(seconds / 60)}m ago\`;
  if (seconds < 86400) return \`\${Math.floor(seconds / 3600)}h ago\`;
  return date.toLocaleDateString();
}

export function FeedbackList({ items, onSelect, selectedId, isLoading }: FeedbackListProps & { showAIBadge?: boolean }) {
  if (isLoading) return <div style={{ textAlign: 'center', padding: 48, color: '#6b7280' }}>Loading...</div>;
  if (items.length === 0) return <div style={{ textAlign: 'center', padding: 48 }}><div style={{ fontSize: 48, marginBottom: 16 }}>📭</div><div style={{ color: '#374151' }}>No feedback yet</div></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map(item => {
        const catStyle = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.other;
        const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.pending;
        return (
          <div key={item.id} onClick={() => onSelect(item)} style={{ padding: 16, border: '1px solid', borderColor: selectedId === item.id ? '#3b82f6' : '#e5e7eb', borderRadius: 8, backgroundColor: selectedId === item.id ? '#f0f9ff' : 'white', cursor: 'pointer' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span style={{ padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, backgroundColor: catStyle.bg, color: catStyle.text }}>{catStyle.emoji} {item.category}</span>
              <span style={{ padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, backgroundColor: statusStyle.bg, color: statusStyle.text }}>{item.status}</span>
            </div>
            <div style={{ fontSize: 14, color: '#374151', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.ai_summary || item.raw_text}</div>
            <div style={{ marginTop: 12, fontSize: 11, color: '#9ca3af' }}>{getTimeAgo(new Date(item.created_at))}</div>
          </div>
        );
      })}
    </div>
  );
}

export default FeedbackList;
`;

const FEEDBACK_DETAIL_FILE = `/**
 * Feedback Detail - Single feedback item view
 */

import React, { useState, useCallback } from 'react';
import type { FeedbackDetailProps, FeedbackStatus } from '../../types/feedback';

const STATUS_OPTIONS: { value: FeedbackStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'dismissed', label: 'Dismissed' },
];

export function FeedbackDetail({ item, config, onStatusChange, onClose }: FeedbackDetailProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    const parts = [\`# User Feedback\`, \`Category: \${item.category}\`, \`Severity: \${item.severity}\`, \`\`, item.raw_text];
    if (item.ai_summary) parts.push(\`\`, \`## AI Summary\`, item.ai_summary);
    if (item.ai_question_for_dev) parts.push(\`\`, \`## AI Question\`, item.ai_question_for_dev);
    navigator.clipboard.writeText(parts.join('\\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [item]);

  return (
    <div style={{ padding: 24, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Feedback Details</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, padding: 16, backgroundColor: '#f9fafb', borderRadius: 8, marginBottom: 20 }}>
        <div><div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase' }}>Category</div><div style={{ fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>{item.category}</div></div>
        <div><div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase' }}>Severity</div><div style={{ fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>{item.severity}</div></div>
        <div><div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase' }}>Status</div><div style={{ fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>{item.status}</div></div>
        <div><div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase' }}>Submitted</div><div style={{ fontSize: 14 }}>{new Date(item.created_at).toLocaleDateString()}</div></div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8, textTransform: 'uppercase' }}>Original Feedback</div>
        <div style={{ fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{item.raw_text}</div>
      </div>

      {item.ai_summary && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8, textTransform: 'uppercase' }}>✨ AI Summary</div>
          <div style={{ padding: 12, backgroundColor: '#faf5ff', borderRadius: 8, borderLeft: '3px solid #8b5cf6', fontSize: 14, lineHeight: 1.6 }}>{item.ai_summary}</div>
        </div>
      )}

      {item.ai_question_for_dev && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8, textTransform: 'uppercase' }}>✨ AI Question for Developer</div>
          <div style={{ padding: 12, backgroundColor: '#faf5ff', borderRadius: 8, borderLeft: '3px solid #8b5cf6', fontSize: 14, lineHeight: 1.6 }}>{item.ai_question_for_dev}</div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
        {config.admin.statusUpdates && onStatusChange && (
          <select value={item.status} onChange={e => onStatusChange(e.target.value as FeedbackStatus)} style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}>
            {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        )}
        {config.admin.copyToClipboard && (
          <button onClick={copyToClipboard} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', backgroundColor: '#1f2937', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            {copied ? '✓ Copied!' : 'Copy as Prompt'}
          </button>
        )}
      </div>
    </div>
  );
}

export default FeedbackDetail;
`;

const FEEDBACK_STATS_FILE = `/**
 * Feedback Stats - Statistics overview
 */

import React from 'react';
import type { FeedbackStatsProps } from '../../types/feedback';
import { useFeedbackStats } from '../../hooks/useFeedback';

export function FeedbackStats({ items }: FeedbackStatsProps) {
  const stats = useFeedbackStats(items);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <div style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>TOTAL</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.totalCount}</div>
      </div>
      <div style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>PENDING</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#f97316' }}>{stats.byStatus.pending}</div>
      </div>
      <div style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>RESOLVED</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#22c55e' }}>{stats.byStatus.resolved}</div>
      </div>
      <div style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>CRITICAL</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#ef4444' }}>{stats.bySeverity.critical}</div>
      </div>
    </div>
  );
}

export default FeedbackStats;
`;

const EDGE_FUNCTION_BASIC = `import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  try {
    const payload = await req.json()
    if (!payload.raw_text || payload.raw_text.length < 5) {
      return new Response(JSON.stringify({ error: 'Feedback text is required (min 5 chars)' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const { data: feedback, error } = await supabase
      .from('feedback')
      .insert({
        raw_text: payload.raw_text.slice(0, 5000),
        category: payload.category || 'other',
        severity: payload.severity || 'medium',
        page_url: payload.page_url,
        target_element: payload.target_element,
        device_type: payload.device_type,
        status: 'pending',
        context: { user_agent: req.headers.get('user-agent'), submitted_at: new Date().toISOString() },
      })
      .select('id')
      .single()

    if (error) throw error
    return new Response(JSON.stringify({ success: true, id: feedback.id }), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Failed to submit feedback' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
`;

const EDGE_FUNCTION_AI = `import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// IMPORTANT: In production, restrict CORS to your domain:
// const corsHeaders = { 'Access-Control-Allow-Origin': 'https://yourdomain.com', ... };
const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

// Demo responses for testing without AI API key
const DEMO_RESPONSES = {
  bug: { summary: "User reports a bug that needs investigation.", category: "bug", question: "What specific steps led to this bug?" },
  feature: { summary: "User is requesting a new feature.", category: "feature_request", question: "How would this feature improve the experience?" },
  ui_ux: { summary: "User has feedback about the UI/UX design.", category: "ui_ux", question: "What specific UI element is causing issues?" },
  suggestion: { summary: "User has a suggestion for improvement.", category: "suggestion", question: "What problem would this suggestion solve?" },
  other: { summary: "User has provided general feedback.", category: "other", question: "What additional context would help?" },
};

// NOTE: For rate limiting in production, consider using Supabase Edge Functions with Redis
// or implement IP-based rate limiting via a reverse proxy (Cloudflare, etc.)

function getDemoResponse(category: string) {
  const response = DEMO_RESPONSES[category as keyof typeof DEMO_RESPONSES] || DEMO_RESPONSES.other;
  return { ai_summary: \`[DEMO] \${response.summary}\`, ai_category: response.category, ai_question_for_dev: \`[DEMO] \${response.question}\` };
}

async function enhanceWithAI(feedbackData: any) {
  if (feedbackData.demo_mode) return getDemoResponse(feedbackData.category || 'other');
  
  const apiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!apiKey) return getDemoResponse(feedbackData.category || 'other');

  try {
    const prompt = \`Analyze this feedback and provide: 1. Brief summary (1-2 sentences) 2. Category (bug, feature_request, ux_issue, other) 3. Question for developer. Feedback: "\${feedbackData.raw_text}" Respond in JSON: { "summary": "...", "category": "...", "question_for_dev": "..." }\`;
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${apiKey}\`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'google/gemini-3-flash-preview', messages: [{ role: 'system', content: 'You analyze user feedback. Respond with valid JSON.' }, { role: 'user', content: prompt }], max_tokens: 500, temperature: 0.3 }),
    });

    if (!response.ok) return getDemoResponse(feedbackData.category || 'other');
    
    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;
    if (!content) return getDemoResponse(feedbackData.category || 'other');
    
    const jsonMatch = content.match(/\\{[\\s\\S]*\\}/);
    if (!jsonMatch) return getDemoResponse(feedbackData.category || 'other');
    
    const parsed = JSON.parse(jsonMatch[0]);
    return { ai_summary: parsed.summary || null, ai_category: parsed.category || null, ai_question_for_dev: parsed.question_for_dev || null };
  } catch { return getDemoResponse(feedbackData.category || 'other'); }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  try {
    const payload = await req.json();
    if (!payload.raw_text?.trim()) return new Response(JSON.stringify({ error: 'Feedback text is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const isDemoMode = payload.demo_mode || !Deno.env.get('LOVABLE_API_KEY');
    const aiEnhancement = await enhanceWithAI(payload);

    const { data, error } = await supabase.from('feedback').insert({
      raw_text: payload.raw_text.slice(0, 5000),
      category: payload.category || 'other',
      severity: payload.severity || 'medium',
      page_url: payload.page_url,
      target_element: payload.target_element,
      device_type: payload.device_type,
      status: 'pending',
      context: { demo_mode: isDemoMode },
      ...aiEnhancement,
    }).select('id').single();

    if (error) throw error;
    return new Response(JSON.stringify({ success: true, id: data.id, demo_mode: isDemoMode, ...aiEnhancement }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
`;

const DATABASE_SQL = `-- Feedback Widget - Database Setup
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

const README_FILE = `# Feedback Widget Template

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

export default DownloadTemplate;
