// app/[locale]/(expense-tracker)/expense/page.tsx
import { CustomTitle } from "@/components";
import { ExpenseForm } from "@/features/expense/components/expense-form";

import { getSpaceMembers } from "@/features/space/actions/get-space-members.action";
import { validateAuth } from "@/features/auth/services/auth.service";
import { redirect } from "next/navigation";
import { getCategories } from "@/features/expense/actions/get-categories.action";
import { getTags } from "@/features/expense/actions/get-tags.action";
import { getExpense } from "@/features/expense/actions/get-expense.action";
import { Option } from "@/components/ui/multiple-selector";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IoChevronBackOutline } from "react-icons/io5";

export default async function ExpenseEditPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  // validate authentication
  const auth = await validateAuth();

  if (!auth) {
    redirect("/sign-in");
  }

  //get expense
  const expense = await getExpense(params.id, auth.spaceId);

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
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full">
        <div className="flex justify-between items-center py-3 w-full px-5">
          <Link href="/expense/list">
            <Button className="btn">
              <IoChevronBackOutline className="w-4 h-4" />
            </Button>
          </Link>
          <CustomTitle tag="h1" title="Edit expense" className="py-3" />
        </div>

        <ExpenseForm
          categories={categories}
          spaceMembers={spaceMembers}
          spaceId={auth.spaceId}
          tags={tags}
          expense={expenseForForm}
        />
      </div>
    </div>
  );
}
