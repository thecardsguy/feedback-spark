import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileCode, ArrowRight, ArrowLeft } from "lucide-react";
import { FileEntry, getCategoryLabel, getCategoryColor } from "@/lib/fileRegistry";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FileCardProps {
  file: FileEntry;
}

export function FileCard({ file }: FileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent/50 transition-colors text-left"
      >
        <FileCode className="w-5 h-5 text-muted-foreground shrink-0" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground">{file.name}</span>
            <Badge 
              variant="outline" 
              className={cn("text-xs", getCategoryColor(file.category))}
            >
              {getCategoryLabel(file.category)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate mt-0.5">
            {file.path}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-muted-foreground">
            {file.lines} lines
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-4 border-t border-border space-y-4 bg-muted/30">
              {/* Description */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Description
                </h4>
                <p className="text-sm text-foreground">{file.description}</p>
              </div>

              {/* Imports */}
              {file.imports && file.imports.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    Imports ({file.imports.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {file.imports.map((imp) => (
                      <Badge 
                        key={imp} 
                        variant="secondary"
                        className="text-xs font-mono"
                      >
                        {imp}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Used By */}
              {file.usedBy && file.usedBy.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" />
                    Used By ({file.usedBy.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {file.usedBy.map((used) => (
                      <Badge 
                        key={used} 
                        variant="outline"
                        className="text-xs font-mono"
                      >
                        {used}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* File Path */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Full Path
                </h4>
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-foreground">
                  {file.path}
                </code>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
