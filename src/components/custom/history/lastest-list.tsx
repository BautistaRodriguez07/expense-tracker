import { CustomTitle } from "@/components/custom/custom-title/custom-title";
import { getExpenses } from "@/features/expense/actions/get-expenses.action";
import ExpenseSummary from "@/features/expense/components/expense-summary";
import { SerializedExpense } from "@/features/expense/utils/serialize-expense";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

interface LatestListProps {
  spaceId: string;
}

export const LatestList = async (props: LatestListProps) => {
  const { spaceId } = props;
  const t = await getTranslations("historyList");
  const expenses = await getExpenses(spaceId);

  return (
    <>
      <div className="flex items-center justify-between">
        <CustomTitle
          title={t("latestExpenses")}
          tag="h3"
          className="text-lg py-2 txt-muted"
        />
        <Link href={"/expense/list"} className="link underline font-medium">
          {t("viewMore")}
        </Link>
      </div>

      {expenses.length === 0 && (
        <p className="text-center txt-muted py-4">No expenses found.</p>
      )}

      {expenses.slice(0, 4).map(expense => (
        <ExpenseSummary
          key={expense.id}
          expense={expense as SerializedExpense}
        />
      ))}
    </>
  );
};
