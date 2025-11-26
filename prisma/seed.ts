import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed (cleaning database)...");

  await prisma.expenseTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.expenseReceipt.deleteMany();
  await prisma.expenseSplit.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.spaceInvitation.deleteMany();
  await prisma.spaceMember.deleteMany();
  await prisma.space.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Database cleaned successfully");

  await prisma.category.createMany({
    data: [
      { name: "Food", color: "#FF5733", icon: "🍔" },
      { name: "Transport", color: "#33FF57", icon: "🚗" },
      { name: "Home", color: "#3357FF", icon: "🏠" },
      { name: "Entertainment", color: "#FF5733", icon: "🎉" },
      { name: "Health", color: "#33FF57", icon: "🏥" },
      { name: "Shopping", color: "#3357FF", icon: "🛒" },
      { name: "Other", color: "#FF5733", icon: "💰" },
    ],
  });

  console.log("✅ Seed finished successfully");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
