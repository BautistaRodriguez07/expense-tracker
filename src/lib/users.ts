// lib/users.ts
import { UserInterface } from "@/features/user/types/user.types";
import prisma from "./prisma";
import { SpaceInterface } from "@/features/space/types/space.types";
import { ExpenseInterface } from "@/features/expense/types/expense.types";
import { clerkClient } from "@clerk/nextjs/server";

type CreateUserResult = {
  user: UserInterface;
  spaceId: number;
};

export async function createOrUpdateUser(
  clerkUser: UserInterface
): Promise<CreateUserResult> {
  try {
    const fullName = `${clerkUser.firstName || ""} ${
      clerkUser.lastName || ""
    }`.trim();

    const email = clerkUser.emailAddresses[0].emailAddress;

    const result = await prisma.$transaction(async tx => {
      const existingUser = await tx.user.findUnique({
        where: { clerk_id: clerkUser.id },
      });

      // If the user already exists, only update basic data
      if (existingUser) {
        const updatedUser = await tx.user.update({
          where: { id: existingUser.id },
          data: {
            name: fullName,
            email: email,
            updated_at: new Date(),
          },
        });

        // Get the existing spaceId
        const spaceMember = await tx.spaceMember.findFirst({
          where: { user_id: existingUser.id },
          select: { space_id: true },
        });

        return {
          user: updatedUser,
          spaceId: spaceMember?.space_id || 0,
        };
      }

      // Create new user
      const newUser = await tx.user.create({
        data: {
          clerk_id: clerkUser.id,
          name: fullName,
          email: email,
          password_hash: "",
        },
      });

      // Create default space
      const newSpace = await tx.space.create({
        data: {
          name: "My Personal Space",
          default_currency: "USD",
          owner_id: newUser.id,
          members: {
            create: {
              user_id: newUser.id,
              role: "owner",
            },
          },
        },
      });

      return {
        user: newUser,
        spaceId: newSpace.id,
      };
    });

    // ✅ Update Clerk metadata with the activeSpaceId
    if (result.spaceId) {
      await clerkClient.users.updateUserMetadata(clerkUser.id, {
        publicMetadata: {
          activeSpaceId: result.spaceId,
        },
      });
    }

    return result;
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw error;
  }
}

export async function getUserByClerkId(
  clerkId: string
): Promise<UserInterface | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    return user;
  } catch (error) {
    console.error("Error getting user by clerk id:", error);
    throw error;
  }
}

export async function getSpaceById(
  spaceId: string
): Promise<SpaceInterface | null> {
  try {
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    });
    return space;
  } catch (error) {
    console.error("Error getting space by id:", error);
    throw error;
  }
}

export async function getExpenseById(
  expenseId: string
): Promise<ExpenseInterface | null> {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });
    return expense;
  } catch (error) {
    console.error("Error getting expense by id:", error);
    throw error;
  }
}
