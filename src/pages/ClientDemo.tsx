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
import { MessageSquare, Code, Zap, Shield, Copy, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientDemo = () => {
  const [copied, setCopied] = useState(false);
  const [widgetPosition, setWidgetPosition] = useState<'bottom-right' | 'bottom-left'>('bottom-right');
  
  // Sample config for the demo widget
  const config = createConfig({
    appName: 'YourApp',
    position: widgetPosition,
    buttonColor: 'hsl(32, 95%, 52%)',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">YourApp</h1>
              <p className="text-xs text-muted-foreground">Sample Client Application</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              View Admin Dashboard
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Button variant="outline" size="sm" onClick={() => setWidgetPosition(p => p === 'bottom-right' ? 'bottom-left' : 'bottom-right')}>
              Toggle Position
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Live Demo - Try the Widget!
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            This is how your users
            <br />
            <span className="text-primary">experience the widget</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Click the feedback button in the {widgetPosition === 'bottom-right' ? 'bottom-right' : 'bottom-left'} corner to see the beautiful, 
            modern feedback form your users will interact with.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2" onClick={() => document.querySelector('[aria-label="Send feedback"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}>
              <MessageSquare className="w-4 h-4" />
              Try the Widget
            </Button>
            <Link to="/">
              <Button size="lg" variant="outline">
                Back to Template Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
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
              icon: Shield,
              title: 'Element Targeting',
              description: 'Users can click on specific elements to highlight exactly what they mean.',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="p-6 h-full bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Code Example */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Easy Integration</h2>
            <p className="text-muted-foreground">Add the widget to your app in just 3 lines of code</p>
          </div>

          <Card className="overflow-hidden bg-card/80 backdrop-blur border-border/50">
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">App.tsx</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyCode}
                className="gap-2"
              >
                {copied ? (
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
              <code className="text-muted-foreground">
                {integrationCode.split('\n').map((line, i) => (
                  <div key={i} className="leading-relaxed">
                    {line.startsWith('//') ? (
                      <span className="text-muted-foreground/60">{line}</span>
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
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
            <h3 className="text-xl font-semibold text-foreground mb-4">Sample Dashboard Card</h3>
            <p className="text-muted-foreground mb-4">
              This is an example of a component in your app. Users can target this element 
              when submitting feedback to show exactly what they're referring to.
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">Action 1</Button>
              <Button variant="outline" size="sm">Action 2</Button>
            </div>
          </Card>
          
          <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
            <h3 className="text-xl font-semibold text-foreground mb-4">Another Widget</h3>
            <p className="text-muted-foreground mb-4">
              Try clicking the feedback button and then using the element picker to 
              target this card. The feedback will include the element's details.
            </p>
            <div className="h-32 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Placeholder Content</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-6 py-8 text-center">
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
