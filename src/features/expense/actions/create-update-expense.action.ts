"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspaceAccess } from "@/features/auth/guards/workspace.guard";
import { ExpenseService } from "../services/expense.service";
import {
  serializeExpense,
  type SerializedExpense,
} from "../utils/serialize-expense";
import { requireExpenseAccess } from "../guards/expense.guard";
import type { Option } from "@/components/ui/multiple-selector";

type ActionResult = {
  success: boolean;

  expense?: SerializedExpense;
  error?: string;
};

async function processExpenseTags(
  formData: FormData,
  expenseId: string,
  spaceId: string,
  removeIfEmpty: boolean = false
): Promise<void> {
  const tagsJson = formData.get("tags") as string;

  if (tagsJson) {
    try {
      const tags: Option[] = JSON.parse(tagsJson);
      const tagIds = await ExpenseService.createOrFindTags(tags, spaceId);
      await ExpenseService.associateTags(expenseId, tagIds);
    } catch (error) {
      console.error("Error processing tags:", error);
      // Continue even if tags fail
    }
  } else if (removeIfEmpty) {
    // If no tags provided and removeIfEmpty is true, remove all tags
    await ExpenseService.associateTags(expenseId, []);
  }
}

/**
 * create a new expense
 */
export async function createExpense(
  formData: FormData,
  spaceId: string
): Promise<ActionResult> {
  try {
    // generic workspace validation
    const auth = await requireWorkspaceAccess(spaceId);

    // parse form data
    const categoryValue = formData.get("category") as string;
    const categoryId = categoryValue ? parseInt(categoryValue, 10) : null;

    if (!categoryId || isNaN(categoryId)) {
      throw new Error("Category is required and must be a valid number");
    }

    const data = {
      name: formData.get("name") as string,
      amount: Number(formData.get("amount")),
      currency: formData.get("currency") as string,
      date: new Date(formData.get("expireDate") as string),
      category_id: categoryId,
      description: (formData.get("note") as string) || "",
      space_id: spaceId,
      created_by: auth.dbUser.id,
      responsible_id: formData.get("responsible") as string,
      status:
        (formData.get("status") as "pending" | "paid" | "cancelled" | "overdue") ||
        "pending",
    };

    // create using the service (which has business validations)
    const newExpense = await ExpenseService.create(data);

    // handle tags
    await processExpenseTags(formData, newExpense.id, spaceId);

    revalidatePath("/");
    revalidatePath("/expense");

    return { success: true, expense: serializeExpense(newExpense) };
  } catch (error) {
    console.error("Error creating expense:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * update an existing expense
 */
export async function updateExpense(
  formData: FormData,
  expenseId: string,
  spaceId: string
): Promise<ActionResult> {
  try {
    const auth = await requireExpenseAccess(expenseId, spaceId, {
      action: "edit",
    });

    // parse form data
    const categoryValue = formData.get("category") as string;
    const categoryId = categoryValue ? parseInt(categoryValue, 10) : null;

    if (!categoryId || isNaN(categoryId)) {
      throw new Error("Category is required and must be a valid number");
    }

    const updateData = {
      name: formData.get("name") as string,
      amount: Number(formData.get("amount")),
      currency: formData.get("currency") as string,
      date: new Date(formData.get("expireDate") as string),
      category_id: categoryId,
      description: (formData.get("note") as string) || "",
      responsible_id: formData.get("responsible") as string,
      status:
        (formData.get("status") as "pending" | "paid" | "cancelled" | "overdue") ||
        "pending",
    };

    // update using the service
    const updatedExpense = await ExpenseService.update(
      expenseId,
      updateData,
      auth.dbUser.id
    );

    await processExpenseTags(formData, updatedExpense.id, auth.spaceId, true);

    revalidatePath("/");
    revalidatePath("/expense");
    revalidatePath(`/expense/${expenseId}`);

    return { success: true, expense: serializeExpense(updatedExpense) };
  } catch (error) {
    console.error("Error updating expense:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * delete an expense (soft delete)
 */
export async function deleteExpense(
  expenseId: string,
  spaceId: string
): Promise<ActionResult> {
  try {
    const auth = await requireExpenseAccess(expenseId, spaceId, {
      action: "delete",
    });

    // delete using the service
    await ExpenseService.delete(expenseId, auth.dbUser.id);

    // Revalidate routes
    revalidatePath("/");
    revalidatePath("/expense");
    revalidatePath("/expense/list");

    return { success: true };
  } catch (error) {
    console.error("Error deleting expense:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
