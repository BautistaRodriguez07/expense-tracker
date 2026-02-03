import prisma from "@/lib/prisma";
import { NotificationService } from "@/features/notifications/services/notification.service";
import { randomUUID } from "crypto";
import type { PrismaClient } from "@prisma/client";

export class InvitationService {
  /**
   * Create invitation
   */
  static async createInvitation(data: {
    spaceId: string;
    invitedBy: string;
    invitedEmail: string;
  }) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.invitedEmail)) {
      throw new Error("Invalid email address");
    }

    // Check if user is the space owner
    const space = await prisma.space.findUnique({
      where: { id: data.spaceId },
    });

    if (!space) {
      throw new Error("Space not found");
    }

    if (space.owner_id !== data.invitedBy) {
      throw new Error("Only space owners can send invitations");
    }

    // Find user by email first
    const invitedUser = await prisma.user.findFirst({
      where: {
        email: data.invitedEmail,
      },
    });

    if (!invitedUser) {
      throw new Error("No user found with this email address");
    }

    // Check if user is already a member
    const existingMember = await prisma.spaceMember.findFirst({
      where: {
        space_id: data.spaceId,
        user_id: invitedUser.id,
      },
    });

    if (existingMember) {
      throw new Error("User is already a member of this space");
    }

    // Check for existing pending invitation
    const existingInvitation = await prisma.spaceInvitation.findFirst({
      where: {
        space_id: data.spaceId,
        invited_email: data.invitedEmail,
        status: "pending",
        expires_at: {
          gt: new Date(),
        },
      },
    });

    if (existingInvitation) {
      throw new Error("An invitation has already been sent to this email");
    }

    // Generate unique token and expiration (1 day)
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    // Create invitation
    const invitation = await prisma.spaceInvitation.create({
      data: {
        space_id: data.spaceId,
        invited_by: data.invitedBy,
        invited_email: data.invitedEmail,
        token,
        expires_at: expiresAt,
      },
      include: {
        space: true,
        invitedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    // Send notification to the invited user
    try {
      await NotificationService.createInvitationNotification({
        invitedUserId: invitedUser.id,
        inviterId: data.invitedBy,
        spaceName: invitation.space.name,
        invitationToken: token,
      });
    } catch (notificationError) {
      console.error("❌ Notification creation failed:", notificationError);
      // If notification fails, delete the invitation and throw error
      await prisma.spaceInvitation.delete({
        where: { id: invitation.id },
      });
      throw new Error("Failed to create invitation notification");
    }

    return invitation;
  }

  /**
   * Get invitation by token
   */
  static async getInvitationByToken(token: string) {
    const invitation = await prisma.spaceInvitation.findUnique({
      where: { token },
      include: {
        space: {
          include: {
            owner: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        invitedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (invitation.status !== "pending") {
      throw new Error("Invitation is no longer valid");
    }

    if (new Date() > invitation.expires_at) {
      // Mark as expired
      await prisma.spaceInvitation.update({
        where: { id: invitation.id },
        data: {
          status: "expired",
          responded_at: new Date(),
        },
      });
      throw new Error("Invitation has expired");
    }

    return invitation;
  }

  /**
   * Accept invitation and add user to space
   */
  static async acceptInvitation(token: string, userId: string) {
    const invitation = await this.getInvitationByToken(token);

    // Verify that the user's email matches the invitation email
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.email.toLowerCase() !== invitation.invited_email.toLowerCase()) {
      throw new Error("This invitation is not for your email address");
    }

    // Check if user is already a member (double check)
    const existingMember = await prisma.spaceMember.findFirst({
      where: {
        space_id: invitation.space_id,
        user_id: userId,
      },
    });

    if (existingMember) {
      // Mark invitation as accepted anyway
      await prisma.spaceInvitation.update({
        where: { id: invitation.id },
        data: {
          status: "accepted",
          responded_at: new Date(),
        },
      });
      return existingMember;
    }

    // Add user to space as member
    const member = await prisma.$transaction(async (tx: PrismaClient) => {
      // Create membership
      const newMember = await tx.spaceMember.create({
        data: {
          user_id: userId,
          space_id: invitation.space_id,
          role: "member",
        },
      });

      // Update invitation status
      await tx.spaceInvitation.update({
        where: { id: invitation.id },
        data: {
          status: "accepted",
          responded_at: new Date(),
        },
      });

      return newMember;
    });

    // Notify the inviter that the invitation was accepted
    try {
      await NotificationService.createInvitationAcceptedNotification({
        inviterUserId: invitation.invited_by,
        acceptedByUserId: userId,
        spaceName: invitation.space.name,
      });
    } catch (notificationError) {
      console.error(
        "❌ Failed to create acceptance notification:",
        notificationError,
      );
      // Don't fail the operation if notification fails
    }

    return member;
  }

  /**
   * Reject invitation
   */
  static async rejectInvitation(token: string, userId?: string) {
    const invitation = await this.getInvitationByToken(token);

    let rejectedByUserId = userId;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (
        user &&
        user.email.toLowerCase() !== invitation.invited_email.toLowerCase()
      ) {
        throw new Error("This invitation is not for your email address");
      }
    } else {
      const user = await prisma.user.findFirst({
        where: { email: invitation.invited_email },
      });

      rejectedByUserId = user?.id;
    }

    await prisma.spaceInvitation.update({
      where: { id: invitation.id },
      data: {
        status: "rejected",
        responded_at: new Date(),
      },
    });

    if (rejectedByUserId) {
      try {
        await NotificationService.createInvitationRejectedNotification({
          inviterUserId: invitation.invited_by,
          rejectedByUserId: rejectedByUserId,
          spaceName: invitation.space.name,
        });
      } catch (notificationError) {
        console.error(
          "❌ Failed to create rejection notification:",
          notificationError,
        );
      }
    }

    return invitation;
  }

  /**
   * Get pending invitations for a user
   */
  static async getPendingInvitationsForUser(email: string) {
    return await prisma.spaceInvitation.findMany({
      where: {
        invited_email: email,
        status: "pending",
        expires_at: {
          gt: new Date(),
        },
      },
      include: {
        space: {
          include: {
            owner: {
              select: {
                name: true,
              },
            },
          },
        },
        invitedBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  /**
   * Get all invitations for a space (for owners)
   */
  static async getSpaceInvitations(spaceId: string, ownerId: string) {
    // Verify ownership
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space || space.owner_id !== ownerId) {
      throw new Error("Only space owners can view invitations");
    }

    return await prisma.spaceInvitation.findMany({
      where: {
        space_id: spaceId,
      },
      include: {
        invitedBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  /**
   * Clean up expired invitations
   */
  static async cleanupExpiredInvitations() {
    return await prisma.spaceInvitation.updateMany({
      where: {
        status: "pending",
        expires_at: {
          lt: new Date(),
        },
      },
      data: {
        status: "expired",
        responded_at: new Date(),
      },
    });
  }
}
