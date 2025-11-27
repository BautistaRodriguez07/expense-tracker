// app/[locale]/(expense-tracker)/expense/page.tsx
import { CustomTitle } from "@/components";
import { ExpenseForm } from "@/features/expense/components/expense-form";

import { getSpaceMembers } from "@/features/space/actions/get-space-members.action";
import { validateAuth } from "@/features/auth/services/auth.service";
import { redirect } from "next/navigation";
import { getCategories } from "@/features/expense/actions/get-categories.action";

export default async function ExpensePage() {
  // validate authentication
  const auth = await validateAuth();

  if (!auth) {
    redirect("/sign-in");
  }

  // get data needed in parallel (cached)
  const [categories, spaceMembers] = await Promise.all([
    getCategories(),
    getSpaceMembers(auth.spaceId),
  ]);

  return (
    <div className="flex flex-col items-center justify-center">
      <CustomTitle tag="h1" title="Create new expense" className="py-3" />
      <div className="max-w-3xl w-full">
        <ExpenseForm
          categories={categories}
          spaceMembers={spaceMembers}
          spaceId={auth.spaceId}
        />
      </div>
    </div>
  );
}
