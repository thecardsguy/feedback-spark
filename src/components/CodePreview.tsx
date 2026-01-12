import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

const codeSnippet = `import FeedbackWidget from './components/FeedbackWidget';

function App() {
  return (
    <div>
      <YourApp />
      <FeedbackWidget />
    </div>
  );
}`;

const CodePreview = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 px-6 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple to integrate
          </h2>
          <p className="text-lg text-muted-foreground">
            Just import and add to your app. That's it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div className="bg-foreground rounded-2xl overflow-hidden shadow-widget">
            {/* Window Controls */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-muted-foreground/20">
              <div className="w-3 h-3 rounded-full bg-destructive/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-success/80" />
              <span className="ml-4 text-xs text-muted-foreground">App.tsx</span>
            </div>

            {/* Code */}
            <div className="p-6 relative">
              <pre className="text-sm text-background font-mono overflow-x-auto">
                <code>{codeSnippet}</code>
              </pre>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 rounded-lg bg-muted-foreground/10 hover:bg-muted-foreground/20 transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CodePreview;
