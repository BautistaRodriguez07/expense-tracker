import prisma from "@/lib/prisma";
import { AuthResult } from "./auth.service";

export type WorkspacePermission =
  | "expense.create"
  | "expense.edit.own"
  | "expense.edit.any"
  | "expense.delete"
  | "expense.pay.own"
  | "expense.pay.any"
  | "member.invite"
  | "member.remove"
  | "workspace.configure"
  | "workspace.delete";

export type SystemPermission =
  | "system.view_all_workspaces"
  | "system.view_logs"
  | "system.view_metrics"
  | "system.impersonate"
  | "system.maintenance";

type WorkspaceRole = "owner" | "member";

// workspace role permissions
const WORKSPACE_ROLE_PERMISSIONS: Record<WorkspaceRole, WorkspacePermission[]> =
  {
    owner: [
      "expense.create",
      "expense.edit.own",
      "expense.edit.any",
      "expense.delete",
      "expense.pay.own",
      "expense.pay.any",
      "member.invite",
      "member.remove",
      "workspace.configure",
      "workspace.delete",
    ],
    member: ["expense.create", "expense.edit.own", "expense.pay.own"],
  };

// system admin permissions
const SYSTEM_ADMIN_PERMISSIONS: SystemPermission[] = [
  "system.view_all_workspaces",
  "system.view_logs",
  "system.view_metrics",
  "system.impersonate",
  "system.maintenance",
];

/**
 * verify if the user is system admin
 */
export function isSystemAdmin(auth: AuthResult): boolean {
  return auth.dbUser.is_system_admin || false;
}

/**
 * get the role of the user in a workspace
 */
async function getUserWorkspaceRole(
  userId: number,
  spaceId: number
): Promise<WorkspaceRole | null> {
  const member = await prisma.spaceMember.findFirst({
    where: {
      user_id: userId,
      space_id: spaceId,
    },
    select: { role: true },
  });

  return member?.role as WorkspaceRole | null;
}

/**
 * verify workspace permission
 */
export async function hasWorkspacePermission(
  auth: AuthResult,
  permission: WorkspacePermission
): Promise<boolean> {
  // system admin has all workspace permissions
  if (isSystemAdmin(auth)) {
    return true;
  }

  const role = await getUserWorkspaceRole(auth.dbUser.id, auth.spaceId);

  if (!role) return false;

  return WORKSPACE_ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * verify system permission
 */
export async function hasSystemPermission(
  auth: AuthResult,
  permission: SystemPermission
): Promise<boolean> {
  if (!isSystemAdmin(auth)) {
    return false;
  }

  return SYSTEM_ADMIN_PERMISSIONS.includes(permission);
}

/**
 * verify if the user can edit an expense
 */
export async function canEditExpense(
  auth: AuthResult,
  expenseId: string
): Promise<boolean> {
  // system admin can edit any expense
  if (isSystemAdmin(auth)) {
    return true;
  }

  const expense = await prisma.expense.findUnique({
    where: { id: expenseId },
    select: {
      created_by: true,
      responsible_id: true,
      space_id: true,
    },
  });

  if (!expense || expense.space_id !== auth.spaceId) {
    return false;
  }

  // if has permission to edit any expense (owner)
  if (await hasWorkspacePermission(auth, "expense.edit.any")) {
    return true;
  }

  // if is the creator or responsible
  const isOwnerOrResponsible =
    expense.created_by === auth.dbUser.id ||
    expense.responsible_id === auth.dbUser.id;

  if (
    isOwnerOrResponsible &&
    (await hasWorkspacePermission(auth, "expense.edit.own"))
  ) {
    return true;
  }

  return false;
}

/**
 * verify if the user can delete an expense
 */
export async function canDeleteExpense(
  auth: AuthResult,
  expenseId: string
): Promise<boolean> {
  // system admin can delete any expense
  if (isSystemAdmin(auth)) {
    return true;
  }

  const expense = await prisma.expense.findUnique({
    where: { id: expenseId },
    select: {
      space_id: true,
    },
  });

  if (!expense || expense.space_id !== auth.spaceId) {
    return false;
  }

  // only owner can delete (members cannot)
  return await hasWorkspacePermission(auth, "expense.delete");
}

/**
 * verify if the user can mark as paid
 */
export async function canMarkAsPaid(
  auth: AuthResult,
  expenseId: string
): Promise<boolean> {
  // system admin can mark any expense as paid
  if (isSystemAdmin(auth)) {
    return true;
  }

  const expense = await prisma.expense.findUnique({
    where: { id: expenseId },
    select: {
      responsible_id: true,
      space_id: true,
    },
  });

  if (!expense || expense.space_id !== auth.spaceId) {
    return false;
  }

  // owner can mark any as paid
  if (await hasWorkspacePermission(auth, "expense.pay.any")) {
    return true;
  }

  // member can mark their own as paid
  if (
    expense.responsible_id === auth.dbUser.id &&
    (await hasWorkspacePermission(auth, "expense.pay.own"))
  ) {
    return true;
  }

  return false;
}
