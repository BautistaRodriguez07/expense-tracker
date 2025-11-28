"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { SerializedExpense } from "../utils/serialize-expense";
import Link from "next/link";
import { deleteExpense } from "../actions/create-update-expense.action";
import { useTranslations } from "next-intl";

type ExpenseCardProps = {
  expense: SerializedExpense;
};

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const t = useTranslations("expense");
  const formattedDate = new Date(expense.date).toLocaleDateString(
    t("defaultLocale"),
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: expense.currency,
  }).format(expense.amount);

  const handleDelete = async () => {
    const result = await deleteExpense(
      expense.id.toString(),
      expense.space_id.toString()
    );
    if (result.success) {
      window.location.reload();
    } else {
      alert(result.error || "Failed to delete expense");
    }
  };

  return (
    <div className="card-container mb-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="txt text-xl font-semibold">{expense.name}</h3>
          <p className="txt-muted text-sm">
            {t("createdBy")} {expense.createdBy?.name || "Unknown"} ·{" "}
            {formattedDate}
          </p>
        </div>
        <div className="text-right">
          <p className="txt text-2xl font-bold">{formattedAmount}</p>
          <div className="flex flex-wrap gap-1 mt-1 justify-end">
            {expense.category && (
              <Badge variant="outline">{expense.category.name}</Badge>
            )}
            {expense.tags && expense.tags.length > 0 && (
              <>
                {expense.tags.map(tag => (
                  <Badge key={tag.id} variant="secondary" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Details */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="txt-muted">{t("responsible")}:</span>
          <span className="txt font-medium">
            {expense.responsible?.name || "Unknown"}
          </span>
        </div>

        {expense.description && (
          <>
            <Separator className="my-2" />
            <div>
              <span className="txt-muted text-sm">{t("note")}:</span>
              <p className="txt text-sm mt-1">{expense.description}</p>
            </div>
          </>
        )}
      </div>

      <Separator className="my-4" />

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Link href={`/expense/${expense.id}`}>
          <Button variant="outline" size="sm" className="btn">
            {t("viewDetails")}
          </Button>
        </Link>
        <Link href={`/expense/edit/${expense.id}`}>
          <Button size="sm" className="btn">
            {t("edit")}
          </Button>
        </Link>
        <Button size="sm" className="btn" onClick={handleDelete}>
          {t("delete")}
        </Button>
      </div>
    </div>
  );
}
