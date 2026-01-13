/**
 * Client Demo Page
 * 
 * Shows how the feedback widget looks and works from a client's perspective.
 * This is a sample app page where the widget would be integrated.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FeedbackButton, createConfig } from '@/feedback';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Code, Zap, Shield, Copy, Check, ExternalLink, Sparkles, MousePointer2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientDemo = () => {
  const [copied, setCopied] = useState(false);
  const [widgetPosition, setWidgetPosition] = useState<'bottom-right' | 'bottom-left'>('bottom-right');
  
  const config = createConfig({
    appName: 'YourApp',
    position: widgetPosition,
    buttonColor: 'hsl(24, 95%, 53%)',
    buttonIcon: 'message',
  }, 'pro');

  const integrationCode = `// 1. Import the widget
import { FeedbackButton, getFeedbackConfig } from '@/feedback';

// 2. Configure it
const config = getFeedbackConfig({
  position: 'bottom-right',
  buttonColor: '#F97316',
  features: {
    categories: true,
    severityLevels: true,
    elementPicker: true,
  },
  ai: { enabled: true },
});

// 3. Add to your app
<FeedbackButton config={config} />`;

  const copyCode = () => {
    navigator.clipboard.writeText(integrationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    {
      icon: MessageSquare,
      title: 'Sleek Design',
      description: 'Beautiful glassmorphism UI with smooth animations that matches any app.',
    },
    {
      icon: Zap,
      title: 'AI-Powered',
      description: 'Automatic categorization and smart summaries for better insights.',
    },
    {
      icon: MousePointer2,
      title: 'Element Targeting',
      description: 'Users can click on specific elements to highlight exactly what they mean.',
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
      {/* Background effects */}
      <div className="fixed inset-0 gradient-hero pointer-events-none" />
      <div className="fixed inset-0 gradient-mesh opacity-40 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container-custom py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">YourApp</h1>
              <p className="text-xs text-muted-foreground">Sample Client Application</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:flex items-center gap-1">
              View Admin Dashboard
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setWidgetPosition(p => p === 'bottom-right' ? 'bottom-left' : 'bottom-right')}
              className="glass"
            >
              Toggle Position
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container-custom py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 glass border-primary/20">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" />
              Live Demo - Try the Widget!
            </Badge>
          </motion.div>
          
          <h1 className="text-fluid-xl font-extrabold text-foreground mb-6 tracking-tight">
            This is how your users
            <br />
            <span className="gradient-text">experience the widget</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Click the feedback button in the {widgetPosition === 'bottom-right' ? 'bottom-right' : 'bottom-left'} corner to see the beautiful, 
            modern feedback form your users will interact with.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="h-12 px-6 gap-2 shadow-lg hover:shadow-xl transition-shadow" 
              onClick={() => document.querySelector('[aria-label="Send feedback"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
            >
              <MessageSquare className="w-5 h-5" />
              Try the Widget
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 glass" asChild>
              <Link to="/">
                Back to Template Home
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container-custom py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="p-6 h-full card-interactive group">
                <div className="feature-icon-primary mb-5 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Code Example */}
      <section className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Easy Integration</h2>
            <p className="text-muted-foreground">Add the widget to your app in just 3 lines of code</p>
          </div>

          <Card className="overflow-hidden glass border-border/50">
            <div className="code-block-header">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-sm font-medium text-foreground">App.tsx</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyCode}
                className="gap-2 h-8"
              >
                {copied ? (
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
              <code className="text-foreground font-mono">
                {integrationCode.split('\n').map((line, i) => (
                  <div key={i}>
                    {line.startsWith('//') ? (
                      <span className="text-muted-foreground">{line}</span>
                    ) : line.includes('import') || line.includes('const') || line.includes('export') ? (
                      <span>
                        <span className="text-purple-400">{line.split(' ')[0]}</span>
                        <span className="text-foreground">{' ' + line.slice(line.split(' ')[0].length + 1)}</span>
                      </span>
                    ) : (
                      <span className="text-foreground">{line}</span>
                    )}
                  </div>
                ))}
              </code>
            </pre>
          </Card>
        </motion.div>
      </section>

      {/* Sample Content */}
      <section className="container-custom py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 h-full card-interactive">
              <h3 className="text-xl font-semibold text-foreground mb-4">Sample Dashboard Card</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                This is an example of a component in your app. Users can target this element 
                when submitting feedback to show exactly what they're referring to.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" size="sm">Action 1</Button>
                <Button variant="outline" size="sm">Action 2</Button>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 h-full card-interactive">
              <h3 className="text-xl font-semibold text-foreground mb-4">Another Widget</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Try clicking the feedback button and then using the element picker to 
                target this card. The feedback will include the element's details.
              </p>
              <div className="h-32 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
                <span className="text-muted-foreground text-sm">Placeholder Content</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 glass">
        <div className="container-custom py-8 text-center">
          <p className="text-sm text-muted-foreground">
            This is a demo page showing the client-side experience. 
            <Link to="/admin" className="text-primary hover:underline ml-1">
              View the admin dashboard →
            </Link>
          </p>
        </div>
      </footer>

      {/* The Feedback Widget */}
      <FeedbackButton config={config} />
    </div>
  );
};

export default ClientDemo;
