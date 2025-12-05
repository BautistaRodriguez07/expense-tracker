import { Badge } from "@/components/ui/badge";
import React from "react";
import { SerializedExpense } from "../utils/serialize-expense";
import { cn } from "@/lib/utils";

interface ExpenseStatusBadgeProps {
  expense: SerializedExpense;
  className?: string;
}

export const ExpenseStatusBadge = ({
  expense,
  className,
}: ExpenseStatusBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        expense.status === "pending" &&
          "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-800",
        expense.status === "paid" &&
          "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800",
        className
      )}
    >
      {expense.status}
    </Badge>
  );
};
