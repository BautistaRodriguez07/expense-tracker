import prisma from "@/lib/prisma";

export interface NotificationData {
  id: string;
  type: "invitation" | "invitation_accepted" | "invitation_rejected" | "system";
  title: string;
  message: string;
  data: Record<string, unknown>;
  read: boolean;
  created_at: Date;
  user_id: string;
  inviter_id?: string | null;
  inviter?: {
    id: string;
    name: string;
    profile_image: string | null;
  } | null;
}

export class NotificationService {
  /**
   * Create a new notification for a user
   */
  static async createNotification(data: {
    userId: string;
    inviterId?: string;
    type:
      | "invitation"
      | "invitation_accepted"
      | "invitation_rejected"
      | "system";
    title: string;
    message: string;
    data?: Record<string, unknown>;
  }) {
    return prisma.notification.create({
      data: {
        user_id: data.userId,
        inviter_id: data.inviterId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
        read: false,
      },
    });
  }

  /**
   * Get notifications for a user with pagination
   */
  static async getUserNotifications(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { user_id: userId },
        include: {
          inviter: {
            select: {
              id: true,
              name: true,
              profile_image: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.notification.count({
        where: { user_id: userId },
      }),
    ]);

    return {
      notifications,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    return await prisma.notification.updateMany({
      where: {
        id: notificationId,
        user_id: userId,
      },
      data: {
        read: true,
      },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        user_id: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string, userId: string) {
    return await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        user_id: userId,
      },
    });
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId: string): Promise<number> {
    const count = await prisma.notification.count({
      where: {
        user_id: userId,
        read: false,
      },
    });

    return count;
  }

  /**
   * Create invitation notification
   */
  static async createInvitationNotification(data: {
    invitedUserId: string;
    inviterId: string;
    spaceName: string;
    invitationToken: string;
  }) {
    return this.createNotification({
      userId: data.invitedUserId,
      inviterId: data.inviterId,
      type: "invitation",

      title: "notifications.invitation.title",
      message: "notifications.invitation.message",

      data: {
        spaceName: data.spaceName,
        invitationToken: data.invitationToken,
      },
    });
  }

  /**
   * Create invitation accepted notification
   */
  static async createInvitationAcceptedNotification(data: {
    inviterUserId: string;
    acceptedByUserId: string;
    spaceName: string;
  }) {
    return this.createNotification({
      userId: data.inviterUserId,
      inviterId: data.acceptedByUserId,
      type: "invitation_accepted",
      title: "notifications.invitationAccepted.title",
      message: "notifications.invitationAccepted.message",
      data: {
        spaceName: data.spaceName,
      },
    });
  }

  /**
   * Create invitation rejected notification
   */
  static async createInvitationRejectedNotification(data: {
    inviterUserId: string;
    rejectedByUserId: string;
    spaceName: string;
  }) {
    return this.createNotification({
      userId: data.inviterUserId,
      inviterId: data.rejectedByUserId,
      type: "invitation_rejected",
      title: "notifications.invitationRejected.title",
      message: "notifications.invitationRejected.message",
      data: {
        spaceName: data.spaceName,
      },
    });
  }
}
