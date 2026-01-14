import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TaskCard } from "./TaskCard";
import type { AuditPhase } from "@/lib/auditTasks";
import { getPhaseProgress } from "@/lib/auditTasks";

interface PhaseAccordionProps {
  phase: AuditPhase;
  completedTasks: string[];
  onToggleTask: (taskId: string) => void;
  defaultOpen?: boolean;
}

export function PhaseAccordion({
  phase,
  completedTasks,
  onToggleTask,
  defaultOpen = false,
}: PhaseAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const progress = getPhaseProgress(phase.id, completedTasks);
  const isComplete = progress.percentage === 100;

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${
        isComplete
          ? "border-green-500/50 bg-green-500/5"
          : "border-border"
      }`}
    >
      <CardHeader
        className="cursor-pointer hover:bg-accent/30 transition-colors p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isComplete ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                  Phase {phase.id}
                </span>
                <h3 className="font-semibold text-foreground">{phase.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {phase.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {progress.completed}/{progress.total}
              </p>
              <p className="text-xs text-muted-foreground">tasks done</p>
            </div>
            <div className="w-24">
              <Progress value={progress.percentage} className="h-2" />
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-0 pb-4 px-4">
              <div className="space-y-3 border-t border-border pt-4">
                {phase.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isCompleted={completedTasks.includes(task.id)}
                    onToggleComplete={onToggleTask}
                  />
                ))}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
