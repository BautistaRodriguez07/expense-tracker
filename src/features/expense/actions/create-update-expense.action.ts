"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspaceAccess } from "@/features/auth/guards/workspace.guard";
import { ExpenseService } from "../services/expense.service";
import {
  serializeExpense,
  type SerializedExpense,
} from "../utils/serialize-expense";

type ActionResult = {
  success: boolean;

  expense?: SerializedExpense;
  error?: string;
};

/**
 * create a new expense
 */
export async function createExpense(
  formData: FormData,
  spaceId: string
): Promise<ActionResult> {
  try {
    const targetSpaceId = parseInt(spaceId);

    // generic workspace validation
    const auth = await requireWorkspaceAccess(targetSpaceId);

    // parse form data
    const data = {
      name: formData.get("name") as string,
      amount: Number(formData.get("amount")),
      currency: formData.get("currency") as string,
      date: new Date(formData.get("expireDate") as string),
      category_id: parseInt(formData.get("category") as string),
      paid_by: formData.get("responsible")
        ? parseInt(formData.get("responsible") as string)
        : auth.dbUser.id,
      description: (formData.get("note") as string) || "",
      space_id: targetSpaceId,
      created_by: auth.dbUser.id,
    };

    // create using the service (which has business validations)
    const newExpense = await ExpenseService.create(data);

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
    const targetSpaceId = parseInt(spaceId);

    // generic workspace validation
    const auth = await requireWorkspaceAccess(targetSpaceId);

    // verify that the expense belongs to the workspace
    const belongsToWorkspace = await ExpenseService.belongsToWorkspace(
      expenseId,
      targetSpaceId
    );

    if (!belongsToWorkspace) {
      throw new Error("Expense does not belong to this workspace");
    }

    // verify that the user can edit the expense
    const canEdit = await ExpenseService.canUserEdit(expenseId, auth.dbUser.id);

    if (!canEdit) {
      throw new Error("You don't have permission to edit this expense");
    }

    // parse form data
    const updateData = {
      name: formData.get("name") as string,
      amount: Number(formData.get("amount")),
      currency: formData.get("currency") as string,
      date: new Date(formData.get("expireDate") as string),
      category_id: parseInt(formData.get("category") as string),
      paid_by: parseInt(formData.get("responsible") as string),
      description: (formData.get("note") as string) || "",
    };

    // update using the service
    const updatedExpense = await ExpenseService.update(
      expenseId,
      updateData,
      auth.dbUser.id
    );

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
    // validacion repetida mover
    const targetSpaceId = parseInt(spaceId);

    // generic workspace validation
    const auth = await requireWorkspaceAccess(targetSpaceId);

    // verify that the expense belongs to the workspace
    const belongsToWorkspace = await ExpenseService.belongsToWorkspace(
      expenseId,
      targetSpaceId
    );

    if (!belongsToWorkspace) {
      throw new Error("Expense does not belong to this workspace");
    }

    // verify that the user can delete the expense (creator or admin)
    const canEdit = await ExpenseService.canUserEdit(expenseId, auth.dbUser.id);

    if (!canEdit) {
      throw new Error("You don't have permission to delete this expense");
    }

    // delete using the service
    await ExpenseService.delete(expenseId, auth.dbUser.id);

    // Revalidar rutas
    revalidatePath("/");
    revalidatePath("/expense");

    return { success: true };
  } catch (error) {
    console.error("Error deleting expense:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
