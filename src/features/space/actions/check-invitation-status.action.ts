"use server";

import prisma from "@/lib/prisma";

export async function checkInvitationStatus(token: string) {
  try {
    const invitation = await prisma.spaceInvitation.findUnique({
      where: { token },
      select: {
        status: true,
      },
    });

    if (!invitation) {
      return {
        success: false,
        status: "not_found",
        error: "Invitation not found",
      };
    }

    return {
      success: true,
      status: invitation.status, // 'pending', 'accepted', 'rejected', 'expired'
    };
  } catch (error) {
    return {
      success: false,
      status: "unknown",
      error: error instanceof Error ? error.message : "Invitation not found",
    };
  }
}
