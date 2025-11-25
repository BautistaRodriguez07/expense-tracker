"use server";

import { ExpenseInterface } from "@/interfaces/ExpenseInterface";
import { SpaceMemberInterface } from "@/interfaces/SpaceInterface";
import prisma from "@/lib/prisma";
import { getExpenseById, getSpaceById, getUserByClerkId } from "@/lib/users";
import {
  BaseExpenseSchema,
  BaseExpenseType,
  CreateExpenseType,
  UpdateExpenseType,
} from "@/schema/NewExpenseSchema";
import { currentUser } from "@clerk/nextjs/server";

export async function getExpenseData(
  formData: FormData
): Promise<BaseExpenseType> {
  const name = formData.get("name") as string;
  const amount = formData.get("amount");
  const currency = formData.get("currency") as string;
  const expireDate = formData.get("expireDate");
  const category = formData.get("category") as string;
  const responsible = formData.get("responsible") as string;
  const note = formData.get("note") as string;
  const tags = formData.get("tags");
  const receipt = formData.get("receipt");
  const status = formData.get("status") as string;
  const expenseData: CreateExpenseType = {
    name,
    amount: Number(amount),
    currency,
    expireDate: new Date(expireDate as string),
    category,
    responsible,
    note,
    tags: tags ? JSON.parse(tags as string) : [],
    receipt: receipt ? JSON.parse(receipt as string) : [],
    status,
  };
  return expenseData;
}

export async function createExpense(
  formData: FormData,
  spaceId: string
): Promise<BaseExpenseType> {
  try {
    // get user from session
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("User not authenticated");
    }

    // Validate expense data against schema
    const result = BaseExpenseSchema.safeParse(formData);
    if (!result.success) {
      throw new Error(result.error.message);
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

    // Create expense in DB
    const newExpense = await prisma.expense.create({
      data: result.data,
    });

    return newExpense;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
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
