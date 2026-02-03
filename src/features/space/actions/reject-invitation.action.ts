"use server";

import { InvitationService } from "../services/invitation.service";
import { validateAuth } from "@/features/auth/services/auth.service";

export async function rejectInvitation(token: string) {
  try {
    const auth = await validateAuth();

    if (!auth) {
      return {
        success: false,
        error: "Not authenticated",
        needsAuth: true,
      };
    }

    await InvitationService.rejectInvitation(token, auth.dbUser.id);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to reject invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to reject invitation",
    };
  }
}
