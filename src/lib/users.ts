import { UserInterface } from "@/interfaces/UserInterface";
import prisma from "./prisma";
import { SpaceInterface } from "@/interfaces/SpaceInterface";
import { ExpenseInterface } from "@/interfaces/ExpenseInterface";

export async function createOrUpdateUser(
  clerkUser: UserInterface
): Promise<UserInterface> {
  try {
    const fullName = `${clerkUser.firstName || ""} ${
      clerkUser.lastName || ""
    }`.trim();

    const email = clerkUser.emailAddresses[0].emailAddress;

    return await prisma.$transaction(async tx => {
      const existingUser = await tx.user.findUnique({
        where: { clerk_id: clerkUser.id },
      });

      if (existingUser) {
        return await tx.user.update({
          where: { id: existingUser.id },
          data: {
            name: fullName,
            email: email,
            updated_at: new Date(),
          },
        });
      }

      const newUser = await tx.user.create({
        data: {
          clerk_id: clerkUser.id,
          name: fullName,
          email: email,
          password_hash: "",
        },
      });

      await tx.space.create({
        data: {
          name: "Mi Espacio Personal",
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

      return newUser;
    });
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
