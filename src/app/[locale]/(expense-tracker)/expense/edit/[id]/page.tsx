// app/[locale]/(expense-tracker)/expense/page.tsx
import { BackButton } from "@/components/custom/back-button";
import { CustomTitle } from "@/components/custom/custom-title/custom-title";
import { ExpenseForm } from "@/features/expense/components/expense-form";

import { getSpaceMembers } from "@/features/space/actions/get-space-members.action";
import { validateAuth } from "@/features/auth/services/auth.service";
import { redirect } from "next/navigation";
import { getCategories } from "@/features/expense/actions/get-categories.action";
import { getTags } from "@/features/expense/actions/get-tags.action";
import { getExpense } from "@/features/expense/actions/get-expense.action";
import { Option } from "@/components/ui/multiple-selector";

export default async function ExpenseEditPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;

  // validate authentication
  const auth = await validateAuth();

  if (!auth) {
    redirect("/sign-in");
  }

  //get expense
  const expense = await getExpense(id, auth.spaceId);

  if (!expense) {
    redirect("/expense/list");
  }

  // get data needed in parallel (cached)
  const [categories, spaceMembers, tags] = await Promise.all([
    getCategories(),
    getSpaceMembers(auth.spaceId),
    getTags(auth.spaceId),
  ]);

  const expenseForForm = {
    id: expense.id.toString(),
    name: expense.name,
    amount: expense.amount,
    currency: expense.currency,
    date: new Date(expense.date),
    category_id: expense.category_id.toString(),
    responsible_id: expense.responsible_id || expense.responsible?.id || 0,
    status: expense.status,
    description: expense.description || undefined,
    tags: expense.tags?.map(tag => ({
      label: tag.name,
      value: tag.id.toString(),
    })) as Option[],
  };

  return (
    <div className="flex flex-col items-center justify-center overflow-x-hidden">
      <div className="max-w-3xl w-full">
        <div className="flex justify-between items-center py-3 w-full px-5 gap-5">
          <BackButton />
          <CustomTitle tag="h1" title="Edit expense" className="py-3" />
        </div>

        <ExpenseForm
          categories={categories}
          spaceMembers={spaceMembers}
          spaceId={auth.spaceId}
          tags={tags}
          expense={{
            ...expenseForForm,
            category_id: Number(expenseForForm.category_id),
            responsible_id: expenseForForm.responsible_id?.toString?.() ?? "",
            currency: String(expenseForForm.currency),
          }}
        />
      </div>
    </div>
  );
}
