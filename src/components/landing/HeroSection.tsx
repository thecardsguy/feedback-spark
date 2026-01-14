/**
 * Hero Section Component
 * Main hero area with animated background, badge, heading, and CTA buttons
 */

import { motion } from 'framer-motion';
import { Sparkles, Download, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 gradient-mesh opacity-60" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />

      <div className="relative container-custom py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Drop-in Template</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.div>

          {/* Heading */}
          <h1 className="text-fluid-xl font-extrabold text-foreground mb-6 tracking-tight">
            Feedback Widget{' '}
            <span className="gradient-text">for Developers</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            One component. Zero configuration. Add AI-powered feedback collection to your app in under a minute.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" className="h-12 px-6 text-base gap-2 shadow-lg hover:shadow-xl transition-shadow" asChild>
              <a href="#implementation">
                <Download className="w-5 h-5" />
                Get the Template
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 text-base glass" asChild>
              <Link to="/demo">
                Try Live Demo
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="h-12 px-6 text-base" asChild>
              <Link to="/admin">
                View Admin
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
