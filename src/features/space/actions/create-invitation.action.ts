"use server";

import { InvitationService } from "../services/invitation.service";
import { validateAuth } from "@/features/auth/services/auth.service";
import { redirect } from "next/navigation";

export async function createInvitation(formData: FormData) {
  const auth = await validateAuth();
  if (!auth) redirect("/sign-in");

  const spaceId = formData.get("spaceId") as string;
  const email = formData.get("email") as string;

  if (!spaceId || !email) {
    return {
      success: false,
      error: "Space ID and email are required",
    };
  }

  try {
    const invitation = await InvitationService.createInvitation({
      spaceId,
      invitedBy: auth.dbUser.id,
      invitedEmail: email.trim().toLowerCase(),
    });

    return {
      success: true,
      data: invitation,
    };
  } catch (error) {
    console.error("Failed to create invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create invitation",
    };
  }
}
