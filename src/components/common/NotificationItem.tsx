import { formatDistanceToNow } from "date-fns";
import { Bug, Lightbulb, Palette, Sparkles, HelpCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NotificationItemProps {
  id: string;
  rawText: string;
  category?: string | null;
  severity?: string | null;
  createdAt: string;
  isRead: boolean;
  onClick: () => void;
  onViewInAdmin: () => void;
}

const categoryIcons: Record<string, typeof Bug> = {
  bug: Bug,
  feature: Lightbulb,
  ui_ux: Palette,
  suggestion: Sparkles,
  other: HelpCircle,
};

const severityColors: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-black",
  low: "bg-muted text-muted-foreground",
};

export function NotificationItem({
  rawText,
  category,
  severity,
  createdAt,
  isRead,
  onClick,
  onViewInAdmin,
}: NotificationItemProps) {
  const CategoryIcon = categoryIcons[category || "other"] || HelpCircle;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer",
        isRead 
          ? "bg-transparent hover:bg-accent/50" 
          : "bg-primary/5 hover:bg-primary/10"
      )}
      onClick={onClick}
    >
      {/* Category Icon */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isRead ? "bg-muted" : "bg-primary/10"
      )}>
        <CategoryIcon className={cn(
          "w-4 h-4",
          isRead ? "text-muted-foreground" : "text-primary"
        )} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {severity && (
            <Badge 
              variant="secondary" 
              className={cn("text-xs px-1.5 py-0", severityColors[severity])}
            >
              {severity}
            </Badge>
          )}
          {!isRead && (
            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
          )}
        </div>
        
        <p className={cn(
          "text-sm line-clamp-2",
          isRead ? "text-muted-foreground" : "text-foreground"
        )}>
          {rawText}
        </p>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onViewInAdmin();
            }}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
