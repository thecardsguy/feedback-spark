import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Play, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { AuditTask } from "@/lib/auditTasks";

interface TaskCardProps {
  task: AuditTask;
  isCompleted: boolean;
  onToggleComplete: (taskId: string) => void;
}

export function TaskCard({ task, isCompleted, onToggleComplete }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(task.prompt);
      setIsCopied(true);
      toast.success("Prompt copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy prompt");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`transition-all duration-300 ${
          isCompleted
            ? "border-green-500/50 bg-green-500/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Completion Checkbox */}
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isCompleted
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-muted-foreground/50 hover:border-primary"
              }`}
            >
              {isCompleted && <Check className="w-3 h-3" />}
            </button>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className={`font-medium text-sm ${
                    isCompleted ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {task.title}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {task.order}/{4}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{task.description}</p>

              {/* Expand/Collapse Prompt */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Hide prompt
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    Show prompt
                  </>
                )}
              </button>

              {/* Prompt Content */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3"
                >
                  <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground font-mono">
                    {task.prompt}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyPrompt}
                className="h-8 px-2"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={handleCopyPrompt}
                className="h-8 gap-1"
              >
                <Play className="w-3.5 h-3.5" />
                Run
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
