// lib/users.ts
import { UserInterface } from "@/features/user/types/user.types";
import prisma from "./prisma";
import { SpaceInterface } from "@/features/space/types/space.types";
import { ExpenseInterface } from "@/features/expense/types/expense.types";
import { clerkClient } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

type CreateUserResult = {
  user: UserInterface;
  spaceId: string;
};

type SyncUserData = {
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
};

function combineNames(
  firstName?: string | null,
  lastName?: string | null,
  email?: string,
): string {
  const fullName = `${firstName || ""} ${lastName || ""}`.trim();
  if (fullName) return fullName;

  if (email) {
    const emailUsername = email.split("@")[0];
    if (emailUsername) return emailUsername;
  }

  return "User";
}

export async function syncUserFromClerk(data: SyncUserData) {
  try {
    const fullName = combineNames(data.firstName, data.lastName, data.email);

    const user = await prisma.user.upsert({
      where: { clerk_id: data.clerkId },
      update: {
        email: data.email,
        name: fullName,
        profile_image: data.imageUrl?.trim() || null,
        updated_at: new Date(),
      },
      create: {
        clerk_id: data.clerkId,
        email: data.email,
        name: fullName,
        profile_image: data.imageUrl?.trim() || null,
      },
    });

    return user;
  } catch (error) {
    console.error(`❌ Error syncing user from Clerk (${data.clerkId}):`, error);
    throw error;
  }
}

export async function createUserWithDefaultSpace(
  clerkUser: UserInterface,
): Promise<CreateUserResult> {
  try {
    if (!clerkUser.id) {
      throw new Error("Missing clerk user id");
    }

    if (!clerkUser.emailAddresses?.[0]?.emailAddress) {
      throw new Error("Missing user email address");
    }

    const email = clerkUser.emailAddresses[0].emailAddress.trim();
    const fullName = combineNames(
      clerkUser.firstName,
      clerkUser.lastName,
      email,
    );

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const newUser = await tx.user.create({
          data: {
            clerk_id: clerkUser.id,
            name: fullName,
            email: email,
            profile_image: clerkUser.imageUrl || null,
          },
        });

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
          user: newUser as unknown as UserInterface,
          spaceId: newSpace.id,
        };
      },
    );

    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: {
        activeSpaceId: result.spaceId,
      },
    });

    return result;
  } catch (error) {
    console.error(
      `❌ Error creating user with space (${clerkUser.id}):`,
      error,
    );
    throw error;
  }
}

export async function updateUserBoth(
  clerkId: string,
  data: {
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  },
) {
  try {
    const clerk = await clerkClient();
    await clerk.users.updateUser(clerkId, {
      firstName: data.firstName,
      lastName: data.lastName,
    });

    const updateData: Prisma.UserUpdateInput = {
      updated_at: new Date(),
    };

    if (data.firstName || data.lastName) {
      updateData.name = combineNames(data.firstName, data.lastName);
    }

    if (data.imageUrl !== undefined) {
      updateData.profile_image = data.imageUrl;
    }

    let updatedUser;

    try {
      updatedUser = await prisma.user.update({
        where: { clerk_id: clerkId },
        data: updateData,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        const clerk = await clerkClient();
        const clerkUser = await clerk.users.getUser(clerkId);
        const email = clerkUser.emailAddresses[0]?.emailAddress || "";

        if (!email) {
          throw new Error(`Missing email for Clerk user ${clerkId}`);
        }

        const fullName = combineNames(
          data.firstName ?? clerkUser.firstName,
          data.lastName ?? clerkUser.lastName,
          email,
        );

        updatedUser = await prisma.user.create({
          data: {
            clerk_id: clerkId,
            name: fullName,
            email,
            profile_image: data.imageUrl ?? clerkUser.imageUrl ?? null,
          },
        });
      } else {
        throw error;
      }
    }

    return updatedUser;
  } catch (error) {
    console.error(
      `❌ Error updating user in both systems (${clerkId}):`,
      error,
    );
    throw error;
  }
}

export async function createOrUpdateUser(
  clerkUser: UserInterface,
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
          clerkUser.id,
        )}`,
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
          clerkUser.emailAddresses,
        )}`,
      );
    }

    const email = clerkUser.emailAddresses[0].emailAddress.trim();

    if (!email || email === "") {
      throw new Error(
        `Cannot create user: email address is empty. Received: ${JSON.stringify(
          email,
        )}`,
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
          // Get profile image from Clerk user
          const profileImage = clerkUser.imageUrl || null;

          const updatedUser = await tx.user.update({
            where: { id: existingUser.id },
            data: {
              name: fullName,
              email: email,
              profile_image: profileImage,
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
        const profileImage = clerkUser.imageUrl || null;

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
          profile_image: profileImage,
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
              JSON.stringify(prismaError.meta, null, 2),
            );
            console.error("Target fields:", prismaError.meta?.target);
            console.error("Cause:", prismaError.meta?.cause);
            console.error(
              "Data that failed:",
              JSON.stringify(userCreateData, null, 2),
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
      },
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
  clerkId: string,
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
  spaceId: string,
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
  expenseId: string,
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

// Function to sync profile image manually
export async function syncUserProfileImage(clerkId: string): Promise<boolean> {
  try {
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(clerkId);

    await createOrUpdateUser({
      id: clerkUser.id,
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      imageUrl: clerkUser.imageUrl,
      emailAddresses: clerkUser.emailAddresses.map((e) => ({
        emailAddress: e.emailAddress,
      })),
    } as UserInterface);

    return true;
  } catch (error) {
    console.error("Error syncing profile image:", error);
    return false;
  }
}
