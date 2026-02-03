import { CustomTitle } from "@/components/custom/custom-title/custom-title";
import { FormattedAmount } from "@/components/custom/currency/formatted-amount";
import { validateAuth } from "@/features/auth/services/auth.service";
import { 
  getExpensesPaginated,
  getExpensesStats 
} from "@/features/expense/actions/get-expenses.action";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import ExpenseSummary from "@/features/expense/components/expense-summary";
import { SerializedExpense } from "@/features/expense/utils/serialize-expense";
import { IoChevronBackOutline } from "react-icons/io5";
import { CustomPagination } from "@/components/custom/pagination/pagination";

const EXPENSES_PER_PAGE = 10;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function ExpenseListPage({ searchParams }: Props) {
  const t = await getTranslations("expense");
  const locale = await getLocale();
  
  // Validate authentication
  const auth = await validateAuth();

  if (!auth) {
    redirect("/sign-in");
  }

  // Get current page from searchParams
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // Get paginated expenses and stats in parallel
  const [paginatedData, stats] = await Promise.all([
    getExpensesPaginated(auth.spaceId, currentPage, EXPENSES_PER_PAGE),
    getExpensesStats(auth.spaceId),
  ]);

  const { expenses, totalPages } = paginatedData;
  const { totalCount, pendingCount, expensesByCurrency }: {
    totalCount: number;
    pendingCount: number;
    expensesByCurrency: Record<string, number>;
  } = stats;

  return (
    <div className="flex flex-col items-center justify-center overflow-x-hidden">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="order-2 sm:order-1">
              <p className="txt-muted text-sm">{t("totalExpenses")}</p>
              <p className="txt text-2xl font-bold">{totalCount}</p>
            </div>
            <div className="order-1 sm:order-2">
              <p className="txt-muted text-sm">{t("totalPrice")}</p>
              <div className="flex flex-col items-center">
                {Object.entries(expensesByCurrency).length > 0 ? (
                  Object.entries(expensesByCurrency).map(([currency, total]: [string, number]) => (
                    <FormattedAmount
                      key={currency}
                      amount={total}
                      currency={currency}
                      locale={locale}
                      className="txt text-2xl font-bold"
                    />
                  ))
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
            <div className="order-3 sm:order-3">
              <p className="txt-muted text-sm">{t("pending")}</p>
              <p className="txt text-2xl font-bold">{pendingCount}</p>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        {totalCount === 0 ? (
          <div className="card-container text-center py-12">
            <p className="txt-muted text-lg mb-4">{t("noExpenses")}</p>
            <Link href="/expense/new">
              <Button className="btn">{t("createYourFirstExpense")}</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {expenses.map(expense => (
                <ExpenseSummary
                  key={expense.id}
                  expense={expense as SerializedExpense}
                />
              ))}
            </div>

            {/* Pagination */}
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        )}
      </div>
    </div>
  );
}