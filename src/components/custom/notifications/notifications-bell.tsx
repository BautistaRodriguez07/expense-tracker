"use client";

import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { IoNotifications } from "react-icons/io5";
import { NotificationsBadge } from "./notifications-badge";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { toast } from "sonner";

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

export const NotificationsBell = () => {
  const { unreadCount, recentNotifications, markNotificationAsRead } =
    useNotifications({
      pollingInterval: 30000,
      recentLimit: 3,
    });

  useEffect(() => {
    const handleNewNotification = (event: Event) => {
      const customEvent = event as CustomEvent<{
        count: number;
        notifications?: Notification[];
      }>;
      const count = customEvent.detail?.count ?? 1;
      const notifications = customEvent.detail?.notifications ?? [];

      if (notifications.length > 0) {
        // Show individual notification toasts for each new notification
        notifications.forEach((notification) => {
          const notificationInfo = getNotificationInfo(notification);

          toast.info(notificationInfo.message, {
            duration: 5000,
            description: `${notificationInfo.name} • ${formatTime(notification.created_at)}`,
            action: {
              label: "Ver",
              onClick: () => {
                window.location.href = "/notifications";
              },
            },
          });
        });
      } else {
        // Fallback to generic message
        const message =
          count === 1
            ? "Tienes una nueva notificación"
            : `Tienes ${count} nuevas notificaciones`;

        toast.info(message, {
          duration: 3000,
          action: {
            label: "Ver",
            onClick: () => {
              window.location.href = "/notifications";
            },
          },
        });
      }
    };

    window.addEventListener("new-notification", handleNewNotification);

    return () => {
      window.removeEventListener("new-notification", handleNewNotification);
    };
  }, []);

  const handleNotificationClick = async (
    notificationId: string,
    isRead: boolean,
  ) => {
    if (isRead) return;

    try {
      await markNotificationAsRead(notificationId);
      window.dispatchEvent(new CustomEvent("notification-updated"));
    } catch (error) {
      console.error("Error to mark notification as read", error);
    }
  };

  const getNotificationInfo = (notification: Notification) => {
    const inviterName = notification.inviter?.name || "System";
    const inviterImage = notification.inviter?.profile_image || undefined;

    switch (notification.type) {
      case "invitation":
        const invitationData = notification.data as {
          spaceName: string;
        };
        return {
          name: inviterName,
          image: inviterImage,
          message: `${inviterName} te invitó a unirte a "${invitationData.spaceName}"`,
        };
      case "invitation_accepted":
        const acceptedData = notification.data as {
          spaceName: string;
        };
        return {
          name: inviterName,
          image: inviterImage,
          message: `${inviterName} aceptó tu invitación a "${acceptedData.spaceName}"`,
        };
      case "invitation_rejected":
        const rejectedData = notification.data as {
          spaceName: string;
        };
        return {
          name: inviterName,
          image: inviterImage,
          message: `${inviterName} rechazó tu invitación a "${rejectedData.spaceName}"`,
        };
      default:
        return {
          name: "System",
          image: undefined,
          message: notification.message,
        };
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "ahora";
    if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `hace ${Math.floor(diffInMinutes / 60)} h`;
    return `hace ${Math.floor(diffInMinutes / 1440)} días`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        <IoNotifications size={30} />
        {unreadCount > 0 && <NotificationsBadge count={unreadCount} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="card-container w-80 max-h-96 overflow-y-auto"
        align="end"
        side="bottom"
      >
        {recentNotifications.length > 0 ? (
          <>
            {recentNotifications.map((notification) => {
              const notificationInfo = getNotificationInfo(notification);
              return (
                <DropdownMenuItem key={notification.id} asChild>
                  <Link
                    className="flex items-start flex-col cursor-pointer p-3 w-full max-w-full"
                    href="/notifications"
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.read,
                      )
                    }
                  >
                    <div className="flex items-start gap-3 w-full">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        {notificationInfo.image ? (
                          <Image
                            src={notificationInfo.image}
                            alt={notificationInfo.name || "User"}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {notificationInfo.name?.charAt(0).toUpperCase() ||
                                "U"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                          <span className="font-medium txt text-sm line-clamp-2 flex-1">
                            {notificationInfo.message}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs txt-muted">
                          <span className="truncate">
                            {notificationInfo.name || "System"}
                          </span>
                          <span>•</span>
                          <span>{formatTime(notification.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                className="link underline font-medium w-full text-center p-2"
                href="/notifications"
              >
                Ver todas las notificaciones ({unreadCount})
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem disabled>
            <span className="txt-muted w-full text-center">
              No tienes notificaciones
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
