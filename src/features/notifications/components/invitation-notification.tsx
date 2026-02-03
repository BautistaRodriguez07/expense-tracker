"use client";

import { useState, useEffect, useOptimistic, startTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoCheckmark } from "react-icons/io5";
import { toast } from "sonner";
import { acceptInvitation } from "@/features/space/actions/accept-invitation.action";
import { rejectInvitation } from "@/features/space/actions/reject-invitation.action";
import { markAsRead } from "../actions/get-notifications.action";
import { checkInvitationStatus } from "@/features/space/actions/check-invitation-status.action";
import { DeleteNotificationDialog } from "./delete-notification-dialog";
import { useTranslations } from "next-intl";

interface InvitationNotificationProps {
  notification: {
    id: string;
    title: string;
    message: string;
    data: {
      spaceName: string;
      invitationToken: string;
    };
    inviter?: {
      id: string;
      name: string;
      profile_image: string | null;
    } | null;
    created_at: string;
    read: boolean;
  };
  onOptimisticUpdate?: (notificationId: string, read: boolean) => void;
}

type InvitationState = {
  actionTaken: boolean;
  actionType: "accepted" | "rejected" | null;
  read: boolean;
};

const getNotificationInfo = (
  notification: InvitationNotificationProps["notification"],
) => {
  return {
    name: notification.inviter?.name || "Unknown User",
    image: notification.inviter?.profile_image || undefined,
  };
};

