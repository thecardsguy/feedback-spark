import HeroSection from "@/components/HeroSection";
import DemoSection from "@/components/DemoSection";
import CodePreview from "@/components/CodePreview";
import FeedbackWidget from "@/components/FeedbackWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <DemoSection />
      <CodePreview />
      
      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          Built with React, Tailwind CSS & Framer Motion
        </p>
      </footer>

      {/* The Feedback Widget */}
      <FeedbackWidget />
    </div>
  );
};

export default Index;
