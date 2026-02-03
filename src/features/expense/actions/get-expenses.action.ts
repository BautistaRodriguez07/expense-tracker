"use server";

import { cache } from "react";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/features/auth/guards/workspace.guard";
import {
  serializeExpense,
  type SerializedExpense,
} from "../utils/serialize-expense";

export type PaginatedExpenses = {
  expenses: SerializedExpense[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

const getExpensesQuery = cache(
  async (spaceId: string): Promise<SerializedExpense[]> => {
    const expenses = await prisma.expense.findMany({
      where: {
        space_id: spaceId,
        deleted_at: null,
      },
      include: {
        category: true,
        responsible: {
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
  spaceId: string
): Promise<SerializedExpense[]> {
  await requireWorkspaceAccess(spaceId);
  return getExpensesQuery(spaceId);
}

const getExpensesPaginatedQuery = cache(
  async (
    spaceId: string,
    page: number,
    pageSize: number
  ): Promise<PaginatedExpenses> => {
    const skip = (page - 1) * pageSize;

    const whereClause = {
      space_id: spaceId,
      deleted_at: null,
    };

    const [expenses, totalCount] = await Promise.all([
      prisma.expense.findMany({
        where: whereClause,
        include: {
          category: true,
          responsible: {
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
        skip,
        take: pageSize,
      }),
      prisma.expense.count({
        where: whereClause,
      }),
    ]);

    return {
      expenses: expenses.map(serializeExpense),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
      pageSize,
    };
  }
);

export async function getExpensesPaginated(
  spaceId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedExpenses> {
  const validPage = Math.max(1, page);
  const validPageSize = Math.min(Math.max(1, pageSize), 100);

  await requireWorkspaceAccess(spaceId);
  return getExpensesPaginatedQuery(spaceId, validPage, validPageSize);
}

export async function getExpensesStats(spaceId: string) {
  await requireWorkspaceAccess(spaceId);

  const expenses = await prisma.expense.findMany({
    where: {
      space_id: spaceId,
      deleted_at: null,
    },
    select: {
      amount: true,
      currency: true,
      status: true,
    },
  });

  const totalCount = expenses.length;
  const pendingCount = expenses.filter(e => e.status === "pending").length;
  
  const expensesByCurrency = expenses.reduce((acc, expense) => {
    if (expense.status === "paid") {
      const currency = expense.currency;
      acc[currency] = (acc[currency] || 0) + expense.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  return {
    totalCount,
    pendingCount,
    expensesByCurrency,
  };
}