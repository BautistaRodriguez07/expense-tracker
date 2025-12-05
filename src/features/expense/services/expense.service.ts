import prisma from "@/lib/prisma";
import { cache } from "react";
import type { Expense } from "@prisma/client";
import type { Option } from "@/components/ui/multiple-selector";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

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
    space_id: string;
    category_id: number;
    responsible_id: string;
    status?: "pending" | "paid" | "cancelled";
    created_by: string;
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
      responsible_id: string;
      status: "pending" | "paid" | "cancelled";
    }>,
    updatedBy: string
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
  static async delete(expenseId: string, deletedBy: string): Promise<void> {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
      select: { deleted_at: true },
    });

    if (expense?.deleted_at) {
      throw new Error("Expense is already deleted");
    }

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
        responsible: true,
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
    spaceId: string
  ): Promise<boolean> {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
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
    userId: string
  ): Promise<boolean> {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
      select: {
        created_by: true,
        responsible_id: true,
        deleted_at: true,
      },
    });

    if (!expense || expense.deleted_at) return false;

    return expense.created_by === userId || expense.responsible_id === userId;
  }

  /**
   * verify if the user can pay the expense
   * only the responsible can pay
   */
  static async canUserPay(expenseId: string, userId: string): Promise<boolean> {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
      select: { responsible_id: true, deleted_at: true },
    });

    return expense?.responsible_id === userId && !expense?.deleted_at;
  }

  /**
   * verify if the user can delete the expense
   * only the creator or the responsible can delete
   */
  static async canUserDelete(
    expenseId: string,
    userId: string
  ): Promise<boolean> {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
      select: { created_by: true, responsible_id: true, deleted_at: true },
    });

    return (
      expense?.created_by === userId ||
      (expense?.responsible_id === userId && !expense?.deleted_at)
    );
  }

  /**
   * create or find tags by name in a space
   * returns array of tag IDs
   */
  static async createOrFindTags(
    tagOptions: Option[],
    spaceId: string
  ): Promise<string[]> {
    if (!tagOptions || tagOptions.length === 0) {
      return [];
    }

    const tagIds: string[] = [];

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
    expenseId: string,
    tagIds: string[]
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

  /**
   * Add a receipt to an expense
   */
  static async addReceipt(
    expenseId: string,
    fileUrl: string,
    uploadedBy: string
  ): Promise<void> {
    await prisma.expenseReceipt.create({
      data: {
        expense_id: expenseId,
        file_url: fileUrl,
        uploaded_by: uploadedBy,
      },
    });
  }
}

export async function saveFile(file: File, directory: string): Promise<string> {
  // Convert file to buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ensure directory exists
  const uploadDir = join(process.cwd(), "public", directory);
  await mkdir(uploadDir, { recursive: true });

  // Create unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, "-")}`;
  const filepath = join(uploadDir, filename);

  // Save file
  await writeFile(filepath, buffer);

  // Return relative URL
  return `/${directory}/${filename}`;
}
