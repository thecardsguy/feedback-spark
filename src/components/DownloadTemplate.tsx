/**
 * Download Template Component
 * 
 * Creates a downloadable ZIP file containing all template files.
 * Template contents are imported from separate files for maintainability.
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

// Import all template contents from organized files
import {
  TYPES_FILE,
  CONFIG_FILE,
  HOOKS_FILE,
  FEEDBACK_BUTTON_FILE,
  FEEDBACK_FORM_FILE,
  ELEMENT_PICKER_FILE,
  FEEDBACK_DASHBOARD_FILE,
  FEEDBACK_LIST_FILE,
  FEEDBACK_DETAIL_FILE,
  FEEDBACK_STATS_FILE,
  EDGE_FUNCTION_BASIC,
  EDGE_FUNCTION_AI,
  DATABASE_SQL,
  INDEX_FILE,
  QUICKSTART_FILE,
  README_FILE,
} from './download/templates';

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

      // Types
      zip.file('feedback/types/feedback.ts', TYPES_FILE);

      // Config
      zip.file('feedback/config/feedback.config.ts', CONFIG_FILE);

      // Hooks
      zip.file('feedback/hooks/useFeedback.ts', HOOKS_FILE);

      // User Components
      zip.file('feedback/components/user/FeedbackButton.tsx', FEEDBACK_BUTTON_FILE);
      zip.file('feedback/components/user/FeedbackForm.tsx', FEEDBACK_FORM_FILE);
      zip.file('feedback/components/user/ElementPicker.tsx', ELEMENT_PICKER_FILE);

      // Admin Components
      zip.file('feedback/components/admin/FeedbackDashboard.tsx', FEEDBACK_DASHBOARD_FILE);
      zip.file('feedback/components/admin/FeedbackList.tsx', FEEDBACK_LIST_FILE);
      zip.file('feedback/components/admin/FeedbackDetail.tsx', FEEDBACK_DETAIL_FILE);
      zip.file('feedback/components/admin/FeedbackStats.tsx', FEEDBACK_STATS_FILE);

      // Exports
      zip.file('feedback/index.ts', INDEX_FILE);
      zip.file('feedback/QuickStart.tsx', QUICKSTART_FILE);

      // Edge Functions
      zip.file('supabase/functions/submit-feedback/index.ts', EDGE_FUNCTION_BASIC);
      zip.file('supabase/functions/submit-feedback-ai/index.ts', EDGE_FUNCTION_AI);

      // Database
      zip.file('database.sql', DATABASE_SQL);

      // README
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

export default DownloadTemplate;
