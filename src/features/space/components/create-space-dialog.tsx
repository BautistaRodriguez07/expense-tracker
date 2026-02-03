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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSpace } from "../actions/create-space.action";
import { IoAdd } from "react-icons/io5";

export const CreateSpaceDialog = () => {
  const t = useTranslations("spaces");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setError(null);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await createSpace(formData);

      if (result?.success) {
        setOpen(false);
        e.currentTarget.reset();
        router.refresh();
      } else {
        setError(
          result?.error || t("createSpaceError") || "Failed to create space",
        );
      }
    } catch (err) {
      console.error("Error creating space:", err);
      setError(t("createSpaceError") || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="btn">
          <IoAdd className="w-4 h-4 mr-2" />
          {t("createSpace")}
        </Button>
      </DialogTrigger>
      <DialogContent className="card-container">
        <DialogHeader>
          <DialogTitle>{t("createSpaceTitle")}</DialogTitle>
          <DialogDescription>{t("createSpaceDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("spaceName")}</Label>
              <Input
                id="name"
                name="name"
                placeholder={t("spaceNamePlaceholder")}
                required
                minLength={3}
                maxLength={50}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="default_currency">{t("defaultCurrency")}</Label>
              <Select
                name="default_currency"
                defaultValue="USD"
                disabled={isLoading}
              >
                <SelectTrigger className="btn !p-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="card-container !p-1">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="ARS">ARS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              className="btn"
              type="button"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="btn-success rounded-xl"
            >
              {isLoading ? t("creating") : t("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
