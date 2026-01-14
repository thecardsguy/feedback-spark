/**
 * Quick Start Section Component
 * Code tabs with copy functionality showing integration examples
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const QUICK_START_CODE = `// 1. Import the widget
import { FeedbackWidget } from '@/feedback';

// 2. Add it to your app (that's it!)
function App() {
  return (
    <div>
      {/* Your app content */}
      <FeedbackWidget />
    </div>
  );
}`;

const WITH_OPTIONS_CODE = `// With customization
<FeedbackWidget
  appName="MyApp"
  position="bottom-left"
  enableAI={true}
  showElementPicker={true}
  buttonColor="#3b82f6"
  onSubmit={(id) => console.log('Submitted:', id)}
/>`;

const ADVANCED_CODE = `// Full control with config
import { FeedbackButton, createConfig } from '@/feedback';

const config = createConfig({
  appName: 'MyApp',
  position: 'bottom-right',
  features: {
    elementPicker: true,
    categories: true,
    severityLevels: true,
  },
  ai: {
    enabled: true,
    summarize: true,
    categorize: true,
  },
}, 'pro');

<FeedbackButton config={config} />`;

const CODE_TABS = [
  { value: 'quick', code: QUICK_START_CODE, title: 'App.tsx' },
  { value: 'options', code: WITH_OPTIONS_CODE, title: 'With customization' },
  { value: 'advanced', code: ADVANCED_CODE, title: 'Full configuration' },
];

export function QuickStartSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="relative border-y border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container-custom section-spacing-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 bg-green-500/10 text-green-600 border-green-500/20">
            <Code className="w-3.5 h-3.5 mr-2" />
            3 Lines of Code
          </Badge>
          <h2 className="text-fluid-lg font-bold text-foreground mb-4">
            The Simplest Integration Ever
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Import it. Use it. Done. No configuration required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Tabs defaultValue="quick" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 h-12 p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="quick" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Quick Start</TabsTrigger>
              <TabsTrigger value="options" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">With Options</TabsTrigger>
              <TabsTrigger value="advanced" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Advanced</TabsTrigger>
            </TabsList>

            {CODE_TABS.map(({ value, code, title }) => (
              <TabsContent key={value} value={value}>
                <Card className="overflow-hidden glass border-border/50">
                  <div className="code-block-header">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{title}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyCode(code, value)}
                      className="gap-2 h-8"
                    >
                      {copied === value ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-green-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="p-6 overflow-x-auto text-sm leading-relaxed">
                    <code className="text-foreground font-mono">{code}</code>
                  </pre>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Copy the <code className="px-2 py-1 rounded-md bg-muted text-foreground font-mono text-xs">src/feedback</code> folder to your project. That's the entire template.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default QuickStartSection;
