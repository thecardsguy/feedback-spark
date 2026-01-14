import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, RotateCcw } from "lucide-react";
import { Navbar } from "@/components/common";
import { AdminGuard } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { AuditOverview, PhaseAccordion } from "@/components/audit";
import { auditPhases } from "@/lib/auditTasks";
import { toast } from "sonner";

const STORAGE_KEY = "feedback-widget-audit-progress";

export default function Audit() {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCompletedTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load audit progress:", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTasks));
  }, [completedTasks]);

  const handleToggleTask = (taskId: string) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      setCompletedTasks([]);
      toast.success("Progress reset successfully");
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <Navbar />

      <main className="container-custom py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Implementation Audit
                </h1>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                Interactive checklist of 28 tasks across 7 phases. Click "Run" to copy a task's 
                prompt to your clipboard, then paste it into Lovable.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2 w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Progress</span>
              <span className="sm:hidden">Reset</span>
            </Button>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <AuditOverview completedTasks={completedTasks} />

        {/* Phases */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {auditPhases.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <PhaseAccordion
                phase={phase}
                completedTasks={completedTasks}
                onToggleTask={handleToggleTask}
                defaultOpen={index === 0}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Completion Message */}
        {completedTasks.length === 28 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 text-center"
          >
            <Sparkles className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              🎉 Implementation Complete!
            </h2>
            <p className="text-muted-foreground">
              You've completed all 28 tasks. Your Feedback Widget is fully implemented!
            </p>
          </motion.div>
        )}
        </main>
      </div>
    </AdminGuard>
  );
}
