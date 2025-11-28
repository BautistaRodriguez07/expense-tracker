import { getTranslations } from "next-intl/server";
import { IoChevronForwardOutline } from "react-icons/io5";
import { CategoryIcon } from "@/components";
import { SerializedExpense } from "../utils/serialize-expense";
import { formatCurrency } from "../utils/currency";
import { Badge } from "@/components/ui/badge";

interface ExpenseSummaryProps {
  expense: SerializedExpense;
}

export const ExpenseSummary = async ({ expense }: ExpenseSummaryProps) => {
  const t = await getTranslations("historyItem");
  const t2 = await getTranslations("expense");
  console.log(expense);

  return (
    <div className="flex justify-between items-center card-container mb-2">
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
        <div className="flex flex-col items-end">
          <span className="font-medium txt">{formatCurrency(expense.amount, t2('defaultLocale'), expense.currency)}</span>
          <span className="txt-muted text-sm">{new Date(expense.created_at).toDateString()}</span>
        </div>
        <Badge variant="outline">{expense.status}</Badge>  
        </div>
        <IoChevronForwardOutline
          size={18}
          className="text-gray-400 dark:hover:text-white hover:text-black hover:scale-150 transition-all"
        />
      </div>
  );
};

export default ExpenseSummary;
