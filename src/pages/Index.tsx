import { useState } from 'react';
import { FeedbackWidget } from '@/feedback';
import { MessageSquare, Zap, Shield, Sparkles, ArrowRight, MousePointer2, CreditCard, Clock, Bot, Copy, Check, Code, Brain, Download, BookOpen, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccuracyTest from '@/components/AccuracyTest';
import SetupGuide from '@/components/SetupGuide';
import SetupVerification from '@/components/SetupVerification';

const Index = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const quickStartCode = `// 1. Import the widget
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

  const withOptionsCode = `// With customization
<FeedbackWidget
  appName="MyApp"
  position="bottom-left"
  enableAI={true}
  showElementPicker={true}
  buttonColor="#3b82f6"
  onSubmit={(id) => console.log('Submitted:', id)}
/>`;

  const advancedCode = `// Full control with config
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Drop-in Template</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Feedback Widget
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            One component. Zero configuration. Add AI-powered feedback collection to your app in under a minute.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button size="lg" asChild>
              <a href="#implementation">
                <Download className="w-4 h-4 mr-2" />
                Get the Template
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/demo">
                Try Live Demo
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link to="/admin">
                View Admin
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          {/* Quick Setup Verification */}
          <div className="max-w-xl mx-auto">
            <SetupVerification />
          </div>
        </div>
      </header>

      {/* Quick Start - The Main Focus */}
      <section className="bg-card border-y border-border">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 mb-4">
              <Code className="w-4 h-4" />
              <span className="text-sm font-medium">3 Lines of Code</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              The Simplest Integration Ever
            </h2>
            <p className="text-lg text-muted-foreground">
              Import it. Use it. Done. No configuration required.
            </p>
          </div>

          <Tabs defaultValue="quick" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="quick">Quick Start</TabsTrigger>
              <TabsTrigger value="options">With Options</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="quick">
              <Card className="overflow-hidden bg-muted/30">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">App.tsx</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyCode(quickStartCode, 'quick')}
                    className="gap-2"
                  >
                    {copied === 'quick' ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <pre className="p-6 overflow-x-auto text-sm">
                  <code className="text-foreground">{quickStartCode}</code>
                </pre>
              </Card>
            </TabsContent>

            <TabsContent value="options">
              <Card className="overflow-hidden bg-muted/30">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">With customization</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyCode(withOptionsCode, 'options')}
                    className="gap-2"
                  >
                    {copied === 'options' ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <pre className="p-6 overflow-x-auto text-sm">
                  <code className="text-foreground">{withOptionsCode}</code>
                </pre>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card className="overflow-hidden bg-muted/30">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Full configuration</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyCode(advancedCode, 'advanced')}
                    className="gap-2"
                  >
                    {copied === 'advanced' ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <pre className="p-6 overflow-x-auto text-sm">
                  <code className="text-foreground">{advancedCode}</code>
                </pre>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Copy the <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">src/feedback</code> folder 
              to your project. That's the entire template.
            </p>
          </div>
        </div>
      </section>

      {/* AI Accuracy Testing Section */}
      <section className="bg-gradient-to-b from-background to-primary/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <AccuracyTest />
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why This Template?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for developers who want to ship fast without sacrificing quality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-card/60">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <MousePointer2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Element Targeting</h3>
            <p className="text-sm text-muted-foreground">
              Users can click any element to highlight exactly what they're reporting.
            </p>
          </Card>

          <Card className="p-6 bg-card/60">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Save Prompts</h3>
            <p className="text-sm text-muted-foreground">
              Precise feedback = fewer wasted AI prompts when fixing issues.
            </p>
          </Card>

          <Card className="p-6 bg-card/60">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Batch Issues</h3>
            <p className="text-sm text-muted-foreground">
              Queue issues as you find them, fix them all at once later.
            </p>
          </Card>

          <Card className="p-6 bg-card/60">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">AI Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Auto-categorize, summarize, and generate dev prompts.
            </p>
          </Card>
        </div>
      </section>

      {/* Tiers */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Three Tiers, One Template
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">Basic</h3>
              <p className="text-muted-foreground mb-4">
                Simple feedback collection for any app.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Floating button</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Category selection</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Element picker</li>
              </ul>
            </Card>

            <Card className="p-6 border-2 border-primary hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Popular
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">Standard</h3>
              <p className="text-muted-foreground mb-4">
                Admin dashboard to manage feedback.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Everything in Basic</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Admin dashboard</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Status management</li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">Pro</h3>
              <p className="text-muted-foreground mb-4">
                AI-powered insights and automation.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Everything in Standard</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> AI categorization</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Developer prompts</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Implementation Guide */}
      <section id="implementation" className="border-t border-border bg-background">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <SetupGuide />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-muted-foreground">
          <p>
            Feedback Widget Template • MIT License • 
            <Link to="/admin" className="text-primary hover:underline ml-1">Admin</Link>
            {' • '}
            <Link to="/demo" className="text-primary hover:underline">Demo</Link>
            {' • '}
            <Link to="/setup" className="text-primary hover:underline">Setup Wizard</Link>
          </p>
        </div>
      </footer>

      {/* The Feedback Widget - Using the simple component */}
      <FeedbackWidget appName="Feedback Template" enableAI />
    </div>
  );
};

export default Index;
