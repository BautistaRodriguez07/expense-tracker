import { CustomTitle } from "@/components";
import { ExpenseForm } from "./ExpenseForm";
import prisma from "@/lib/prisma";
import { getSpaceMembers } from "@/features/expense/actions/get-space-members";
import { getUserByClerkId } from "@/lib/users";
import { currentUser } from "@clerk/nextjs/server";

export default async function ExpensePage() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("User not authenticated");
  }

  const user = await getUserByClerkId(clerkUser.id);
  if (!user) {
    throw new Error("User not found in database");
  }

  const userSpaceMember = await prisma.spaceMember.findFirst({
    where: { user_id: user.id },
    select: { space_id: true },
  });

  if (!userSpaceMember) {
    throw new Error("User does not belong to any space");
  }

  const categories = await prisma.category.findMany();
  const spaceMembers = await getSpaceMembers(userSpaceMember.space_id);
  return (
    <div className=" flex flex-col items-center justify-center">
      <CustomTitle tag="h1" title="Create new expense" className="py-3" />
      <div className="max-w-3xl w-full">
        <ExpenseForm
          categories={categories}
          spaceMembers={spaceMembers}
          spaceId={userSpaceMember.space_id}
        />
      </div>
    </div>
  );
}
