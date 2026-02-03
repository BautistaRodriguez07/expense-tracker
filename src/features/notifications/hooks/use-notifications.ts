import { useState, useEffect, useCallback, useRef } from "react";
import { getUnreadCount } from "@/features/notifications/actions/get-notifications.action";
import { getRecentNotifications } from "@/features/notifications/actions/get-notifications.action";

interface Notification {
  id: string;
  type: "invitation" | "invitation_accepted" | "invitation_rejected" | "system";
  title: string;
  message: string;
  data: Record<string, unknown>;
  read: boolean;
  created_at: string;
  inviter?: {
    id: string;
    name: string;
    profile_image: string | null;
  } | null;
}

interface UseNotificationsOptions {
  pollingInterval?: number;
  recentLimit?: number;
  enablePolling?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const {
    pollingInterval = 30000,
    recentLimit = 3,
    enablePolling = true,
  } = options;

  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<
    Notification[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const previousCountRef = useRef(0);

  const loadNotifications = useCallback(async () => {
    try {
      const [countResult, recentResult] = await Promise.all([
        getUnreadCount(),
        getRecentNotifications(recentLimit),
      ]);

      if (countResult.success && recentResult.success) {
        const newCount = countResult.count;
        const previousCount = previousCountRef.current;

        // detect new notifications
        if (newCount > previousCount && previousCount > 0) {
          // if new notifications are detected, dispatch event
          window.dispatchEvent(
            new CustomEvent("new-notification", {
              detail: { count: newCount - previousCount },
            }),
          );
        }

        previousCountRef.current = newCount;
        setUnreadCount(newCount);
        setRecentNotifications(recentResult.data);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [recentLimit]);

  const decrementCount = useCallback(() => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markNotificationAsRead = useCallback(
    (notificationId: string) => {
      setRecentNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
      decrementCount();
    },
    [decrementCount],
  );

  useEffect(() => {
    loadNotifications();

    const handleNotificationUpdate = () => {
      loadNotifications();
    };

    window.addEventListener("notification-updated", handleNotificationUpdate);

    let pollingIntervalId: NodeJS.Timeout | null = null;

    if (enablePolling) {
      pollingIntervalId = setInterval(() => {
        loadNotifications();
      }, pollingInterval);
    }

    return () => {
      window.removeEventListener(
        "notification-updated",
        handleNotificationUpdate,
      );
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };
  }, [loadNotifications, pollingInterval, enablePolling]);

  return {
    unreadCount,
    recentNotifications,
    isLoading,
    loadNotifications,
    decrementCount,
    markNotificationAsRead,
  };
}
