import { getLocale } from "next-intl/server";
import { IoChevronForwardOutline } from "react-icons/io5";
import { CategoryIcon } from "@/components/custom/category-icon/category-icon";
import { FormattedAmount } from "@/components/custom/currency/formatted-amount";
import { SerializedExpense } from "../utils/serialize-expense";
import { Link } from "@/i18n/navigation";
import { ExpenseStatusBadge } from "./expense-status-badge";

interface ExpenseSummaryProps {
  expense: SerializedExpense;
}

export const ExpenseSummary = async ({ expense }: ExpenseSummaryProps) => {
  const locale = await getLocale();

  const formattedDate = new Date(expense.date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/expense/${expense.id}`}
      className="flex justify-between items-center card-container mb-2 hover:opacity-80 transition-opacity cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <CategoryIcon
          iconName={expense.category?.icon}
          color={expense.category?.color}
          size={40}
        />
        <div className="flex flex-col">
          <span className="font-medium txt">{expense.name}</span>
          <span className="txt-muted text-sm">{expense.responsible?.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-2">
            <FormattedAmount
              amount={expense.amount}
              currency={expense.currency}
              locale={locale}
              className="font-medium text-xl sm:text-2xl"
            />
            <div className="flex items-center justify-end gap-2">
              {/* date */}
              <span className="txt-muted text-sm hidden sm:block">
                {formattedDate}
              </span>

              <ExpenseStatusBadge expense={expense} />
            </div>
          </div>
        </div>
        <IoChevronForwardOutline
          size={18}
          className="text-black dark:text-white"
        />
      </div>
    </Link>
  );
};

export default ExpenseSummary;
