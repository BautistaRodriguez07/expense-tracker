import prisma from "@/lib/prisma";
import { cache } from "react";
import type { Expense } from "@prisma/client";

export class ExpenseService {
  /**
   * create a new expense
   */
  static async create(data: {
    name: string;
    amount: number;
    currency: string;
    date: Date;
    description?: string;
    space_id: number;
    category_id: number;
    paid_by: number;
    created_by: number;
  }): Promise<Expense> {
    // business validations
    if (data.amount <= 0) {
      throw new Error("Amount must be positive");
    }

    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Name is required");
    }

    return await prisma.expense.create({ data });
  }

  /**
   * update an existing expense
   */
  static async update(
    expenseId: string,
    data: Partial<{
      name: string;
      amount: number;
      currency: string;
      date: Date;
      description: string;
      category_id: number;
      paid_by: number;
    }>,
    updatedBy: number
  ): Promise<Expense> {
    // business validations
    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error("Amount must be positive");
    }

    return await prisma.expense.update({
      where: { id: expenseId },
      data: {
        ...data,
        updated_by: updatedBy,
        updated_at: new Date(),
      },
    });
  }

  /**
   * delete an expense (soft delete)
   */
  static async delete(expenseId: string, deletedBy: number): Promise<void> {
    await prisma.expense.update({
      where: { id: expenseId },
      data: {
        deleted_at: new Date(),
        deleted_by: deletedBy,
      },
    });
  }

  /**
   * get expense by ID (cached)
   */
  static getById = cache(async (expenseId: string): Promise<Expense | null> => {
    return await prisma.expense.findUnique({
      where: { id: expenseId },
      include: {
        category: true,
        paidBy: true,
        createdBy: true,
      },
    });
  });

  /**
   * verify that an expense belongs to a workspace
   */
  static async belongsToWorkspace(
    expenseId: string,
    spaceId: number
  ): Promise<boolean> {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
      select: { space_id: true },
    });

    return expense?.space_id === spaceId;
  }

  /**
   * verify if the user can edit the expense
   * only the creator or the responsible can edit
   */
  static async canUserEdit(
    expenseId: string,
    userId: number
  ): Promise<boolean> {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
      select: {
        created_by: true,
        paid_by: true,
      },
    });

    if (!expense) return false;

    return expense.created_by === userId || expense.paid_by === userId;
  }
}
