/**
 * Features Grid Component
 * Feature cards with icons showcasing widget capabilities
 */

import { motion, Variants } from 'framer-motion';
import { MousePointer2, CreditCard, Clock, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Feature {
  icon: typeof MousePointer2;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}

const FEATURES: Feature[] = [
  {
    icon: MousePointer2,
    title: 'Element Targeting',
    description: 'Users can click any element to highlight exactly what they\'re reporting.',
    gradient: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
  },
  {
    icon: CreditCard,
    title: 'Save Prompts',
    description: 'Precise feedback = fewer wasted AI prompts when fixing issues.',
    gradient: 'from-green-500/20 to-green-500/5',
    iconColor: 'text-green-500',
  },
  {
    icon: Clock,
    title: 'Batch Issues',
    description: 'Queue issues as you find them, fix them all at once later.',
    gradient: 'from-orange-500/20 to-orange-500/5',
    iconColor: 'text-orange-500',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Auto-categorize, summarize, and generate dev prompts.',
    gradient: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-500',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function FeaturesGrid() {
  return (
    <section className="container-custom section-spacing">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-fluid-lg font-bold text-foreground mb-4">
          Why This Template?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Built for developers who want to ship fast without sacrificing quality.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {FEATURES.map((feature) => (
          <motion.div key={feature.title} variants={itemVariants}>
            <Card className="p-6 h-full card-interactive group">
              <div className={`feature-icon bg-gradient-to-br ${feature.gradient} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default FeaturesGrid;
