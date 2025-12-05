"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { payExpense } from "../actions/pay-expense.action";

// Helper function to compress image
const compressImage = async (file: File): Promise<File> => {
  // Only compress if larger than 1MB
  if (file.size <= 1024 * 1024) return file;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Scale down if too big (max 1920px width/height)
      let width = img.width;
      let height = img.height;
      const maxSize = 1920;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => {
          if (blob) {
            const newFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(newFile);
          } else {
            reject(new Error("Compression failed"));
          }
        },
        "image/jpeg",
        0.7 // 70% quality
      );
    };
    img.onerror = error => reject(error);
  });
};

interface PayExpenseDialogProps {
  expenseId: string;
  spaceId: string;
  responsibleId: string;
  currentUserId: string;
  expenseAmount: number;
  currency: string;
  disabled?: boolean;
}

export function PayExpenseDialog({
  expenseId,
  spaceId,
  responsibleId,
  currentUserId,
  expenseAmount,
  currency,
  disabled = false,
}: PayExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedFilesCount, setSelectedFilesCount] = useState(0);
  const t = useTranslations("expense");

  const isResponsible = currentUserId === responsibleId;
  const canPay = isResponsible && !disabled;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Get the files
    const fileInput = form.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const files = fileInput?.files;

    if (!files || files.length === 0) return;

    startTransition(async () => {
      try {
        // Remove the default 'receipt' entry if it exists (since we'll add processed ones)
        formData.delete("receipt");

        // Process all files
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // Compress if needed
          const processedFile = await compressImage(file);
          // Append each file with the same key 'receipt' to create an array in FormData
          formData.append("receipt", processedFile);
        }

        formData.append("expenseId", expenseId);

        const result = await payExpense(formData, spaceId);
        if (result.success) {
          setOpen(false);
        } else {
          alert(result.error);
        }
      } catch (error) {
        console.error("Error processing image:", error);
        alert("Failed to process image");
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFilesCount(files ? files.length : 0);
  };

  if (!canPay) {
    return (
      <Button
        className="btn-success rounded-xl opacity-50 cursor-not-allowed"
        disabled
        title={
          !isResponsible ? "Only the responsible person can pay" : "Cannot pay"
        }
      >
        {t("pay")}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-success rounded-xl">Pay</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] card-container">
        <DialogHeader>
          <DialogTitle>{t("payExpense")}</DialogTitle>
          <DialogDescription>
            {t("uploadReceiptDescription", {
              currency,
              expenseAmount,
            })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="receipt">{t("receipts")} *</Label>
            <Input
              id="receipt"
              name="receipt"
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              required
              multiple
              hidden
              onChange={handleFileChange}
            />
            {/* btn to upload <files/> */}
            <Button
              type="button"
              className="btn my-3"
              onClick={() =>
                (
                  document.getElementById("receipt") as HTMLInputElement
                )?.click()
              }
            >
              <PlusIcon className="w-4 h-4" />
              {t("browseFile")}
            </Button>
            {/* files chosen */}
            {selectedFilesCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedFilesCount}{" "}
                {selectedFilesCount === 1
                  ? t("imageSelected")
                  : t("imagesSelected")}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="btn-success mt-3"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("confirmPayment")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
