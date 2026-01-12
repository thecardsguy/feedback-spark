import { FeedbackButton } from '@/feedback';
import { STANDARD_PRESET } from '@/feedback/config/feedback.config';
import { MessageSquare, Zap, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const feedbackConfig = {
    ...STANDARD_PRESET,
    appName: 'Feedback Spark Demo',
    position: 'bottom-right' as const,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Open Source Template</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Feedback Spark
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A modular, drop-in feedback collection system for React + Supabase projects. 
            Collect user feedback in minutes, not days.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/admin">
                View Admin Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              Try the Feedback Button →
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Three Tiers, One Template
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Basic Tier */}
          <div className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">Basic</h3>
            <p className="text-muted-foreground mb-4">
              Simple feedback collection with customizable categories and severity levels.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Floating feedback button</li>
              <li>✓ Category selection</li>
              <li>✓ Severity levels</li>
              <li>✓ Auto-capture page context</li>
            </ul>
          </div>

          {/* Standard Tier */}
          <div className="p-6 rounded-2xl border-2 border-primary bg-card hover:shadow-lg transition-shadow relative">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              Popular
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">Standard</h3>
            <p className="text-muted-foreground mb-4">
              Everything in Basic plus an admin dashboard to manage feedback.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Admin dashboard</li>
              <li>✓ Status management</li>
              <li>✓ Feedback statistics</li>
              <li>✓ Search & filtering</li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">Pro</h3>
            <p className="text-muted-foreground mb-4">
              AI-powered insights with automatic categorization and summaries.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ AI categorization</li>
              <li>✓ Auto-generated summaries</li>
              <li>✓ Developer questions</li>
              <li>✓ Sentiment analysis</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Demo Content Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-border">
        <h2 className="text-3xl font-bold text-center text-foreground mb-4">
          Try It Now
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Click the feedback button in the bottom-right corner to submit feedback. 
          Then visit the admin dashboard to see it appear.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-muted/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Sample Content Area</h3>
            <p className="text-muted-foreground mb-4">
              This is a sample content area. Users can submit feedback about any element on the page. 
              The widget automatically captures the current page URL and device information.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">React</span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">TypeScript</span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Supabase</span>
            </div>
          </div>
          
          <div className="p-8 rounded-2xl bg-muted/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Setup</h3>
            <pre className="bg-background p-4 rounded-lg text-sm overflow-x-auto text-foreground">
{`import { FeedbackButton } from '@/feedback';
import { STANDARD_PRESET } from '@/feedback/config/feedback.config';

<FeedbackButton config={STANDARD_PRESET} />`}
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-muted-foreground">
          <p>
            Feedback Spark • MIT License • 
            <a href="https://github.com/thecardsguy/feedback-spark" className="text-primary hover:underline ml-1">
              View on GitHub
            </a>
          </p>
        </div>
      </footer>

      {/* Feedback Widget */}
      <FeedbackButton config={feedbackConfig} />
    </div>
  );
};

export default Index;
