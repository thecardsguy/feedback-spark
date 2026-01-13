import { useState } from 'react';
import { motion } from 'framer-motion';
import { FeedbackWidget } from '@/feedback';
import { MessageSquare, Zap, Shield, Sparkles, ArrowRight, MousePointer2, CreditCard, Clock, Brain, Copy, Check, Code, Download, Github, ExternalLink, Package, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccuracyTest from '@/components/AccuracyTest';
import SetupGuide from '@/components/SetupGuide';
import TierComparison from '@/components/TierComparison';

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

  const features = [
    {
      icon: MousePointer2,
      title: 'Element Targeting',
      description: 'Users can click any element to highlight exactly what they\'re reporting.',
      gradient: 'from-primary/20 to-primary/5',
      iconColor: 'text-primary',
    },
    {
      icon: CreditCard,
      title: 'Save Prompts',
      description: 'Precise feedback = fewer wasted AI prompts when fixing issues.',
      gradient: 'from-green-500/20 to-green-500/5',
      iconColor: 'text-green-500',
    },
    {
      icon: Clock,
      title: 'Batch Issues',
      description: 'Queue issues as you find them, fix them all at once later.',
      gradient: 'from-orange-500/20 to-orange-500/5',
      iconColor: 'text-orange-500',
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Auto-categorize, summarize, and generate dev prompts.',
      gradient: 'from-purple-500/20 to-purple-500/5',
      iconColor: 'text-purple-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />

        <div className="relative container-custom py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Drop-in Template</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.div>

            {/* Heading */}
            <h1 className="text-fluid-xl font-extrabold text-foreground mb-6 tracking-tight">
              Feedback Widget{' '}
              <span className="gradient-text">for Developers</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              One component. Zero configuration. Add AI-powered feedback collection to your app in under a minute.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button size="lg" className="h-12 px-6 text-base gap-2 shadow-lg hover:shadow-xl transition-shadow" asChild>
                <a href="#implementation">
                  <Download className="w-5 h-5" />
                  Get the Template
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6 text-base glass" asChild>
                <Link to="/demo">
                  Try Live Demo
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="h-12 px-6 text-base" asChild>
                <Link to="/admin">
                  View Admin
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Quick Start Section */}
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

              {[
                { value: 'quick', code: quickStartCode, title: 'App.tsx' },
                { value: 'options', code: withOptionsCode, title: 'With customization' },
                { value: 'advanced', code: advancedCode, title: 'Full configuration' },
              ].map(({ value, code, title }) => (
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

      {/* AI Accuracy Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="relative container-custom section-spacing-sm">
          <AccuracyTest />
        </div>
      </section>

      {/* Features Grid */}
      <section className="container-custom section-spacing">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-fluid-lg font-bold text-foreground mb-4">
            Why This Template?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for developers who want to ship fast without sacrificing quality.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="p-6 h-full card-interactive group">
                <div className={`feature-icon bg-gradient-to-br ${feature.gradient} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Tiers Comparison */}
      <section className="border-y border-border/50 bg-muted/30">
        <div className="container-custom section-spacing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-fluid-lg font-bold text-foreground mb-4">
              Three Tiers, One Template
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              All tiers included in the download. Enable features as needed.
            </p>
          </motion.div>

          {/* Tier Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {[
              { icon: MessageSquare, title: 'Basic', description: 'Simple feedback collection for any app. No backend required.', highlight: false, gradient: 'from-muted to-muted' },
              { icon: Zap, title: 'Standard', description: 'Full admin dashboard with statistics and status management.', highlight: true, gradient: 'from-primary/20 to-primary/5' },
              { icon: Shield, title: 'Pro', description: 'AI-powered summarization, categorization, and developer prompts.', highlight: false, gradient: 'from-purple-500/20 to-purple-500/5' },
            ].map((tier, index) => (
              <motion.div key={tier.title} variants={itemVariants}>
                <Card className={`p-6 h-full relative card-interactive ${tier.highlight ? 'border-2 border-primary ring-4 ring-primary/10' : ''}`}>
                  {tier.highlight && (
                    <Badge className="absolute -top-3 left-6 bg-primary text-primary-foreground shadow-lg">
                      Popular
                    </Badge>
                  )}
                  <div className={`feature-icon bg-gradient-to-br ${tier.gradient} mb-5`}>
                    <tier.icon className={`w-6 h-6 ${tier.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{tier.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{tier.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Detailed Comparison */}
          <TierComparison />
        </div>
      </section>

      {/* Get Template Section */}
      <section id="implementation" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="relative container-custom section-spacing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
              <Package className="w-3.5 h-3.5 mr-2" />
              Get Your Copy
            </Badge>
            <h2 className="text-fluid-lg font-bold text-foreground mb-4">
              Three Ways to Get Started
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the method that works best for your workflow. All options give you the complete template.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {[
              {
                icon: Github,
                title: 'GitHub Template',
                description: 'Click "Use this template" on GitHub to create your own repo with all files and history.',
                items: ['Full project structure', 'CI/CD workflow included', 'Database migrations'],
                buttonText: 'Use Template',
                buttonIcon: ExternalLink,
                href: 'https://github.com/lovableai/feedback-chatbot',
                highlight: false,
              },
              {
                icon: Sparkles,
                title: 'Remix in Lovable',
                description: 'One-click copy to your Lovable account. Instantly start customizing with AI.',
                items: ['Instant setup', 'AI customization ready', 'Supabase pre-configured'],
                buttonText: 'Remix Now',
                buttonIcon: ArrowRight,
                href: 'https://lovable.dev/projects/create?remix=feedback-widget',
                highlight: true,
              },
              {
                icon: Download,
                title: 'Download ZIP',
                description: 'Get a clean ZIP of all widget files to drop into any existing project.',
                items: ['No git required', 'Clean file structure', 'Easy integration'],
                buttonText: 'Download ZIP',
                buttonIcon: Download,
                href: '#',
                highlight: false,
              },
            ].map((option) => (
              <motion.div key={option.title} variants={itemVariants}>
                <Card className={`p-6 h-full flex flex-col card-interactive ${option.highlight ? 'border-2 border-primary ring-4 ring-primary/10' : ''}`}>
                  {option.highlight && (
                    <Badge className="absolute -top-3 left-6 bg-primary text-primary-foreground shadow-lg">
                      Recommended
                    </Badge>
                  )}
                  <div className={`feature-icon bg-gradient-to-br ${option.highlight ? 'from-primary/20 to-primary/5' : 'from-muted to-muted/50'} mb-5`}>
                    <option.icon className={`w-6 h-6 ${option.highlight ? 'text-primary' : 'text-foreground'}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{option.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{option.description}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {option.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full gap-2 ${option.highlight ? '' : 'variant-outline'}`} variant={option.highlight ? 'default' : 'outline'} asChild>
                    <a href={option.href} target={option.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                      {option.buttonText}
                      <option.buttonIcon className="w-4 h-4" />
                    </a>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Setup Guide */}
          <SetupGuide />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Feedback Widget</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">Admin Dashboard</Link>
              <Link to="/demo" className="text-muted-foreground hover:text-foreground transition-colors">Live Demo</Link>
              <Link to="/setup" className="text-muted-foreground hover:text-foreground transition-colors">Setup Guide</Link>
              <a href="https://github.com/lovableai/feedback-chatbot" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                GitHub
                <ExternalLink className="w-3 h-3" />
              </a>
            </nav>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ for developers
            </p>
          </div>
        </div>
      </footer>

      {/* Feedback Widget */}
      <FeedbackWidget />
    </div>
  );
};

export default Index;
