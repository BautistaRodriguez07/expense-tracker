"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteSpace } from "../actions/delete-space.action";
import { IoTrash } from "react-icons/io5";

type Props = {
  spaceId: string;
  spaceName: string;
};

export const DeleteSpaceDialog = (props: Props) => {
  const t = useTranslations("spaces");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmText !== props.spaceName) {
      setError(t("confirmationMismatch"));
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await deleteSpace(props.spaceId);

    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      setError(result.error || "Failed to delete space");
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-danger rounded-xl" size="sm">
          <IoTrash className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="card-container">
        <DialogHeader>
          <DialogTitle className="text-red-500">
            {t("deleteSpaceTitle")}
          </DialogTitle>
          <DialogDescription className="text-red-400">
            {t("deleteSpaceWarning")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="txt-muted text-sm">
            {t("deleteSpaceConfirmPrompt")}: <strong>{props.spaceName}</strong>
          </p>
          <Input
            placeholder={props.spaceName}
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            disabled={isLoading}
          />
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
            disabled={isLoading || confirmText !== props.spaceName}
          >
            {isLoading ? t("deleting") : t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
