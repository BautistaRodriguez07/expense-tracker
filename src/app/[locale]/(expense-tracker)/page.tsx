import { ChartContainer, HistoryList, PendingPayments } from "@/components";
import { setRequestLocale } from "next-intl/server";
import { HomeTitle } from "../../../features/user/components/home-title";
import { Users } from "@/components/custom/user/users-list";

export default function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  setRequestLocale(locale);

  return (
    <div className=" flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-3xl w-full">
        <HomeTitle />

        {/* Chart information */}
        <ChartContainer>
          <Users />
        </ChartContainer>

        {/* Pending payments */}
        <PendingPayments />

        {/* history */}
        <HistoryList />
      </div>
    </div>
  );
}
