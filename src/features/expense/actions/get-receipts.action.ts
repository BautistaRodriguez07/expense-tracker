"use server";

import prisma from "@/lib/prisma";

export async function getReceipts(expenseId: string) {
  const receipts = await prisma.expenseReceipt.findMany({
    where: { expense_id: expenseId },
  });
  return receipts;
}
