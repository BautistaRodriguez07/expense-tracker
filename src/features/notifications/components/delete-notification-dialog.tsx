"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteNotification } from "../actions/get-notifications.action";
import { useTranslations } from "next-intl";

type Props = {
  notificationId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDelete?: () => void;
};

export const DeleteNotificationDialog = ({
  notificationId,
  open: controlledOpen,
  onOpenChange,
  onDelete,
}: Props) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("invitations");

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    const result = await deleteNotification(notificationId);

    if (result.success) {
      setOpen(false);
      onDelete?.();
    } else {
      setError(result.error || "Failed to delete notification");
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="card-container">
        <DialogHeader>
          <DialogTitle className="txt">{t("deleteNotification")}</DialogTitle>
          <DialogDescription className="txt-muted">
            {t("deleteNotificationDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            type="button"
            className="btn"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            className="btn-danger rounded-xl"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? t("deleting") : t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
