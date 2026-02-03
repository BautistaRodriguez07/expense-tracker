import { ChartContainer } from "@/components/custom/charts/chart-container";
import { PendingPayments } from "@/components/custom/payments/pending-payments";
import { setRequestLocale } from "next-intl/server";
import { HomeTitle } from "@/features/user/components/home-title";
import { Users } from "@/components/custom/user/users-list";
import { validateAuth } from "@/features/auth/services/auth.service";
import { redirect } from "next/navigation";
import { LatestList } from "@/components/custom/history/lastest-list";
import { ExpenseButton } from "@/features/expense/components/add-expense-button";
import { Suspense } from "react";
import { Loading } from "@/components";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  // validate authentication
  const auth = await validateAuth();

  if (!auth) {
    redirect("/sign-in");
  }

  return (
    <div className=" flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-3xl w-full">
        <HomeTitle />

        {/* Chart information */}
        <Suspense fallback={<Loading />}>
          <ChartContainer>
            <Users />
          </ChartContainer>
        </Suspense>

        {/* Pending payments */}
        <Suspense fallback={<Loading />}>
          <PendingPayments />
        </Suspense>

        {/* history */}
        <Suspense fallback={<Loading />}>
          <LatestList spaceId={auth.spaceId} />
        </Suspense>

        <ExpenseButton />
      </div>
    </div>
  );
}
