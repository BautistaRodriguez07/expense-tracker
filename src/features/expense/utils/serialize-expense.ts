import type { Expense, ExpenseTag, Tag, Category, User } from "@prisma/client";

type ExpenseWithRelations = Expense & {
  category?: Category;
  responsible?: Pick<User, "id" | "name" | "email"> | null;
  createdBy?: Pick<User, "id" | "name">;
  tags?: (ExpenseTag & {
    tag: Tag;
  })[];
};

export type SerializedExpense = Omit<
  Expense,
  "amount" | "created_at" | "updated_at" | "deleted_at"
> & {
  amount: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  tags?: {
    id: number;
    name: string;
  }[];
  category?: Category;
  responsible?: Pick<User, "id" | "name" | "email"> | null;
  createdBy?: Pick<User, "id" | "name">;
};

export function serializeExpense(
  expense: ExpenseWithRelations
): SerializedExpense {
  return {
    ...expense,
    amount: Number(expense.amount),
    created_at: expense.created_at.toISOString(),
    updated_at: expense.updated_at.toISOString(),
    deleted_at: expense.deleted_at?.toISOString() || null,
    tags: expense.tags?.map(et => ({
      id: et.tag.id,
      name: et.tag.name,
    })),
    category: expense.category,
    responsible: expense.responsible,
    createdBy: expense.createdBy,
  };
}
