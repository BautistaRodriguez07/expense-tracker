"use server";

import { validateAuth } from "../services/auth.service";
import { isSystemAdmin } from "../services/permissions.service";

export async function requireSystemAdmin() {
  const auth = await validateAuth();

  if (!auth) {
    throw new Error("Not authenticated");
  }

  if (!isSystemAdmin(auth)) {
    throw new Error("Unauthorized: System admin access required");
  }

  return auth;
}
