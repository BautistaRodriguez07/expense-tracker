"use server";

import { InvitationService } from "../services/invitation.service";
import { validateAuth } from "@/features/auth/services/auth.service";

export async function acceptInvitation(token: string) {
  try {
    const auth = await validateAuth();

    if (!auth) {
      return {
        success: false,
        error: "Not authenticated",
        needsAuth: true,
      };
    }

    await InvitationService.acceptInvitation(token, auth.dbUser.id);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to accept invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to accept invitation",
    };
  }
}

export async function acceptInvitationWithoutAuth(
  token: string,
  email: string,
) {
  try {
    // Verify the invitation exists and is for this email
    const invitation = await InvitationService.getInvitationByToken(token);

    if (invitation.invited_email.toLowerCase() !== email.toLowerCase()) {
      return {
        success: false,
        error: "This invitation is not for your email address",
      };
    }

    return {
      success: true,
      data: invitation,
    };
  } catch (error) {
    console.error("Failed to verify invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to verify invitation",
    };
  }
}
