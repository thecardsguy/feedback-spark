import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNotificationSound } from "./useNotificationSound";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  raw_text: string;
  category: string | null;
  severity: string | null;
  status: string | null;
  page_url: string | null;
  device_type: string | null;
  user_id: string | null;
  ai_summary: string | null;
  ai_category: string | null;
  ai_question_for_dev: string | null;
  created_at: string;
  updated_at: string | null;
  isRead: boolean;
}

const MAX_NOTIFICATIONS = 20;

export function useRealtimeNotifications(isAdmin: boolean) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const { playSound } = useNotificationSound();

  // Fetch recent feedback as notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("id, raw_text, category, severity, status, page_url, device_type, user_id, ai_summary, ai_category, ai_question_for_dev, created_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(MAX_NOTIFICATIONS);

      if (error) {
        console.error("Failed to fetch notifications:", error);
        return;
      }

      // Get read statuses
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      let readFeedbackIds: string[] = [];
      if (userId) {
        const { data: reads } = await supabase
          .from("notification_reads")
          .select("feedback_id")
          .eq("user_id", userId);
        
        readFeedbackIds = reads?.map(r => r.feedback_id) || [];
      }

      const notificationItems: NotificationItem[] = (data || []).map(item => ({
        ...item,
        isRead: readFeedbackIds.includes(item.id),
      }));

      setNotifications(notificationItems);
      setUnreadCount(notificationItems.filter(n => !n.isRead).length);
    } catch (e) {
      console.error("Failed to fetch notifications:", e);
    }
  }, [isAdmin]);

  // Mark notification as read
  const markAsRead = useCallback(async (feedbackId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    if (!userId) return;

    try {
      await supabase
        .from("notification_reads")
        .upsert({ user_id: userId, feedback_id: feedbackId }, { onConflict: "user_id,feedback_id" });

      setNotifications(prev => 
        prev.map(n => n.id === feedbackId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error("Failed to mark as read:", e);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    if (!userId) return;

    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length === 0) return;

    try {
      await supabase
        .from("notification_reads")
        .upsert(
          unreadIds.map(feedbackId => ({ user_id: userId, feedback_id: feedbackId })),
          { onConflict: "user_id,feedback_id" }
        );

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("Failed to mark all as read:", e);
    }
  }, [notifications]);

  // Set up realtime subscription
  useEffect(() => {
    if (!isAdmin) return;

    fetchNotifications();

    const channel = supabase
      .channel("feedback-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "feedback",
        },
        (payload) => {
          const newFeedback = payload.new as NotificationItem;
          
          // Add to notifications
          const newNotification: NotificationItem = {
            id: newFeedback.id,
            raw_text: newFeedback.raw_text,
            category: newFeedback.category,
            severity: newFeedback.severity,
            status: newFeedback.status,
            page_url: newFeedback.page_url,
            device_type: newFeedback.device_type,
            user_id: newFeedback.user_id,
            ai_summary: newFeedback.ai_summary,
            ai_category: newFeedback.ai_category,
            ai_question_for_dev: newFeedback.ai_question_for_dev,
            created_at: newFeedback.created_at,
            updated_at: newFeedback.updated_at,
            isRead: false,
          };

          setNotifications(prev => [newNotification, ...prev].slice(0, MAX_NOTIFICATIONS));
          setUnreadCount(prev => prev + 1);

          // Play sound for critical/high severity
          if (newFeedback.severity === "critical" || newFeedback.severity === "high") {
            playSound();
          }

          // Show toast
          toast.info("New Feedback", {
            description: newFeedback.raw_text.slice(0, 100) + (newFeedback.raw_text.length > 100 ? "..." : ""),
          });
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, fetchNotifications, playSound]);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}
