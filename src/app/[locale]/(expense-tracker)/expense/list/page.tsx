import { BackButton } from "@/components/custom/back-button";
import { CustomTitle } from "@/components/custom/custom-title/custom-title";
import { FormattedAmount } from "@/components/custom/currency/formatted-amount";
import { validateAuth } from "@/features/auth/services/auth.service";
import { getExpenses } from "@/features/expense/actions/get-expenses.action";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import ExpenseSummary from "@/features/expense/components/expense-summary";
import { SerializedExpense } from "@/features/expense/utils/serialize-expense";
import { IoChevronBackOutline } from "react-icons/io5";

export default async function ExpenseListPage() {
  const t = await getTranslations("expense");
  const locale = await getLocale();
  // Validate authentication
  const auth = await validateAuth();

  if (!auth) {
    redirect("/sign-in");
  }

  // Get expenses
  const expenses = await getExpenses(auth.spaceId);

  const expensesByCurrency = expenses.reduce((acc, expense) => {
    if (expense.status === "paid") {
      const currency = expense.currency;
      acc[currency] = (acc[currency] || 0) + expense.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center py-3">
          <div className="flex gap-5">
            <Link href="/">
              <Button className="rounded-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white text-black bg-gray-100 hover:bg-white">
                <IoChevronBackOutline className="w-5 h-5" />
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
              <p className="txt-muted text-sm">{t("totalPrice")}</p>
              <div className="flex flex-col items-center">
                {Object.entries(expensesByCurrency).length > 0 ? (
                  Object.entries(expensesByCurrency).map(
                    ([currency, total]) => (
                      <FormattedAmount
                        key={currency}
                        amount={total}
                        currency={currency}
                        locale={locale}
                        className="txt text-2xl font-bold"
                      />
                    )
                  )
                ) : (
                  <FormattedAmount
                    amount={0}
                    currency="USD"
                    locale={locale}
                    className="txt text-2xl font-bold"
                  />
                )}
              </div>
            </div>
            <div>
              <p className="txt-muted text-sm">{t("pending")}</p>
              <p className="txt text-2xl font-bold">
                {expenses.filter(e => e.status === "pending").length}
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
              <ExpenseSummary
                key={expense.id}
                expense={expense as SerializedExpense}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
