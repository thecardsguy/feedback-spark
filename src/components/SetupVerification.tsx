/**
 * Setup Verification Component
 * Tests database connection, edge functions, and AI connectivity
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Database,
  Zap,
  Brain,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  status: 'idle' | 'testing' | 'success' | 'error';
  message: string;
  details?: string;
}

interface VerificationState {
  database: TestResult;
  edgeFunction: TestResult;
  aiFunction: TestResult;
}

const initialState: VerificationState = {
  database: { status: 'idle', message: 'Not tested yet' },
  edgeFunction: { status: 'idle', message: 'Not tested yet' },
  aiFunction: { status: 'idle', message: 'Not tested yet' },
};

export function SetupVerification() {
  const [results, setResults] = useState<VerificationState>(initialState);
  const [isRunning, setIsRunning] = useState(false);

  const updateResult = (key: keyof VerificationState, result: TestResult) => {
    setResults(prev => ({ ...prev, [key]: result }));
  };

  const testDatabase = async (): Promise<TestResult> => {
    try {
      const { count, error } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true });

      if (error) {
        return {
          status: 'error',
          message: 'Connection failed',
          details: error.message,
        };
      }

      return {
        status: 'success',
        message: `Connected successfully`,
        details: `Found ${count || 0} feedback items in database`,
      };
    } catch (err) {
      return {
        status: 'error',
        message: 'Connection error',
        details: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  };

  const testEdgeFunction = async (): Promise<TestResult> => {
    try {
      const { data, error } = await supabase.functions.invoke('health-check');

      if (error) {
        return {
          status: 'error',
          message: 'Function unavailable',
          details: error.message,
        };
      }

      if (data?.database?.ok) {
        return {
          status: 'success',
          message: 'Functions deployed',
          details: data.database.message,
        };
      }

      return {
        status: 'error',
        message: 'Health check failed',
        details: data?.database?.message || 'Unknown error',
      };
    } catch (err) {
      return {
        status: 'error',
        message: 'Function call failed',
        details: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  };

  const testAIFunction = async (): Promise<TestResult> => {
    try {
      const testPayload = {
        raw_text: 'Test feedback for verification',
        category: 'other',
        page_url: window.location.href,
        device_type: 'desktop',
      };

      const { data, error } = await supabase.functions.invoke('submit-feedback-ai', {
        body: testPayload,
      });

      if (error) {
        // Check if it's a configuration issue vs deployment issue
        if (error.message.includes('not found') || error.message.includes('404')) {
          return {
            status: 'error',
            message: 'AI function not deployed',
            details: 'The submit-feedback-ai function needs to be deployed',
          };
        }
        return {
          status: 'error',
          message: 'AI function error',
          details: error.message,
        };
      }

      if (data?.ai_summary || data?.demo_mode) {
        return {
          status: 'success',
          message: data.demo_mode ? 'AI configured (demo mode)' : 'AI fully operational',
          details: data.ai_summary || 'AI processing available',
        };
      }

      return {
        status: 'success',
        message: 'AI function responds',
        details: 'Function is deployed and accepting requests',
      };
    } catch (err) {
      return {
        status: 'error',
        message: 'AI test failed',
        details: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults(initialState);

    // Test database
    updateResult('database', { status: 'testing', message: 'Testing connection...' });
    const dbResult = await testDatabase();
    updateResult('database', dbResult);

    // Test edge function
    updateResult('edgeFunction', { status: 'testing', message: 'Testing functions...' });
    const efResult = await testEdgeFunction();
    updateResult('edgeFunction', efResult);

    // Test AI function
    updateResult('aiFunction', { status: 'testing', message: 'Testing AI...' });
    const aiResult = await testAIFunction();
    updateResult('aiFunction', aiResult);

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'testing':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'testing':
        return 'border-primary/50 bg-primary/5';
      case 'success':
        return 'border-green-500/50 bg-green-500/5';
      case 'error':
        return 'border-destructive/50 bg-destructive/5';
      default:
        return 'border-border bg-muted/30';
    }
  };

  const allPassed = 
    results.database.status === 'success' && 
    results.edgeFunction.status === 'success' && 
    results.aiFunction.status === 'success';

  const testItems = [
    {
      key: 'database' as const,
      icon: Database,
      title: 'Database Connection',
      description: 'Tests connection to your feedback table',
    },
    {
      key: 'edgeFunction' as const,
      icon: Zap,
      title: 'Edge Functions',
      description: 'Verifies backend functions are deployed',
    },
    {
      key: 'aiFunction' as const,
      icon: Brain,
      title: 'AI Connectivity',
      description: 'Tests AI-powered feedback processing',
    },
  ];

  return (
    <Card className="p-6 bg-card/80 backdrop-blur border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Test My Setup</h3>
          <p className="text-sm text-muted-foreground">
            Verify all components are working correctly
          </p>
        </div>
        <Button
          onClick={runAllTests}
          disabled={isRunning}
          className="gap-2"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Run Tests
            </>
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {testItems.map((item) => {
          const result = results[item.key];
          const Icon = item.icon;

          return (
            <motion.div
              key={item.key}
              className={`p-4 rounded-xl border transition-colors ${getStatusColor(result.status)}`}
              initial={false}
              animate={{ 
                scale: result.status === 'testing' ? [1, 1.01, 1] : 1 
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{item.title}</span>
                    {getStatusIcon(result.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <AnimatePresence mode="wait">
                    {result.status !== 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2"
                      >
                        <p className={`text-sm font-medium ${
                          result.status === 'success' ? 'text-green-600' :
                          result.status === 'error' ? 'text-destructive' :
                          'text-primary'
                        }`}>
                          {result.message}
                        </p>
                        {result.details && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {result.details}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Overall Status */}
      <AnimatePresence>
        {results.database.status !== 'idle' && !isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-6 p-4 rounded-xl ${
              allPassed 
                ? 'bg-green-500/10 border border-green-500/30' 
                : 'bg-orange-500/10 border border-orange-500/30'
            }`}
          >
            <div className="flex items-center gap-3">
              {allPassed ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-semibold text-green-600">All Systems Operational</p>
                    <p className="text-sm text-green-600/80">
                      Your setup is complete and ready to collect feedback!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                  <div>
                    <p className="font-semibold text-orange-600">Setup Incomplete</p>
                    <p className="text-sm text-orange-600/80">
                      Some tests failed. Check the details above for fixes.
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default SetupVerification;
