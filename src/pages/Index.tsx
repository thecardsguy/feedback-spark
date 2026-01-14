/**
 * Landing Page
 * Main entry point showcasing the Feedback Widget template
 */

import { FeedbackWidget } from '@/feedback';
import { Navbar } from '@/components/Navbar';
import AccuracyTest from '@/components/AccuracyTest';
import {
  HeroSection,
  QuickStartSection,
  FeaturesGrid,
  TiersSection,
  GetTemplateSection,
  Footer,
} from '@/components/landing';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Quick Start Section */}
      <QuickStartSection />

      {/* AI Accuracy Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="relative container-custom section-spacing-sm">
          <AccuracyTest />
        </div>
      </section>

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Tiers Comparison */}
      <TiersSection />

      {/* Get Template Section */}
      <GetTemplateSection />

      {/* Footer */}
      <Footer />

      {/* Feedback Widget */}
      <FeedbackWidget />
    </div>
  );
};

export default Index;
