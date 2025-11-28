import { CustomTitle } from "@/components";
import { validateAuth } from "@/features/auth/services/auth.service";
import { getExpenses } from "@/features/expense/actions/get-expenses.action";
import { ExpenseCard } from "@/features/expense/components/expense-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoChevronBackOutline } from "react-icons/io5";
import { getTranslations } from "next-intl/server";

export default async function ExpenseListPage() {
  const t = await getTranslations("expense");
  // Validate authentication
  const auth = await validateAuth();

  if (!auth) {
    redirect("/sign-in");
  }

  // Get expenses
  const expenses = await getExpenses(auth.spaceId);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center py-3">
          <div className="flex gap-5">
            <Link href="/">
              <Button className="btn">
                <IoChevronBackOutline className="w-4 h-4" />
              </Button>
            </Link>
            <CustomTitle tag="h1" title={t("allExpenses")} />
          </div>
          <Link href="/expense/new">
            <Button className="btn">{t("newExpense")}</Button>
          </Link>
        </div>

        {/* Stats Card */}
        <div className="card-container mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="txt-muted text-sm">{t("totalExpenses")}</p>
              <p className="txt text-2xl font-bold">{expenses.length}</p>
            </div>
            <div>
              <p className="txt-muted text-sm">{t("totalAmount")}</p>
              <p className="txt text-2xl font-bold">
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: expenses[0]?.currency || "USD",
                }).format(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
              </p>
            </div>
            <div>
              <p className="txt-muted text-sm">{t("pending")}</p>
              <p className="txt text-2xl font-bold">
                {expenses.filter(e => !e.deleted_at).length}
              </p>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        {expenses.length === 0 ? (
          <div className="card-container text-center py-12">
            <p className="txt-muted text-lg mb-4">{t("noExpenses")}</p>
            <Link href="/expense/new">
              <Button className="btn">{t("createYourFirstExpense")}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map(expense => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
