"use server";

import { cache } from "react";
import prisma from "@/lib/prisma";
import {
  serializeExpense,
  type SerializedExpense,
} from "../utils/serialize-expense";
import { requireExpenseAccess } from "../guards/expense.guard";

// get all expenses for a workspace (cached)
const getExpenseQuery = cache(
  async (expenseId: string): Promise<SerializedExpense> => {
    const expense = await prisma.expense.findUnique({
      where: {
        id: Number(expenseId),
        deleted_at: null,
      },
      include: {
        category: true,
        paidBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!expense) throw new Error("Expense not found");
    return serializeExpense(expense);
  }
);

export async function getExpense(
  expenseId: string,
  spaceId: number
): Promise<SerializedExpense> {
  await requireExpenseAccess(expenseId, spaceId.toString(), { action: "edit" });
  return getExpenseQuery(expenseId);
}
