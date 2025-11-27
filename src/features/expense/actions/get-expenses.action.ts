"use server";

import { cache } from "react";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/features/auth/guards/workspace.guard";
import {
  serializeExpense,
  type SerializedExpense,
} from "../utils/serialize-expense";

// get all expenses for a workspace (cached)
const getExpensesQuery = cache(
  async (spaceId: number): Promise<SerializedExpense[]> => {
    const expenses = await prisma.expense.findMany({
      where: {
        space_id: spaceId,
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
      orderBy: {
        created_at: "desc",
      },
    });

    return expenses.map(serializeExpense);
  }
);

export async function getExpenses(
  spaceId: number
): Promise<SerializedExpense[]> {
  await requireWorkspaceAccess(spaceId);
  return getExpensesQuery(spaceId);
}
