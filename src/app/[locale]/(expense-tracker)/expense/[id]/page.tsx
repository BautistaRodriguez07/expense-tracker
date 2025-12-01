import {
  BackButton,
  CategoryIcon,
  CustomTitle,
  FormattedAmount,
} from "@/components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { validateAuth } from "@/features/auth/services/auth.service";
import { getExpense } from "@/features/expense/actions/get-expense.action";
import { DeleteExpenseButton } from "@/features/expense/components/delete-expense-button";
import { ExpenseStatusBadge } from "@/features/expense/components/expense-status-badge";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCalendarOutline } from "react-icons/io5";

export default async function ExpensePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const auth = await validateAuth();

  if (!auth) {
    redirect("/sign-in");
  }

  const expense = await getExpense(id, auth.spaceId);

  if (!expense) {
    redirect("/expense/list");
  }

  const t = await getTranslations("expense");

  const formattedDate = new Date(expense.date).toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <div className="max-w-3xl w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton />
            <CustomTitle
              tag="h1"
              title="Expense details"
              className="text-2xl font-bold"
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="card-container overflow-hidden bg-card">
          {/* Top Section: Amount & Title */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-primary">
                <CategoryIcon
                  iconName={expense.category?.icon}
                  color={expense.category?.color}
                  size={32}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold txt">{expense.name}</h2>
                <div className="flex items-center gap-2 text-sm txt-muted mt-1">
                  <IoCalendarOutline />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:flex-col md:items-end">
              <FormattedAmount
                amount={expense.amount}
                currency={expense.currency}
                locale={locale}
                className="text-2xl md:text-3xl font-bold txt"
              />
              <ExpenseStatusBadge expense={expense} />
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="flex gap-10 items-center">
            {/* Details Grid */}
            <div className="flex flex-col ">
              <span className="text-sm font-medium txt-muted">
                {t("category")}
              </span>
              <p className="txt font-semibold">{expense.category?.name}</p>
            </div>

            {/* Tags */}
            {expense.tags && expense.tags.length > 0 && (
              <div className="flex gap-6 items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-medium txt-muted">
                    {t("tags")}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {expense.tags.map(tag => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description/Note */}
          {expense.description && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
              <span className="text-sm font-medium txt-muted block mb-1">
                {t("note")}
              </span>
              <p className="txt text-sm leading-relaxed">
                {expense.description}
              </p>
            </div>
          )}

          <Separator className="my-6" />

          <div className="flex justify-between">
            <div className="space-y-1">
              <span className="text-sm font-medium txt-muted">
                {t("responsible")}
              </span>
              <div className="flex items-center gap-2">
                <p className="txt font-semibold">{expense.responsible?.name}</p>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium txt-muted">
                {t("createdBy")}
              </span>
              <p className="txt font-semibold">{expense.createdBy?.name}</p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Actions */}
          <div className="flex flex-row w-full items-center justify-end gap-3">
            <Link href={`/expense/edit/${expense.id}`} className="w-auto">
              <Button className="btn w-auto">{t("edit")}</Button>
            </Link>
            <div className="w-auto">
              <DeleteExpenseButton
                expenseId={expense.id}
                spaceId={expense.space_id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
