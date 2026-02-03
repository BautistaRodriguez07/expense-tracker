"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoAddOutline } from "react-icons/io5";
import { createInvitation } from "../actions/create-invitation.action";
import { useTranslations } from "next-intl";

interface InviteMemberDialogProps {
  spaceId: string;
  spaceName: string;
}

export function InviteMemberDialog({
  spaceId,
  spaceName,
}: InviteMemberDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const t = useTranslations("spaces");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("spaceId", spaceId);
      formData.append("email", email);

      const result = await createInvitation(formData);

      if (result.success) {
        setSuccess(t("invitationSent"));
        setEmail("");
        setTimeout(() => {
          setIsOpen(false);
          setSuccess("");
        }, 2000);
      } else {
        // Show specific error messages
        if (result.error?.includes("No user found with this email")) {
          setError(t("noUserFound"));
        } else if (result.error?.includes("already a member")) {
          setError(t("userAlreadyMember"));
        } else if (result.error?.includes("already been sent")) {
          setError(t("invitationAlreadySent"));
        } else {
          setError(result.error || t("failedToSendInvitation"));
        }
      }
    } catch (submitError) {
      console.error("Invitation submission error:", submitError);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="btn" size="icon">
          <IoAddOutline />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] card-container">
        <DialogHeader>
          <DialogTitle>
            {t("inviteTo")}
            {spaceName}
          </DialogTitle>
          <DialogDescription className="txt-muted">
            {t("inviteMemberDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("emailAddress")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("enterEmailAddress")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-sm bg-dark rounded-xl p-3 text-red-500 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm bg-dark rounded-xl p-3 text-green-500 dark:text-green-400">
              {success}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              className="btn"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              className="btn-danger rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? t("sending") : t("sendInvitation")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
