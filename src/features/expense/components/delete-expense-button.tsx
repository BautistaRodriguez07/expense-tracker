"use client";

import { Button } from "@/components/ui/button";
import { deleteExpense } from "../actions/create-update-expense.action";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

type DeleteExpenseButtonProps = {
  expenseId: string | number;
  spaceId: string | number;
};

export function DeleteExpenseButton({
  expenseId,
  spaceId,
}: DeleteExpenseButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("expense");
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteExpense(
      expenseId.toString(),
      spaceId.toString()
    );
    if (result.success) {
      router.push("/expense/list");
      router.refresh();
    } else {
      alert(result.error || "Failed to delete expense");
    }
  };

  return (
    <>
      <Button
        size="sm"
        className="btn-danger rounded-xl"
        onClick={() => setIsOpen(true)}
      >
        {t("delete")}
      </Button>

      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full dark:bg-white/50 bg-black/50 flex items-center justify-center">
          <div className="card-container">
            <p className="text-sm pb-4">{t("deleteDescription")}</p>
            <div className="flex items-center justify-end gap-2">
              <Button
                size="sm"
                className="btn"
                onClick={() => setIsOpen(false)}
              >
                {t("cancelButton")}
              </Button>
              <Button
                size="sm"
                className="btn-danger rounded-xl"
                onClick={handleDelete}
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