export function InvitationNotification({
  notification,
  onOptimisticUpdate,
}: InvitationNotificationProps) {
  const [error, setError] = useState("");
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const t = useTranslations("invitations");

  // initial state
  const [state, setState] = useState<InvitationState>({
    actionTaken: false,
    actionType: null,
    read: notification.read,
  });

  // optimistic state
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, newState: Partial<InvitationState>) => {
      return {
        ...currentState,
        ...newState,
      };
    },
  );

  // Check invitation status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await checkInvitationStatus(
          notification.data.invitationToken,
        );

        if (!result.success || result.status !== "pending") {
          setState({
            actionTaken: true,
            actionType:
              result.success && result.status === "accepted"
                ? "accepted"
                : result.success && result.status === "rejected"
                  ? "rejected"
                  : null,
            read: true,
          });
          if (!notification.read) {
            await markAsRead(notification.id);
            onOptimisticUpdate?.(notification.id, true);
          }
        }
      } catch (error) {
        console.error("Error checking invitation status:", error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkStatus();
  }, [
    notification.data.invitationToken,
    notification.id,
    notification.read,
    onOptimisticUpdate,
  ]);

  const handleAccept = async () => {
    if (optimisticState.actionTaken || isProcessing) return;

    setIsProcessing(true);

    startTransition(async () => {
      setOptimisticState({
        actionTaken: true,
        actionType: "accepted",
        read: true,
      });

      onOptimisticUpdate?.(notification.id, true);

      const invitationPromise = acceptInvitation(
        notification.data.invitationToken,
      )
        .then(async (result) => {
          if (result.success) {
            setState({
              actionTaken: true,
              actionType: "accepted",
              read: true,
            });

            markAsRead(notification.id).catch(console.error);

            window.dispatchEvent(
              new CustomEvent("self-notification-updated", {
                detail: {
                  notificationId: notification.id,
                  read: true,
                  actionType: "accepted",
                },
              }),
            );
            window.dispatchEvent(new CustomEvent("notification-updated"));

            return result;
          } else {
            startTransition(() => {
              setState({
                actionTaken: false,
                actionType: null,
                read: notification.read,
              });
              onOptimisticUpdate?.(notification.id, notification.read);
            });

            throw new Error(result.error || "Failed to accept invitation");
          }
        })
        .catch((error) => {
          console.error("Accept invitation error:", error);

          startTransition(() => {
            setState({
              actionTaken: false,
              actionType: null,
              read: notification.read,
            });
            onOptimisticUpdate?.(notification.id, notification.read);
          });

          throw error;
        })
        .finally(() => {
          setIsProcessing(false);
        });

      toast.promise(invitationPromise, {
        loading: t("processing") || "Processing invitation...",
        success: t("invitationAccepted") || "Invitation accepted",
        error: (error) =>
          error.message ||
          t("invitationAcceptedError") ||
          "Failed to accept invitation",
      });
    });
  };

  const handleReject = async () => {
    if (optimisticState.actionTaken || isProcessing) return;

    setIsProcessing(true);
    startTransition(async () => {
      setOptimisticState({
        actionTaken: true,
        actionType: "rejected",
        read: true,
      });

      onOptimisticUpdate?.(notification.id, true);

      const invitationPromise = rejectInvitation(
        notification.data.invitationToken,
      )
        .then(async (result) => {
          if (result.success) {
            setState({
              actionTaken: true,
              actionType: "rejected",
              read: true,
            });

            markAsRead(notification.id).catch(console.error);

            window.dispatchEvent(
              new CustomEvent("self-notification-updated", {
                detail: {
                  notificationId: notification.id,
                  read: true,
                  actionType: "rejected",
                },
              }),
            );
            window.dispatchEvent(new CustomEvent("notification-updated"));

            return result;
          } else {
            startTransition(() => {
              setState({
                actionTaken: false,
                actionType: null,
                read: notification.read,
              });
              onOptimisticUpdate?.(notification.id, notification.read);
            });

            throw new Error(result.error || "Failed to reject invitation");
          }
        })
        .catch((error) => {
          console.error("Reject invitation error:", error);

          startTransition(() => {
            setState({
              actionTaken: false,
              actionType: null,
              read: notification.read,
            });
            onOptimisticUpdate?.(notification.id, notification.read);
          });

          throw error;
        })
        .finally(() => {
          setIsProcessing(false);
        });

      toast.promise(invitationPromise, {
        loading: t("processing") || "Processing invitation...",
        success: t("invitationRejected") || "Invitation rejected",
        error: (error) =>
          error.message ||
          t("invitationRejectedError") ||
          "Failed to reject invitation",
      });
    });
  };

  const handleMarkAsRead = async () => {
    setOptimisticState({
      read: true,
    });

    onOptimisticUpdate?.(notification.id, true);
    startTransition(async () => {
      try {
        await markAsRead(notification.id);
        setState((prev) => ({
          ...prev,
          read: true,
        }));

        window.dispatchEvent(
          new CustomEvent("self-notification-updated", {
            detail: {
              notificationId: notification.id,
              read: true,
            },
          }),
        );
        window.dispatchEvent(new CustomEvent("notification-updated"));
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
        setState((prev) => ({
          ...prev,
          read: notification.read,
        }));
        onOptimisticUpdate?.(notification.id, notification.read);
      }
    });
  };

  const notificationInfo = getNotificationInfo(notification);

  return (
    <>
      {/* Error Message */}
      {error && (
        <Card className="w-full card-container border-red-200 dark:border-red-800 mb-4">
          <CardContent className="p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Main Notification Card */}
      <Card className="w-full card-container relative">
        {!optimisticState.read && (
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
            <div className="w-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="txt text-xl">
                      {t("invitedToJoin", {
                        spaceName: notification.data.spaceName,
                      })}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm txt-muted mt-1">
                  {t("invitedBy", {
                    name: notificationInfo.name,
                  })}
                </p>

                <p className="text-xs txt-muted">
                  {new Date(notification.created_at).toLocaleString()}
                </p>

                {/* Action Buttons */}
                {!optimisticState.actionTaken && !checkingStatus ? (
                  <div className="flex gap-2 pt-3">
                    <Button
                      size="sm"
                      onClick={handleAccept}
                      disabled={optimisticState.actionTaken || isProcessing}
                      className="flex-1 btn-success"
                    >
                      {t("accept")}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleReject}
                      disabled={optimisticState.actionTaken || isProcessing}
                      className="flex-1 btn-danger"
                    >
                      {t("reject")}
                    </Button>
                  </div>
                ) : checkingStatus ? (
                  <div></div>
                ) : null}
              </CardContent>
            </div>

            <div className="flex flex-col gap-2 items-end">
              {optimisticState.actionTaken && (
                <>
                  {!optimisticState.read && (
                    <Button
                      size="sm"
                      className="bg-transparent hover:bg-transparent"
                      onClick={handleMarkAsRead}
                    >
                      <IoCheckmark className="dark:text-white text-black" />
                    </Button>
                  )}

                  <DeleteNotificationDialog notificationId={notification.id} />
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
