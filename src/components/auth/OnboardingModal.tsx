/**
 * Onboarding Modal
 * 
 * Shows on first visit to guide template users through setup.
 * Uses localStorage to track if user has seen it.
 */

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Database, Shield, Sparkles, ArrowRight, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const ONBOARDING_KEY = 'feedback-template-onboarded';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    to: string;
  };
}

const steps: Step[] = [
  {
    icon: <Database className="w-6 h-6 text-primary" />,
    title: 'Database Ready',
    description: 'Your feedback table and RLS policies are already set up. No configuration needed!',
  },
  {
    icon: <Sparkles className="w-6 h-6 text-primary" />,
    title: 'AI Powered',
    description: 'AI features work automatically with Lovable Cloud. Demo mode available for testing.',
  },
  {
    icon: <Shield className="w-6 h-6 text-primary" />,
    title: 'Secure by Default',
    description: 'Row-level security protects your data. Add yourself to admin_users for full access.',
  },
];

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasOnboarded = localStorage.getItem(ONBOARDING_KEY);
    if (!hasOnboarded) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Welcome to Feedback Chatbot!</DialogTitle>
              <DialogDescription>Let's get you set up in 30 seconds</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Progress indicators */}
        <div className="flex gap-2 my-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Current step */}
        <div className="py-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              {steps[currentStep].icon}
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                {steps[currentStep].title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {steps[currentStep].description}
              </p>
            </div>
          </div>
        </div>

        {/* Checklist preview */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick Start</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-foreground">Try the feedback button (bottom-right)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-foreground">Visit /setup to verify everything works</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-foreground">Check /admin to see the dashboard</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4">
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Skip tour
          </Button>
          <div className="flex gap-2">
            {currentStep === steps.length - 1 ? (
              <>
                <Button variant="outline" asChild>
                  <Link to="/setup" onClick={handleComplete}>
                    Open Setup
                  </Link>
                </Button>
                <Button onClick={handleComplete}>
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OnboardingModal;
