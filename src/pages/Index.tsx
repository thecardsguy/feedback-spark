/**
 * Landing Page
 * Main entry point showcasing the Feedback Widget template
 */

import { Navbar } from '@/components/common';
import { AccuracyTest } from '@/components/testing';
import {
  HeroSection,
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
    </div>
  );
};

export default Index;
