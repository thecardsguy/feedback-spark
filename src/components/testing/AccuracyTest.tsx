/**
 * AI Accuracy Testing Component
 * 
 * Tests the AI with real scenarios and shows accuracy metrics.
 * Uses actual AI calls (not demo mode) to demonstrate true capability.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  CheckCircle,
  XCircle,
  Loader2,
  Brain,
  Target,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface TestScenario {
  id: string;
  name: string;
  description: string;
  input: {
    raw_text: string;
    category: string;
    severity: string;
  };
  expected: {
    categoryMatch: string[];
    keywordPresent: string[];
  };
}

interface TestResult {
  scenarioId: string;
  success: boolean;
  response: {
    ai_summary?: string;
    ai_category?: string;
    ai_question_for_dev?: string;
  } | null;
  categoryMatch: boolean;
  keywordsFound: string[];
  duration: number;
  error?: string;
}

const TEST_SCENARIOS: TestScenario[] = [
  {
    id: 'bug-login',
    name: 'Login Bug Report',
    description: 'A clear bug report about authentication issues',
    input: {
      raw_text: 'I cannot log in after resetting my password. The page just refreshes and shows the login form again. This happens on Chrome and Firefox.',
      category: 'bug',
      severity: 'high',
    },
    expected: {
      categoryMatch: ['bug', 'authentication', 'auth'],
      keywordPresent: ['password', 'login', 'authentication', 'refresh'],
    },
  },
  {
    id: 'feature-dark',
    name: 'Feature Request',
    description: 'A user requesting dark mode support',
    input: {
      raw_text: 'Please add a dark mode option. Working at night with the bright interface is hard on my eyes. Maybe a toggle in settings?',
      category: 'feature',
      severity: 'medium',
    },
    expected: {
      categoryMatch: ['feature', 'enhancement', 'feature_request'],
      keywordPresent: ['dark', 'mode', 'toggle', 'setting'],
    },
  },
  {
    id: 'ux-mobile',
    name: 'Mobile UX Issue',
    description: 'Usability problem on mobile devices',
    input: {
      raw_text: 'The buttons on mobile are too small to tap accurately. I keep hitting the wrong one. The spacing needs to be increased.',
      category: 'ui_ux',
      severity: 'medium',
    },
    expected: {
      categoryMatch: ['ux', 'ui', 'usability', 'ux_issue'],
      keywordPresent: ['mobile', 'button', 'tap', 'spacing', 'touch'],
    },
  },
  {
    id: 'performance',
    name: 'Performance Complaint',
    description: 'User reporting slow loading times',
    input: {
      raw_text: 'The dashboard takes over 10 seconds to load. It used to be instant. Something changed in the last update that made it really slow.',
      category: 'bug',
      severity: 'critical',
    },
    expected: {
      categoryMatch: ['performance', 'bug', 'optimization'],
      keywordPresent: ['slow', 'load', 'performance', 'speed', 'time'],
    },
  },
];

export function AccuracyTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const runSingleTest = async (scenario: TestScenario): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-feedback-ai`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            raw_text: scenario.input.raw_text,
            category: scenario.input.category,
            severity: scenario.input.severity,
            page_url: window.location.href,
          }),
        }
      );

      const data = await response.json();
      const duration = Date.now() - startTime;

      if (!response.ok || data.error) {
        return {
          scenarioId: scenario.id,
          success: false,
          response: null,
          categoryMatch: false,
          keywordsFound: [],
          duration,
          error: data.error || 'Request failed',
        };
      }

      const feedbackResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/feedback?id=eq.${data.id}&select=ai_summary,ai_category,ai_question_for_dev`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );
      
      const feedbackData = await feedbackResponse.json();
      const aiResponse = feedbackData[0] || {};

      const categoryMatch = scenario.expected.categoryMatch.some(
        expected => aiResponse.ai_category?.toLowerCase().includes(expected.toLowerCase())
      );

      const summaryLower = (aiResponse.ai_summary || '').toLowerCase();
      const questionLower = (aiResponse.ai_question_for_dev || '').toLowerCase();
      const combinedText = summaryLower + ' ' + questionLower;
      
      const keywordsFound = scenario.expected.keywordPresent.filter(
        keyword => combinedText.includes(keyword.toLowerCase())
      );

      return {
        scenarioId: scenario.id,
        success: true,
        response: aiResponse,
        categoryMatch,
        keywordsFound,
        duration,
      };
    } catch (error) {
      return {
        scenarioId: scenario.id,
        success: false,
        response: null,
        categoryMatch: false,
        keywordsFound: [],
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);

    for (const scenario of TEST_SCENARIOS) {
      setCurrentTest(scenario.id);
      const result = await runSingleTest(scenario);
      setResults(prev => [...prev, result]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setCurrentTest(null);
    setIsRunning(false);
  };

  const calculateAccuracy = () => {
    if (results.length === 0) return { overall: 0, category: 0, keywords: 0 };

    const successfulTests = results.filter(r => r.success);
    const categoryMatches = successfulTests.filter(r => r.categoryMatch).length;
    
    const avgKeywordScore = successfulTests.reduce((acc, r) => {
      const scenario = TEST_SCENARIOS.find(s => s.id === r.scenarioId);
      if (!scenario) return acc;
      return acc + (r.keywordsFound.length / scenario.expected.keywordPresent.length);
    }, 0) / (successfulTests.length || 1);

    return {
      overall: Math.round(((categoryMatches / (successfulTests.length || 1)) * 0.5 + avgKeywordScore * 0.5) * 100),
      category: Math.round((categoryMatches / (successfulTests.length || 1)) * 100),
      keywords: Math.round(avgKeywordScore * 100),
    };
  };

  const accuracy = calculateAccuracy();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Badge variant="outline" className="mb-4 px-4 py-1.5 bg-purple-500/10 text-purple-600 border-purple-500/20">
          <Brain className="w-3.5 h-3.5 mr-2" />
          Real AI Testing
        </Badge>
        <h2 className="text-fluid-lg font-bold text-foreground mb-4">
          Test AI Accuracy
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Run real feedback scenarios through the AI system. 
          No mock responses – see true accuracy metrics.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={runAllTests}
          disabled={isRunning}
          size="lg"
          className="h-12 gap-2 shadow-lg"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Run All Tests
            </>
          )}
        </Button>
        {results.length > 0 && !isRunning && (
          <Button
            variant="outline"
            onClick={() => setResults([])}
            size="lg"
            className="h-12 gap-2 glass"
          >
            <RefreshCw className="w-5 h-5" />
            Reset
          </Button>
        )}
      </div>

      {/* Accuracy Dashboard */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6 glass border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Accuracy Metrics
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { value: accuracy.overall, label: 'Overall Accuracy', color: 'text-primary' },
                  { value: accuracy.category, label: 'Category Match', color: 'text-blue-500' },
                  { value: accuracy.keywords, label: 'Keyword Recognition', color: 'text-green-500' },
                ].map((metric) => (
                  <div key={metric.label} className="text-center">
                    <div className={`text-4xl font-bold ${metric.color} mb-2`}>
                      {metric.value}%
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">{metric.label}</div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Scenarios */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 gap-4"
      >
        {TEST_SCENARIOS.map((scenario) => {
          const result = results.find(r => r.scenarioId === scenario.id);
          const isCurrentlyRunning = currentTest === scenario.id;

          return (
            <motion.div key={scenario.id} variants={itemVariants}>
              <Card className={`p-5 h-full card-modern transition-all ${
                isCurrentlyRunning ? 'ring-2 ring-primary border-primary' : 
                result?.success ? 'border-green-500/30' : 
                result?.error ? 'border-destructive/30' : ''
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      {scenario.name}
                      {isCurrentlyRunning && (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      )}
                      {result?.success && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {result?.error && (
                        <XCircle className="w-4 h-4 text-destructive" />
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0 ml-2">
                    {scenario.input.category}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg mb-3 line-clamp-2 border border-border/50">
                  "{scenario.input.raw_text}"
                </div>

                {result && result.success && (
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-muted-foreground">AI Category:</span>
                      <Badge variant={result.categoryMatch ? 'default' : 'secondary'} className="text-xs">
                        {result.response?.ai_category || 'N/A'}
                      </Badge>
                      {result.categoryMatch && (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      )}
                    </div>
                    {result.response?.ai_summary && (
                      <div>
                        <span className="text-muted-foreground text-xs">Summary:</span>
                        <p className="text-foreground text-xs mt-1 line-clamp-2 leading-relaxed">
                          {result.response.ai_summary}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-muted-foreground text-xs">Keywords:</span>
                      {result.keywordsFound.length > 0 ? (
                        result.keywordsFound.slice(0, 3).map(kw => (
                          <Badge key={kw} variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                            {kw}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">none matched</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                      Response time: {result.duration}ms
                    </div>
                  </div>
                )}

                {result?.error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                    {result.error}
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Info Note */}
      <div className="text-center text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4 inline mr-1.5 text-primary" />
        Tests use real AI calls via Lovable AI Gateway. Results reflect actual production behavior.
      </div>
    </div>
  );
}

export default AccuracyTest;
