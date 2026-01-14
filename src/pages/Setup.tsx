import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Database, Bot, ArrowRight, RefreshCw, Zap, Play } from 'lucide-react';
import { Navbar } from '@/components/common';
import { AdminGuard } from '@/components/auth';

interface HealthStatus {
  database: { ok: boolean; message: string };
  ai: { ok: boolean; message: string; provider: string };
  storage: { ok: boolean; message: string };
  overall: boolean;
}

interface TestResult {
  success: boolean;
  message: string;
  id?: string;
}

const Setup = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [feedbackTestResult, setFeedbackTestResult] = useState<TestResult | null>(null);
  const [aiTestResult, setAiTestResult] = useState<TestResult | null>(null);
  const [isTestingFeedback, setIsTestingFeedback] = useState(false);
  const [isTestingAI, setIsTestingAI] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      });
      const data = await response.json();
      setHealthStatus(data);
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus({
        database: { ok: false, message: 'Failed to connect' },
        ai: { ok: false, message: 'Check failed', provider: 'none' },
        storage: { ok: false, message: 'Check failed' },
        overall: false,
      });
    } finally {
      setIsChecking(false);
    }
  };

  const testFeedbackSubmission = async () => {
    setIsTestingFeedback(true);
    setFeedbackTestResult(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          raw_text: '[SETUP TEST] This is a test feedback submission from the setup wizard.',
          category: 'other',
          severity: 'low',
          page_url: window.location.href,
          submitter_name: 'Setup Test User',
          submitter_email: 'test@example.com',
          submitter_phone: '',
        }),
      });
      const data = await response.json();
      if (data.success || data.id) {
        setFeedbackTestResult({
          success: true,
          message: 'Feedback submission successful!',
          id: data.id,
        });
      } else {
        setFeedbackTestResult({
          success: false,
          message: data.error || 'Submission failed',
        });
      }
    } catch (error) {
      setFeedbackTestResult({
        success: false,
        message: 'Failed to connect to backend',
      });
    } finally {
      setIsTestingFeedback(false);
    }
  };

  const testAISubmission = async () => {
    setIsTestingAI(true);
    setAiTestResult(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-feedback-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          raw_text: '[SETUP TEST] Testing AI-enhanced feedback. The login button is too small on mobile devices.',
          category: 'ui_ux',
          severity: 'medium',
          page_url: window.location.href,
          demo_mode: true,
          submitter_name: 'Setup Test User',
          submitter_email: 'test@example.com',
          submitter_phone: '',
        }),
      });
      const data = await response.json();
      if (data.success || data.id) {
        setAiTestResult({
          success: true,
          message: data.demo_mode 
            ? 'AI Demo mode working! No credits used.' 
            : `AI submission successful!${data.ai_enhanced ? ' AI enhancements applied.' : ''}`,
          id: data.id,
        });
      } else {
        setAiTestResult({
          success: false,
          message: data.error || 'AI submission failed',
        });
      }
    } catch (error) {
      setAiTestResult({
        success: false,
        message: 'Failed to connect to AI backend',
      });
    } finally {
      setIsTestingAI(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const StatusIcon = ({ ok }: { ok: boolean }) => {
    return ok ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
      
      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Setup Wizard</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Feedback Chatbot Setup
            </h1>
            <p className="text-muted-foreground">
              Verify your template is configured correctly
            </p>
          </div>

          {/* Health Check Section */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <Database className="w-5 h-5" />
                System Health
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkHealth}
                disabled={isChecking}
              >
                {isChecking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>

            {isChecking && !healthStatus ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : healthStatus ? (
              <div className="space-y-4">
                {/* Database Status */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <StatusIcon ok={healthStatus.database.ok} />
                    <div>
                      <p className="font-medium text-foreground">Database</p>
                      <p className="text-sm text-muted-foreground">{healthStatus.database.message}</p>
                    </div>
                  </div>
                </div>

                {/* AI Status */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <StatusIcon ok={healthStatus.ai.ok} />
                    <div>
                      <p className="font-medium text-foreground">AI Provider</p>
                      <p className="text-sm text-muted-foreground">
                        {healthStatus.ai.message}
                        {healthStatus.ai.provider === 'demo' && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded dark:bg-amber-900/30 dark:text-amber-400">
                            Demo Mode
                          </span>
                        )}
                        {healthStatus.ai.provider === 'lovable' && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded dark:bg-green-900/30 dark:text-green-400">
                            Pro Ready
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overall Status */}
                <div className={`p-4 rounded-lg ${healthStatus.overall ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  <p className={`font-medium ${healthStatus.overall ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {healthStatus.overall ? '✓ System is ready!' : '✗ Some issues detected'}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Test Feedback Submission */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Test Feedback Submission
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Submit a test feedback item to verify the basic flow works.
            </p>
            
            <Button 
              onClick={testFeedbackSubmission}
              disabled={isTestingFeedback}
              className="w-full mb-4"
            >
              {isTestingFeedback ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Basic Submission'
              )}
            </Button>

            {feedbackTestResult && (
              <div className={`p-4 rounded-lg ${feedbackTestResult.success ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                <div className="flex items-center gap-2">
                  <StatusIcon ok={feedbackTestResult.success} />
                  <p className={`font-medium ${feedbackTestResult.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {feedbackTestResult.message}
                  </p>
                </div>
                {feedbackTestResult.id && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Feedback ID: <code className="bg-muted px-1 rounded">{feedbackTestResult.id}</code>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Test AI Submission */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Test AI-Enhanced Submission
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Test the Pro tier AI features. Uses demo mode to avoid consuming credits.
            </p>
            
            <Button 
              onClick={testAISubmission}
              disabled={isTestingAI}
              variant="outline"
              className="w-full mb-4"
            >
              {isTestingAI ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing AI...
                </>
              ) : (
                'Test AI Submission (Demo Mode)'
              )}
            </Button>

            {aiTestResult && (
              <div className={`p-4 rounded-lg ${aiTestResult.success ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                <div className="flex items-center gap-2">
                  <StatusIcon ok={aiTestResult.success} />
                  <p className={`font-medium ${aiTestResult.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {aiTestResult.message}
                  </p>
                </div>
                {aiTestResult.id && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Feedback ID: <code className="bg-muted px-1 rounded">{aiTestResult.id}</code>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Next Steps
            </h2>
            <div className="space-y-3">
              <Link to="/admin" className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:border-primary transition-colors">
                <span className="font-medium text-foreground">View Admin Dashboard</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link to="/" className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:border-primary transition-colors">
                <span className="font-medium text-foreground">Try the Demo</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default Setup;
