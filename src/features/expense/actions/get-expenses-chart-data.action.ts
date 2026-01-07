"use server";

import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/features/auth/guards/workspace.guard";

export type ChartDataItem = {
  category: string;
  categoryId: number;
  amount: number;
  count: number;
  fill: string;
};

export async function getExpensesChartData(
  spaceId: string,
  filters?: {
    days?: number;
    responsibleId?: string;
    currency?: string;
    status?: string;
  }
): Promise<ChartDataItem[]> {
  await requireWorkspaceAccess(spaceId);

  const { days = 30, responsibleId, currency, status = "all" } = filters || {};

  // Calculate date range
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Build where clause dynamically
  const where: any = {
    space_id: spaceId,
    deleted_at: null,
    date: {
      gte: startDate,
    },
  };

  if (status && status !== "all") {
    where.status = status;
  }

  if (responsibleId && responsibleId !== "all") {
    where.responsible_id = responsibleId;
  }

  if (currency && currency !== "all") {
    where.currency = currency;
  }

  // Fetch expenses
  const expenses = await prisma.expense.findMany({
    where,
    include: {
      category: true,
    },
  });

  // Group by category
  const categoryMap = new Map<number, ChartDataItem>();

  expenses.forEach(expense => {
    const categoryId = expense.category_id;
    const categoryName = expense.category?.name || "Unknown";
    const categoryColor = expense.category?.color || "#888888";

    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, {
        category: categoryName,
        categoryId,
        amount: 0,
        count: 0,
        fill: categoryColor,
      });
    }

    const item = categoryMap.get(categoryId)!;
    item.amount += Number(expense.amount);
    item.count += 1;
  });

  return Array.from(categoryMap.values()).sort((a, b) => b.amount - a.amount);
}
