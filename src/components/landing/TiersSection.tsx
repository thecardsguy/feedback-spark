/**
 * Tiers Section Component
 * Overview of Basic, Standard, and Pro tier cards with TierComparison
 */

import { motion, Variants } from 'framer-motion';
import { MessageSquare, Zap, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TierComparison } from '@/components/tiers';

interface TierCard {
  icon: typeof MessageSquare;
  title: string;
  description: string;
  highlight: boolean;
  gradient: string;
}

const TIER_CARDS: TierCard[] = [
  { 
    icon: MessageSquare, 
    title: 'Basic', 
    description: 'Simple feedback collection for any app. No backend required.', 
    highlight: false, 
    gradient: 'from-muted to-muted' 
  },
  { 
    icon: Zap, 
    title: 'Standard', 
    description: 'Full admin dashboard with statistics and status management.', 
    highlight: true, 
    gradient: 'from-primary/20 to-primary/5' 
  },
  { 
    icon: Shield, 
    title: 'Pro', 
    description: 'AI-powered summarization, categorization, and developer prompts.', 
    highlight: false, 
    gradient: 'from-purple-500/20 to-purple-500/5' 
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

export function TiersSection() {
  return (
    <section className="border-y border-border/50 bg-muted/30">
      <div className="container-custom section-spacing">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-fluid-lg font-bold text-foreground mb-4">
            Three Tiers, One Template
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            All tiers included in the download. Enable features as needed.
          </p>
        </motion.div>

        {/* Tier Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {TIER_CARDS.map((tier) => (
            <motion.div key={tier.title} variants={itemVariants}>
              <Card className={`p-6 h-full relative card-interactive ${tier.highlight ? 'border-2 border-primary ring-4 ring-primary/10' : ''}`}>
                {tier.highlight && (
                  <Badge className="absolute -top-3 left-6 bg-primary text-primary-foreground shadow-lg">
                    Popular
                  </Badge>
                )}
                <div className={`feature-icon bg-gradient-to-br ${tier.gradient} mb-5`}>
                  <tier.icon className={`w-6 h-6 ${tier.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">{tier.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{tier.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed Comparison */}
        <TierComparison />
      </div>
    </section>
  );
}

export default TiersSection;
