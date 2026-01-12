import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const emojis = [
  { value: 1, emoji: "😞", label: "Terrible" },
  { value: 2, emoji: "😕", label: "Bad" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "😊", label: "Good" },
  { value: 5, emoji: "😍", label: "Amazing" },
];

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedRating) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
        setSelectedRating(null);
        setFeedback("");
      }, 2000);
    }
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedRating(null);
      setFeedback("");
    }, 300);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="widget-gradient h-14 w-14 rounded-full shadow-widget hover:shadow-widget-hover transition-shadow duration-300 flex items-center justify-center"
          >
            <MessageCircle className="h-6 w-6 text-primary-foreground" />
          </motion.button>
        ) : (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-panel w-80 rounded-2xl shadow-widget border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="widget-gradient px-5 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-primary-foreground">
                Share your feedback
              </h3>
              <button
                onClick={resetAndClose}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="py-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", damping: 15 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4"
                    >
                      <CheckCircle className="h-8 w-8 text-success" />
                    </motion.div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Thank you!
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Your feedback helps us improve.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    {/* Emoji Rating */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-3">
                        How was your experience?
                      </p>
                      <div className="flex justify-between">
                        {emojis.map((item) => (
                          <motion.button
                            key={item.value}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedRating(item.value)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                              selectedRating === item.value
                                ? "bg-primary/10"
                                : "hover:bg-muted"
                            }`}
                          >
                            <span className="text-2xl">{item.emoji}</span>
                            <span
                              className={`text-xs ${
                                selectedRating === item.value
                                  ? "text-primary font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {item.label}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Text Feedback */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Tell us more (optional)
                      </label>
                      <Textarea
                        placeholder="What can we improve?"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="resize-none bg-background border-border focus:border-primary focus:ring-primary/20"
                        rows={3}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      onClick={handleSubmit}
                      disabled={!selectedRating}
                      className="w-full widget-gradient hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Feedback
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackWidget;
