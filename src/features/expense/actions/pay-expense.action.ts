"use server";

import { revalidatePath } from "next/cache";
import { requireExpenseAccess } from "../guards/expense.guard";
import { ExpenseService } from "../services/expense.service";
import prisma from "@/lib/prisma";
import { saveFile } from "@/lib/file-upload";

export async function payExpense(formData: FormData, spaceId: string) {
  const expenseId = formData.get("expenseId") as string;
  const receipts = formData.getAll("receipt") as File[];

  if (!expenseId || !spaceId) {
    return { success: false, error: "Missing required fields" };
  }

  if (!receipts || receipts.length === 0 || receipts[0].size === 0) {
    return { success: false, error: "At least one receipt is required" };
  }

  const auth = await requireExpenseAccess(expenseId, spaceId, {
    action: "pay",
  });

  const expense = await ExpenseService.getById(expenseId);

  if (!expense) {
    return { success: false, error: "Expense not found" };
  }

  if (expense.status === "paid") {
    return { success: false, error: "Expense already paid" };
  }

  if (expense.responsible_id !== auth.dbUser.id) {
    return {
      success: false,
      error: "You are not the responsible for this expense",
    };
  }

  try {
    const uploadPromises = receipts.map(file =>
      saveFile(file, "uploads/receipts")
    );
    const fileUrls = await Promise.all(uploadPromises);

    await prisma.expense.update({
      where: { id: expenseId },
      data: { status: "paid" },
    });

    await Promise.all(
      fileUrls.map(url =>
        ExpenseService.addReceipt(expenseId, url, auth.dbUser.id)
      )
    );

    revalidatePath("/expense");
    revalidatePath(`/expense/${expenseId}`);

    return { success: true };
  } catch (error) {
    console.error("Error paying expense:", error);
    return { success: false, error: "Failed to process payment" };
  }
}
