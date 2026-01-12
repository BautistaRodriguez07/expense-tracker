// lib/users.ts
import { UserInterface } from "@/features/user/types/user.types";
import prisma from "./prisma";
import { SpaceInterface } from "@/features/space/types/space.types";
import { ExpenseInterface } from "@/features/expense/types/expense.types";
import { clerkClient } from "@clerk/nextjs/server";
import type { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

type CreateUserResult = {
  user: UserInterface;
  spaceId: string;
};

export async function createOrUpdateUser(
  clerkUser: UserInterface
): Promise<CreateUserResult> {
  try {
    // Validate clerk_id - required field
    if (
      !clerkUser.id ||
      typeof clerkUser.id !== "string" ||
      clerkUser.id.trim() === ""
    ) {
      throw new Error(
        `Cannot create user: Clerk ID is required but not provided. Received: ${JSON.stringify(
          clerkUser.id
        )}`
      );
    }

    // Validate email - required field
    if (
      !clerkUser.emailAddresses ||
      clerkUser.emailAddresses.length === 0 ||
      !clerkUser.emailAddresses[0]?.emailAddress
    ) {
      throw new Error(
        `Cannot create user: email address is required but not provided. Received: ${JSON.stringify(
          clerkUser.emailAddresses
        )}`
      );
    }

    const email = clerkUser.emailAddresses[0].emailAddress.trim();

    if (!email || email === "") {
      throw new Error(
        `Cannot create user: email address is empty. Received: ${JSON.stringify(
          email
        )}`
      );
    }

    // Validate name - provide fallback if empty
    let fullName = `${clerkUser.firstName || ""} ${
      clerkUser.lastName || ""
    }`.trim();

    // If name is still empty, use email username or fallback to "User"
    if (!fullName || fullName === "") {
      fullName = email.split("@")[0] || "User";
    }

    // Final validation - ensure name is not empty
    if (!fullName || fullName.trim() === "") {
      fullName = "User";
    } else {
      fullName = fullName.trim();
    }

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Check if user exists by clerk_id
        let existingUser = await tx.user.findUnique({
          where: { clerk_id: clerkUser.id },
        });

        // Also check if user exists by email (in case clerk_id changed)
        if (!existingUser) {
          const userByEmail = await tx.user.findUnique({
            where: { email: email },
          });

          if (userByEmail) {
            // If user exists by email but different clerk_id, update clerk_id
            if (userByEmail.clerk_id !== clerkUser.id) {
              existingUser = await tx.user.update({
                where: { id: userByEmail.id },
                data: {
                  clerk_id: clerkUser.id,
                  name: fullName,
                  updated_at: new Date(),
                },
              });
            } else {
              existingUser = userByEmail;
            }
          }
        }

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
            spaceId: spaceMember?.space_id || "",
          };
        }

        // Create new user
        // Final validation - ensure all values are non-null strings
        const clerkId = String(clerkUser.id).trim();
        const userName = String(fullName).trim();
        const userEmail = String(email).trim();

        if (!clerkId || clerkId === "") {
          throw new Error(`Invalid clerk_id: ${JSON.stringify(clerkId)}`);
        }
        if (!userName || userName === "") {
          throw new Error(`Invalid name: ${JSON.stringify(userName)}`);
        }
        if (!userEmail || userEmail === "") {
          throw new Error(`Invalid email: ${JSON.stringify(userEmail)}`);
        }

        // Create user - generate UUID explicitly to avoid default issues
        const userId = randomUUID();
        const userCreateData = {
          id: userId,
          clerk_id: clerkId,
          name: userName,
          email: userEmail,
          // Don't set password_hash - let it be null by default
        };

        let newUser;
        try {
          // Generate UUID explicitly to ensure it's set correctly
          newUser = await tx.user.create({
            data: userCreateData,
          });
        } catch (createError: unknown) {
          // Enhanced error logging
          if (createError && typeof createError === "object") {
            const prismaError = createError as {
              message?: string;
              code?: string;
              meta?: {
                target?: string[];
                cause?: string;
                [key: string]: unknown;
              };
              cause?: unknown;
            };

            console.error("=== PRISMA ERROR DETAILS ===");
            console.error("Message:", prismaError.message);
            console.error("Code:", prismaError.code);
            console.error(
              "Meta (full):",
              JSON.stringify(prismaError.meta, null, 2)
            );
            console.error("Target fields:", prismaError.meta?.target);
            console.error("Cause:", prismaError.meta?.cause);
            console.error(
              "Data that failed:",
              JSON.stringify(userCreateData, null, 2)
            );
            console.error("===========================");
          } else {
            console.error("Unknown error type:", createError);
          }
          throw createError;
        }

        // Create default space
        const newSpace = await tx.space.create({
          data: {
            name: "My Personal Space",
            default_currency: "USD",
            owner_id: newUser.id,
            is_default: true,
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
      }
    );

    // ✅ Update Clerk metadata with the activeSpaceId
    if (result.spaceId) {
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(clerkUser.id, {
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
