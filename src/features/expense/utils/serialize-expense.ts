import type { Expense } from "@prisma/client";

export type SerializedExpense = Omit<
  Expense,
  "amount" | "created_at" | "updated_at" | "deleted_at"
> & {
  amount: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export function serializeExpense(expense: Expense): SerializedExpense {
  return {
    ...expense,
    amount: Number(expense.amount),
    created_at: expense.created_at.toISOString(),
    updated_at: expense.updated_at.toISOString(),
    deleted_at: expense.deleted_at?.toISOString() || null,
  };
}
