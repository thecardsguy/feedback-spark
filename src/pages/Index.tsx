import { useState } from 'react';
import { FeedbackButton } from '@/feedback';
import { STANDARD_PRESET } from '@/feedback/config/feedback.config';
import { MessageSquare, Zap, Shield, Sparkles, ArrowRight, MousePointer2, CreditCard, Clock, Bot, Play, CheckCircle, Loader2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { OnboardingModal } from '@/components/OnboardingModal';

const Index = () => {
  const feedbackConfig = {
    ...STANDARD_PRESET,
    appName: 'Feedback Chatbot Demo',
    position: 'bottom-right' as const,
  };

  const [isDemoSubmitting, setIsDemoSubmitting] = useState(false);
  const [demoResult, setDemoResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleDemoSubmit = async () => {
    setIsDemoSubmitting(true);
    setDemoResult(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-feedback-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          raw_text: 'Demo: The hero section could use better contrast on mobile devices.',
          category: 'ui_ux',
          severity: 'medium',
          page_url: window.location.href,
          demo_mode: true, // Use demo mode - no credits consumed
        }),
      });
      const data = await response.json();
      if (data.success || data.id) {
        setDemoResult({
          success: true,
          message: 'Demo submission successful! Check the admin dashboard to see it.',
        });
      } else {
        setDemoResult({
          success: false,
          message: data.error || 'Demo submission failed',
        });
      }
    } catch (error) {
      setDemoResult({
        success: false,
        message: 'Failed to connect. Check your setup.',
      });
    } finally {
      setIsDemoSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Template</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Feedback Chatbot
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-2">
            A template for the AI Feedback Chatbot system
          </p>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Drop this into any React + Supabase project to collect, organize, and act on user feedback. 
            AI interprets issues and generates prompts you can paste directly into Lovable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/admin">
                View Admin Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/setup">
                <Settings className="w-4 h-4 mr-2" />
                Setup Wizard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Interactive Demo Section - NEW */}
      <section className="bg-gradient-to-b from-primary/5 to-background border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 mb-4">
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">Interactive Demo</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Try It Without Using Credits
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Test the full AI-powered feedback flow in demo mode. 
              No API credits are consumed - perfect for exploring the template.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Demo AI Submission
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Submits a sample feedback with AI-generated summary, category, and developer question (using mock responses).
              </p>
              
              <Button 
                onClick={handleDemoSubmit}
                disabled={isDemoSubmitting}
                className="w-full mb-4"
                size="lg"
              >
                {isDemoSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting Demo...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Try Demo Submission
                  </>
                )}
              </Button>

              {demoResult && (
                <div className={`p-4 rounded-lg ${demoResult.success ? 'bg-green-500/10 border border-green-500/20' : 'bg-destructive/10 border border-destructive/20'}`}>
                  <div className="flex items-center justify-center gap-2">
                    {demoResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : null}
                    <p className={`font-medium ${demoResult.success ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                      {demoResult.message}
                    </p>
                  </div>
                  {demoResult.success && (
                    <Link to="/admin" className="text-sm text-green-600 dark:text-green-400 hover:underline mt-2 inline-block">
                      View in Admin Dashboard →
                    </Link>
                  )}
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-4">
                💡 Demo mode uses pre-generated AI responses. Connect Lovable Cloud for real AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Perfect for Lovable Users Section */}
      <section className="bg-primary/5 border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Bot className="w-4 h-4" />
              <span className="text-sm font-medium">Built for Lovable</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Your Personal Issue Tracker for AI Development
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Stop losing track of bugs and improvements. Capture issues as you see them, 
              then batch-prompt Lovable when you're ready to fix everything at once.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Element Picker */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <MousePointer2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Pinpoint Accuracy</h3>
              <p className="text-sm text-muted-foreground">
                Click anywhere on your page to select the exact element with an issue. 
                The captured context helps Lovable understand precisely what needs fixing.
              </p>
            </div>

            {/* Save Credits */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Save Credits</h3>
              <p className="text-sm text-muted-foreground">
                No more wasted prompts from vague descriptions. Precise element targeting 
                means fewer back-and-forth corrections and more accurate first-try fixes.
              </p>
            </div>

            {/* Queue for Later */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Queue Issues</h3>
              <p className="text-sm text-muted-foreground">
                Spot an issue? Log it instantly and keep browsing. All your feedback is saved 
                so you can batch-prompt fixes when you have dedicated dev time.
              </p>
            </div>

            {/* AI Interpretation */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">AI-Ready Prompts</h3>
              <p className="text-sm text-muted-foreground">
                Pro tier AI interprets your feedback and generates clear, actionable prompts 
                you can paste directly into Lovable for immediate implementation.
              </p>
            </div>
          </div>


          {/* Workflow Explanation */}
          <div className="mt-12 p-8 rounded-2xl bg-card border border-border">
            <h3 className="text-xl font-semibold text-card-foreground mb-4 text-center">
              The Feedback Chatbot Workflow
            </h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">See an issue</strong><br />
                  While using your app, notice a bug or something to improve
                </p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Click & describe</strong><br />
                  Select the element, describe the issue, and submit
                </p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Collect & organize</strong><br />
                  Issues are saved with full context in your admin dashboard
                </p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 font-bold">4</div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Batch prompt</strong><br />
                  When ready, copy the AI-generated prompts to Lovable and fix everything
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            Feedback Chatbot • MIT License • 
            <a href="https://github.com/thecardsguy/feedback-chatbot" className="text-primary hover:underline ml-1">
              View on GitHub
            </a>
          </p>
        </div>
      </footer>

      {/* Feedback Widget */}
      <FeedbackButton config={feedbackConfig} />
      
      {/* Onboarding Modal - shows on first visit */}
      <OnboardingModal />
    </div>
  );
};

export default Index;
