"use server";

import { SpaceMemberInterface } from "@/interfaces/SpaceInterface";
import prisma from "@/lib/prisma";
import { getExpenseById, getSpaceById, getUserByClerkId } from "@/lib/users";
import {
  BaseExpenseSchema,
  UpdateExpenseType,
} from "@/schema/NewExpenseSchema";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createExpense(
  formData: FormData,
  spaceId?: string // Hacemos spaceId opcional
) {
  try {
    // 1. Autenticación
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("User not authenticated");

    const user = await getUserByClerkId(clerkUser.id);
    if (!user) throw new Error("User not found in database");

    // 2. Resolver Space ID (Si no viene, usamos el primero del usuario)
    let targetSpaceId = spaceId ? parseInt(spaceId) : null;

    if (!targetSpaceId) {
      // Buscar el primer espacio del usuario
      const userSpaceMember = await prisma.spaceMember.findFirst({
        where: { user_id: user.id },
        select: { space_id: true },
      });

      if (!userSpaceMember)
        throw new Error("User does not belong to any space");
      targetSpaceId = userSpaceMember.space_id;
    }

    const rawData = {
      name: formData.get("name"),
      amount: Number(formData.get("amount")),
      currency: formData.get("currency"),
      date: new Date(formData.get("expireDate") as string),
      category: formData.get("category"),
      responsible: formData.get("responsible"),
      status: formData.get("status"),
      note: formData.get("note"),
    };

    //find category by name
    const categoryName = rawData.category as string;
    let category = await prisma.category.findFirst({
      where: { name: { equals: categoryName, mode: "insensitive" } },
    });

    //if no category, use the first one
    if (!category) {
      category = await prisma.category.findFirst();
      if (!category) throw new Error("No categories found in DB. Run seed.");
    }

    //create expense
    const newExpense = await prisma.expense.create({
      data: {
        name: rawData.name as string,
        amount: rawData.amount,
        currency: rawData.currency as string,
        date: rawData.date,
        description: rawData.note as string,

        space_id: targetSpaceId,
        category_id: category.id,
        paid_by: rawData.responsible
          ? parseInt(rawData.responsible as string)
          : user.id,
        created_by: user.id,
      },
    });

    revalidatePath("/expense");
    return { success: true, expense: newExpense };
  } catch (error) {
    console.error("Error creating expense:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateExpense(
  //   expenseType: UpdateExpenseType,
  expenseId: string,
  spaceId: string
): Promise<UpdateExpenseType> {
  try {
    // get user from session
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("User not authenticated");
    }
    // 1. is user authenticated?
    const user = await getUserByClerkId(clerkUser.id);
    if (!user) {
      throw new Error("User not found");
    }

    // 2. si el usuario pertenece al space?
    const space = await getSpaceById(spaceId);
    if (!space) {
      throw new Error("Space not found");
    }
    if (
      !space.members.some(
        (member: SpaceMemberInterface) => member.user_id === user?.id
      )
    ) {
      throw new Error("User not a member of the space");
    }

    // 3. Validar que el gasto existe
    const expense = await getExpenseById(expenseId);
    if (!expense) {
      throw new Error("Expense not found");
    }

    // 4. User has permission: (solo podes editar si sos el creador o un admin o el responsable asignado)

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: expense,
    });
    return updatedExpense;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
}
