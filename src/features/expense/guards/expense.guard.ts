"use server";

import { requireWorkspaceAccess } from "../../auth/guards/workspace.guard";
import { AuthResult } from "../../auth/services/auth.service";
import { ExpenseService } from "../services/expense.service";

type ExpenseValidationOptions = {
  action: "edit" | "delete";
  errorMessage?: string;
};

/**
 * Validates expense access and permissions for edit/delete operations
 *
 * @param expenseId - The expense ID to validate
 * @param spaceId - The workspace ID (as string, will be parsed)
 * @param options - Validation options including action type and custom error message
 * @returns AuthResult if validation passes
 * @throws Error if validation fails
 */
export async function requireExpenseAccess(
  expenseId: string,
  spaceId: string,
  options: ExpenseValidationOptions
): Promise<AuthResult> {
  const targetSpaceId = parseInt(spaceId);

  // Validate workspace access
  const auth = await requireWorkspaceAccess(targetSpaceId);

  // Verify that the expense belongs to the workspace
  const belongsToWorkspace = await ExpenseService.belongsToWorkspace(
    expenseId,
    targetSpaceId
  );

  if (!belongsToWorkspace) {
    throw new Error("Expense does not belong to this workspace");
  }

  // Verify that the user can perform the action (edit or delete)
  const canEdit = await ExpenseService.canUserEdit(expenseId, auth.dbUser.id);

  if (!canEdit) {
    const errorMessage =
      options.errorMessage ||
      `You don't have permission to ${options.action} this expense`;
    throw new Error(errorMessage);
  }

  return auth;
}
