import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./NotificationItem";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  raw_text: string;
  category?: string | null;
  severity?: string | null;
  created_at: string;
  isRead: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationCenter({
  notifications,
  unreadCount,
  isConnected,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationCenterProps) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs"
              variant="destructive"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          {/* Connection indicator */}
          <span 
            className={cn(
              "absolute bottom-0 right-0 w-2 h-2 rounded-full border border-background",
              isConnected ? "bg-green-500" : "bg-muted-foreground"
            )} 
          />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={onMarkAllAsRead}
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <Inbox className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              New feedback will appear here
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="p-2 space-y-1">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  id={notification.id}
                  rawText={notification.raw_text}
                  category={notification.category}
                  severity={notification.severity}
                  createdAt={notification.created_at}
                  isRead={notification.isRead}
                  onClick={() => onMarkAsRead(notification.id)}
                  onViewInAdmin={() => navigate("/admin")}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Footer */}
        <div className="border-t px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => navigate("/admin")}
          >
            View all in Admin Dashboard
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
