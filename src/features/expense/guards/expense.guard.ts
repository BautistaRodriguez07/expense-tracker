"use server";

import { requireWorkspaceAccess } from "../../auth/guards/workspace.guard";
import { AuthResult } from "../../auth/services/auth.service";
import { ExpenseService } from "../services/expense.service";

type ExpenseValidationOptions = {
  action: "edit" | "delete" | "pay";
  errorMessage?: string;
};

/**
 * Validates expense access and permissions for edit/delete/pay operations
 *
 * @param expenseId - The expense ID to validate
 * @param spaceId - The workspace ID
 * @param options - Validation options including action type and custom error message
 * @returns AuthResult if validation passes
 * @throws Error if validation fails
 */
export async function requireExpenseAccess(
  expenseId: string,
  spaceId: string,
  options: ExpenseValidationOptions
): Promise<AuthResult> {
  // Validate workspace access
  const auth = await requireWorkspaceAccess(spaceId);

  // Verify that the expense belongs to the workspace
  const belongsToWorkspace = await ExpenseService.belongsToWorkspace(
    expenseId,
    spaceId
  );

  if (!belongsToWorkspace) {
    throw new Error("Expense does not belong to this workspace");
  }

  // Verify that the user can perform the action (edit or delete or pay)
  const canEdit = await ExpenseService.canUserEdit(expenseId, auth.dbUser.id);

  const canDelete = await ExpenseService.canUserDelete(
    expenseId,
    auth.dbUser.id
  );

  const canPay = await ExpenseService.canUserPay(expenseId, auth.dbUser.id);

  if (!canEdit && !canDelete && !canPay) {
    const errorMessage =
      options.errorMessage ||
      `You don't have permission to ${options.action} this expense`;
    throw new Error(errorMessage);
  }

  return auth;
}
