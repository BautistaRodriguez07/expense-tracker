import {
  ChartContainer,
  CustomTitle,
  HistoryList,
  PendingPayments,
} from "@/components";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  setRequestLocale(locale);
  const t = useTranslations("home");
  return (
    <div>
      <CustomTitle title={`${t("title")}, (name)`} tag="h1" className="txt" />
      <CustomTitle
        title={`${t("subTitle")}, (name)`}
        tag="h2"
        className="text-xl txt-muted"
      />

      {/* Chart information */}
      <ChartContainer />

      {/* Pending payments */}
      <PendingPayments />

      {/* history */}
      <HistoryList />
    </div>
  );
}
