"use server";

import { validateAuth, type AuthResult } from "../services/auth.service";
import prisma from "@/lib/prisma";

export type WorkspaceValidationResult = {
  auth: AuthResult;
  hasAccess: boolean;
};

// validate workspace access
export async function validateWorkspaceAccess(
  spaceId: number
): Promise<WorkspaceValidationResult> {
  // 1. validate authentication (Clerk + DB + workspace default)
  const auth = await validateAuth();

  if (!auth) {
    throw new Error("User not authenticated");
  }

  // 2. if it is the default workspace of the user, has access
  if (auth.spaceId === spaceId) {
    return { auth, hasAccess: true };
  }

  // 3. if it is another workspace, verify membership
  const membership = await prisma.spaceMember.findFirst({
    where: {
      user_id: auth.dbUser.id,
      space_id: spaceId,
      space: {
        deleted_at: null, // only active spaces
      },
    },
  });

  if (!membership) {
    throw new Error("Access denied to this workspace");
  }

  return { auth, hasAccess: true };
}

// validate and return the AuthResult if has access, or throw error
export async function requireWorkspaceAccess(
  spaceId: number
): Promise<AuthResult> {
  const { auth } = await validateWorkspaceAccess(spaceId);
  return auth;
}
