import { motion } from "framer-motion";
import { Code, Palette, Zap, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightweight",
    description: "Under 10kb gzipped. Won't slow down your site.",
  },
  {
    icon: Palette,
    title: "Customizable",
    description: "Match your brand with custom colors and styles.",
  },
  {
    icon: Code,
    title: "Easy Integration",
    description: "Drop-in component for any React project.",
  },
  {
    icon: Sparkles,
    title: "Animated",
    description: "Smooth Framer Motion animations built-in.",
  },
];

const DemoSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A beautiful, production-ready feedback widget with all the features
            you need to collect user insights.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-card rounded-2xl p-6 shadow-card border border-border"
            >
              <div className="w-12 h-12 rounded-xl widget-gradient flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
