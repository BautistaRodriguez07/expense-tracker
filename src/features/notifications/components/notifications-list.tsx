"use client";

import {
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  getNotifications,
  markAsRead,
} from "../actions/get-notifications.action";
import { InvitationNotification } from "./invitation-notification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { DeleteNotificationDialog } from "./delete-notification-dialog";
import { Loading } from "@/components/custom/loading/loading";
import { useTranslations } from "next-intl";
import { CustomPagination } from "@/components/custom/pagination/pagination";

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

interface NotificationsListProps {
  initialPage?: number;
}

const NOTIFICATIONS_PER_PAGE = 15;

export function NotificationsList({ initialPage = 1 }: NotificationsListProps) {
  const t = useTranslations("invitations");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [notificationToDelete, setNotificationToDelete] = useState<
    string | null
  >(null);

  const isLoadingRef = useRef(false);
  const lastUpdateTimeRef = useRef(Date.now());

  // useOptimistic
  const [optimisticNotifications, setOptimisticNotifications] = useOptimistic(
    notifications,
    (
      currentNotifications,
      update: { id: string; read?: boolean; remove?: boolean },
    ) => {
      if (update.remove) {
        return currentNotifications.filter((n) => n.id !== update.id);
      }
      return currentNotifications.map((n) =>
        n.id === update.id ? { ...n, read: update.read ?? n.read } : n,
      );
    },
  );

  useEffect(() => {
    loadNotifications(initialPage);
  }, [initialPage]);

  // Listen for new notifications and refresh the list
  useEffect(() => {
    let debounceTimeout: NodeJS.Timeout | undefined;

    // const handleNewNotification = () => {
    //   loadNotifications(currentPage);
    // };

    const handleNotificationUpdate = () => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateTimeRef.current;

      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      if (timeSinceLastUpdate < 2000) {
        debounceTimeout = setTimeout(() => {
          if (!isLoadingRef.current) {
            lastUpdateTimeRef.current = Date.now();
            loadNotifications(currentPage);
          }
        }, 1000);
      } else {
        if (!isLoadingRef.current) {
          lastUpdateTimeRef.current = Date.now();
          loadNotifications(currentPage);
        }
      }
    };

    window.addEventListener("notification-updated", handleNotificationUpdate);
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      window.removeEventListener(
        "notification-updated",
        handleNotificationUpdate,
      );
    };
  }, [currentPage]);

  const loadNotifications = async (page: number) => {
    if (isLoadingRef.current) return;
    try {
      isLoadingRef.current = true;
      setLoading(true);
      const result = await getNotifications(page, NOTIFICATIONS_PER_PAGE);

      if (result.success && result.data) {
        setNotifications(result.data.notifications);
        setTotalPages(result.data.pages);
        setCurrentPage(result.data.currentPage);
      } else {
        setError(result.error || "Failed to load notifications");
      }
    } catch (loadError) {
      console.error("Failed to load notifications:", loadError);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

  const handleOptimisticUpdate = (notificationId: string, read: boolean) => {
    setOptimisticNotifications({ id: notificationId, read });
  };

  // const handleNotificationAction = () => {
  //   if (updateTimeoutRef.current) {
  //     clearTimeout(updateTimeoutRef.current);
  //   }
  //   loadNotifications(currentPage);
  // };

  const handleMarkAsRead = async (notificationId: string) => {
    startTransition(async () => {
      setOptimisticNotifications({ id: notificationId, read: true });

      try {
        const result = await markAsRead(notificationId);

        if (result.success) {
          setNotifications(
            notifications.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n,
            ),
          );

          window.dispatchEvent(new CustomEvent("notification-updated"));
        } else {
          setNotifications([...notifications]);
        }
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
        setNotifications([...notifications]);
      }
    });
  };

  const handleDeleteComplete = (notificationId: string) => {
    setOptimisticNotifications({ id: notificationId, remove: true });
    setNotifications(notifications.filter((n) => n.id !== notificationId));
    window.dispatchEvent(new CustomEvent("notification-updated"));
  };

  const getNotificationInfo = (notification: Notification) => {
    if (notification.inviter) {
      return {
        name: notification.inviter.name,
        image: notification.inviter.profile_image || undefined,
      };
    }

    return {
      name: "System",
      image: undefined,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full card-container border-red-200 dark:border-red-800">
        <CardContent className="p-4">
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          <Button
            onClick={() => loadNotifications(currentPage)}
            className="mt-4"
            variant="outline"
          >
            {t("retry")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const invitationNotifications = optimisticNotifications.filter(
    (n) => n.type === "invitation",
  );
  const otherNotifications = optimisticNotifications.filter(
    (n) => n.type !== "invitation",
  );

  return (
    <div className="space-y-6">
      {/* Invitation Notifications */}
      {invitationNotifications.length > 0 && (
        <div className="space-y-4">
          {invitationNotifications.map((notification) => (
            <InvitationNotification
              key={notification.id}
              notification={
                notification as Notification & {
                  data: {
                    spaceName: string;
                    invitationToken: string;
                  };
                }
              }
              onOptimisticUpdate={handleOptimisticUpdate}
            />
          ))}
        </div>
      )}

      {/* Other Notifications */}
      {otherNotifications.length > 0 && (
        <div className="space-y-4">
          {otherNotifications.map((notification) => {
            const notificationInfo = getNotificationInfo(notification);
            return (
              <Card
                key={notification.id}
                className="w-full card-container relative"
              >
                {!notification.read && (
                  <Badge className="h-2 min-w-2 rounded-full px-1 font-mono tabular-nums bg-red-500 dark:bg-red-400 absolute top-1/2 left-5" />
                )}

                <div className="flex items-center gap-4">
                  <div className="ml-5 flex items-center">
                    <Avatar className="size-15">
                      <AvatarImage src={notificationInfo.image} />
                      <AvatarFallback>
                        {notificationInfo.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="txt text-xl">
                              {notification.type === "invitation_accepted"
                                ? t("invitationAcceptedTitle")
                                : notification.type === "invitation_rejected"
                                  ? t("invitationRejectedTitle")
                                  : notification.title}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm txt-muted mt-1">
                          {notification.type === "invitation_accepted"
                            ? t("invitationAcceptedMessage", {
                                userName: notificationInfo.name,
                                spaceName: (
                                  notification.data as { spaceName: string }
                                ).spaceName,
                              })
                            : notification.type === "invitation_rejected"
                              ? t("invitationRejectedMessage", {
                                  userName: notificationInfo.name,
                                  spaceName: (
                                    notification.data as { spaceName: string }
                                  ).spaceName,
                                })
                              : notification.message}
                        </p>

                        <p className="text-xs txt-muted">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </CardContent>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      {!notification.read && (
                        <Button
                          size="sm"
                          className="bg-transparent hover:bg-transparent"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <IoCheckmark className="dark:text-white text-black" />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setNotificationToDelete(notification.id)}
                      >
                        <IoClose className="dark:text-white text-black" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Shared Delete Dialog */}
      {notificationToDelete && (
        <DeleteNotificationDialog
          notificationId={notificationToDelete}
          open={!!notificationToDelete}
          onOpenChange={(open) => !open && setNotificationToDelete(null)}
          onDelete={() => handleDeleteComplete(notificationToDelete)}
        />
      )}

      {/* Empty State */}
      {optimisticNotifications.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="txt-muted">{t("noNotifications")}</p>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <CustomPagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
