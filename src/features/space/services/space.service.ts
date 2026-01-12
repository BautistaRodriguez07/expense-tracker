import prisma from "@/lib/prisma";
import type { currency, Space } from "@prisma/client";
import { Prisma } from "@prisma/client";

export class SpaceService {
  /**
   * Create a new space with the user as owner
   */
  static async create(data: {
    name: string;
    default_currency: string;
    owner_id: string;
  }): Promise<Space> {
    // Business validations
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Space name is required");
    }

    if (data.name.trim().length < 3) {
      throw new Error("Space name must be at least 3 characters");
    }

    // Check if user already has a space with the same name
    const existingSpace = await prisma.space.findFirst({
      where: {
        owner_id: data.owner_id,
        name: data.name,
        deleted_at: null,
      },
    });

    if (existingSpace) {
      throw new Error("You already have a space with this name");
    }

    // Create space and add owner as member in a transaction
    return await prisma.$transaction(async tx => {
      const newSpace = await tx.space.create({
        data: {
          name: data.name,
          default_currency: data.default_currency as currency,
          owner_id: data.owner_id,
        },
      });

      // Add owner as a member with owner role
      await tx.spaceMember.create({
        data: {
          user_id: data.owner_id,
          space_id: newSpace.id,
          role: "owner",
        },
      });

      return newSpace;
    });
  }

  /**
   * Soft delete a space (only owner can delete)
   */
  static async delete(spaceId: string, userId: string): Promise<Space> {
    // Verify ownership
    const space = await prisma.space.findUnique({
      where: { id: spaceId, deleted_at: null },
      include: {
        members: true,
        expenses: {
          where: { deleted_at: null },
          take: 1,
        },
      },
    });

    if (!space) {
      throw new Error("Space not found");
    }

    if (space.owner_id !== userId) {
      throw new Error("Only the space owner can delete the space");
    }

    // Business rule: Cannot delete the default space
    if (space.is_default) {
      throw new Error(
        "Cannot delete your default space. This space was created with your account and cannot be removed."
      );
    }

    // Business rule: Don't allow deletion if there are active expenses
    if (space.expenses.length > 0) {
      throw new Error(
        "Cannot delete space with active expenses. Please delete all expenses first."
      );
    }

    // Soft delete
    return await prisma.space.update({
      where: { id: spaceId },
      data: {
        deleted_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  /**
   * Get all spaces where user is a member
   */
  static async getUserSpaces(userId: string) {
    return await prisma.space.findMany({
      where: {
        deleted_at: null,
        members: {
          some: {
            user_id: userId,
          },
        },
      },
      include: {
        members: {
          select: {
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            expenses: {
              where: { deleted_at: null },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }
}
