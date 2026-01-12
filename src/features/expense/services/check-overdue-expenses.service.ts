import prisma from "@/lib/prisma";

export async function checkAndMarkOverdueExpenses(spaceId: string) {
  const now = new Date();

  const result = await prisma.expense.updateMany({
    where: {
      space_id: spaceId,
      status: "pending",
      date: {
        lt: now,
      },
    },
    data: {
      status: "overdue",
      updated_at: now,
    },
  });

  return result;
}
