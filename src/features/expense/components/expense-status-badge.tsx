"use client";

import { Badge } from "@/components/ui/badge";
import React from "react";
import { SerializedExpense } from "../utils/serialize-expense";
import { cn } from "@/lib/utils";
import { translateStatus } from "@/lib/translate-status";
import { useMessages } from "next-intl";

interface ExpenseStatusBadgeProps {
  expense: SerializedExpense;
  className?: string;
}

export const ExpenseStatusBadge = ({
  expense,
  className,
}: ExpenseStatusBadgeProps) => {
  const messages = useMessages();
  return (
    // add the translateStatus function to the expense.status
    <Badge
      variant="outline"
      className={cn(
        expense.status === "pending" &&
          "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-800",
        expense.status === "paid" &&
          "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800",
        expense.status === "overdue" &&
          "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800 animate-pulse",
        expense.status === "cancelled" &&
          "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800",
        className
      )}
    >
      {translateStatus(expense.status, messages)}
    </Badge>
  );
};
