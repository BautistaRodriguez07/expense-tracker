import prisma from "@/lib/prisma";
import { cache } from "react";
import type { Expense } from "@prisma/client";
import type { Option } from "@/components/ui/multiple-selector";

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
      where: { id: Number(expenseId) },
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
    const expense = await prisma.expense.findUnique({
      where: { id: Number(expenseId) },
      select: { deleted_at: true },
    });

    if (expense?.deleted_at) {
      throw new Error("Expense is already deleted");
    }

    await prisma.expense.update({
      where: { id: Number(expenseId) },
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
      where: { id: Number(expenseId) },
      include: {
        category: true,
        paidBy: true,
        createdBy: true,
        tags: {
          include: {
            tag: true,
          },
        },
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
      where: { id: Number(expenseId) },
      select: { space_id: true, deleted_at: true },
    });

    return expense?.space_id === spaceId && !expense?.deleted_at;
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
      where: { id: Number(expenseId) },
      select: {
        created_by: true,
        paid_by: true,
        deleted_at: true,
      },
    });

    if (!expense || expense.deleted_at) return false;

    return expense.created_by === userId || expense.paid_by === userId;
  }

  /**
   * create or find tags by name in a space
   * returns array of tag IDs
   */
  static async createOrFindTags(
    tagOptions: Option[],
    spaceId: number
  ): Promise<number[]> {
    if (!tagOptions || tagOptions.length === 0) {
      return [];
    }

    const tagIds: number[] = [];

    for (const tagOption of tagOptions) {
      // Try to find existing tag by name in this space
      let tag = await prisma.tag.findFirst({
        where: {
          space_id: spaceId,
          name: tagOption.label,
          deleted_at: null,
        },
      });

      // If tag doesn't exist, create it
      if (!tag) {
        tag = await prisma.tag.create({
          data: {
            name: tagOption.label,
            space_id: spaceId,
          },
        });
      }

      tagIds.push(tag.id);
    }

    return tagIds;
  }

  /**
   * associate tags with an expense
   */
  static async associateTags(
    expenseId: number,
    tagIds: number[]
  ): Promise<void> {
    // Remove existing tags
    await prisma.expenseTag.deleteMany({
      where: { expense_id: expenseId },
    });

    // Add new tags
    if (tagIds.length > 0) {
      await prisma.expenseTag.createMany({
        data: tagIds.map(tagId => ({
          expense_id: expenseId,
          tag_id: tagId,
        })),
        skipDuplicates: true,
      });
    }
  }
}
