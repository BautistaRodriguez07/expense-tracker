"use server";

import { validateAuth } from "@/features/auth/services/auth.service";
import { NotificationService } from "../services/notification.service";

function serializeNotification(notification: {
  id: string;
  type: string;
  title: string;
  message: string;
  data: unknown;
  read: boolean;
  created_at: Date;
  inviter?: {
    id: string;
    name: string;
    profile_image: string | null;
  } | null;
}) {
  return {
    ...notification,
    created_at: notification.created_at.toISOString(),
  };
}

export async function getNotifications(page = 1, limit = 10) {
  let auth;
  try {
    auth = await validateAuth();
  } catch (error) {
    console.error("Failed to validate auth:", error);
    auth = null;
  }

  if (!auth) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const result = await NotificationService.getUserNotifications(
      auth.dbUser.id,
      page,
      limit,
    );

    return {
      success: true,
      data: {
        ...result,
        notifications: result.notifications.map(serializeNotification),
      },
    };
  } catch (error) {
    console.error("Failed to get notifications:", error);
    return {
      success: false,
      error: "Failed to load notifications",
    };
  }
}

export async function getUnreadCount() {
  let auth;
  try {
    auth = await validateAuth();
  } catch (error) {
    console.error("Failed to validate auth:", error);
    auth = null;
  }

  if (!auth) {
    return {
      success: false,
      count: 0,
    };
  }

  try {
    const count = await NotificationService.getUnreadCount(auth.dbUser.id);

    return {
      success: true,
      count,
    };
  } catch (error) {
    console.error("Failed to get unread count:", error);
    return {
      success: false,
      count: 0,
    };
  }
}

export async function markAsRead(notificationId: string) {
  let auth;
  try {
    auth = await validateAuth();
  } catch (error) {
    console.error("Failed to validate auth:", error);
    auth = null;
  }

  if (!auth) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    await NotificationService.markAsRead(notificationId, auth.dbUser.id);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return {
      success: false,
      error: "Failed to mark notification as read",
    };
  }
}

export async function markAllAsRead() {
  let auth;
  try {
    auth = await validateAuth();
  } catch (error) {
    console.error("Failed to validate auth:", error);
    auth = null;
  }

  if (!auth) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    await NotificationService.markAllAsRead(auth.dbUser.id);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    return {
      success: false,
      error: "Failed to mark all notifications as read",
    };
  }
}

export async function deleteNotification(notificationId: string) {
  let auth;
  try {
    auth = await validateAuth();
  } catch (error) {
    console.error("Failed to validate auth:", error);
    auth = null;
  }

  if (!auth) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    await NotificationService.deleteNotification(
      notificationId,
      auth.dbUser.id,
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return {
      success: false,
      error: "Failed to delete notification",
    };
  }
}

export async function getRecentNotifications(limit = 3) {
  let auth;
  try {
    auth = await validateAuth();
  } catch (error) {
    console.error("Failed to validate auth:", error);
    auth = null;
  }

  if (!auth) {
    return {
      success: false,
      data: [],
    };
  }

  try {
    const result = await NotificationService.getUserNotifications(
      auth.dbUser.id,
      1,
      limit,
    );

    return {
      success: true,
      data: result.notifications.map(serializeNotification),
    };
  } catch (error) {
    console.error("Failed to get recent notifications:", error);
    return {
      success: false,
      data: [],
    };
  }
}
