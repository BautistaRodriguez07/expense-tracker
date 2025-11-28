export const ExpenseSummary = () => {
  return (
    <div className="flex items-center justify-between">
      <CustomTitle
        title={t("latestExpenses")}
        tag="h3"
        className="text-lg py-2 txt-muted"
      />
      <Link href={"/"} className="link underline font-medium">
        {t("viewMore")}
      </Link>
    </div>
  );
};

export default ExpenseSummary;
