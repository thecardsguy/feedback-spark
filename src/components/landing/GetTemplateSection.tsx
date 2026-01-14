/**
 * Get Template Section Component
 * Download options cards (GitHub, Remix, ZIP) with SetupGuide
 */

import { motion, Variants } from 'framer-motion';
import { Package, Github, Sparkles, Download, ArrowRight, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SetupGuide from '@/components/SetupGuide';

interface DownloadOption {
  icon: typeof Github;
  title: string;
  description: string;
  items: string[];
  buttonText: string;
  buttonIcon: typeof ExternalLink;
  href: string;
  highlight: boolean;
}

const DOWNLOAD_OPTIONS: DownloadOption[] = [
  {
    icon: Github,
    title: 'GitHub Template',
    description: 'Click "Use this template" on GitHub to create your own repo with all files and history.',
    items: ['Full project structure', 'CI/CD workflow included', 'Database migrations'],
    buttonText: 'Use Template',
    buttonIcon: ExternalLink,
    href: 'https://github.com/lovableai/feedback-chatbot',
    highlight: false,
  },
  {
    icon: Sparkles,
    title: 'Remix in Lovable',
    description: 'One-click copy to your Lovable account. Instantly start customizing with AI.',
    items: ['Instant setup', 'AI customization ready', 'Supabase pre-configured'],
    buttonText: 'Remix Now',
    buttonIcon: ArrowRight,
    href: 'https://lovable.dev/projects/create?remix=feedback-widget',
    highlight: true,
  },
  {
    icon: Download,
    title: 'Download ZIP',
    description: 'Get a clean ZIP of all widget files to drop into any existing project.',
    items: ['No git required', 'Clean file structure', 'Easy integration'],
    buttonText: 'Download ZIP',
    buttonIcon: Download,
    href: '#',
    highlight: false,
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

export function GetTemplateSection() {
  return (
    <section id="implementation" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="relative container-custom section-spacing">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
            <Package className="w-3.5 h-3.5 mr-2" />
            Get Your Copy
          </Badge>
          <h2 className="text-fluid-lg font-bold text-foreground mb-4">
            Three Ways to Get Started
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the method that works best for your workflow. All options give you the complete template.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {DOWNLOAD_OPTIONS.map((option) => (
            <motion.div key={option.title} variants={itemVariants}>
              <Card className={`p-6 h-full flex flex-col card-interactive ${option.highlight ? 'border-2 border-primary ring-4 ring-primary/10' : ''}`}>
                {option.highlight && (
                  <Badge className="absolute -top-3 left-6 bg-primary text-primary-foreground shadow-lg">
                    Recommended
                  </Badge>
                )}
                <div className={`feature-icon bg-gradient-to-br ${option.highlight ? 'from-primary/20 to-primary/5' : 'from-muted to-muted/50'} mb-5`}>
                  <option.icon className={`w-6 h-6 ${option.highlight ? 'text-primary' : 'text-foreground'}`} />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">{option.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{option.description}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {option.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full gap-2 ${option.highlight ? '' : 'variant-outline'}`} 
                  variant={option.highlight ? 'default' : 'outline'} 
                  asChild
                >
                  <a 
                    href={option.href} 
                    target={option.href.startsWith('http') ? '_blank' : undefined} 
                    rel="noopener noreferrer"
                  >
                    {option.buttonText}
                    <option.buttonIcon className="w-4 h-4" />
                  </a>
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Setup Guide */}
        <SetupGuide />
      </div>
    </section>
  );
}

export default GetTemplateSection;
