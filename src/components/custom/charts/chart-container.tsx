import { PropsWithChildren } from "react";
import { ChartContainerClient } from "./chart-container-client";
import { validateAuth } from "@/features/auth/services/auth.service";
import { getExpensesChartData } from "@/features/expense/actions/get-expenses-chart-data.action";
import { getSpaceMembers } from "@/features/space/actions/get-space-members.action";
import { redirect } from "next/navigation";

export const ChartContainer = async ({ children }: PropsWithChildren) => {
  const auth = await validateAuth();
  if (!auth) {
    redirect("/sign-in");
  }

  const spaceMembers = await getSpaceMembers(auth.spaceId);
  const currencies = ["USD", "EUR", "ARS"];

  const chartData = await getExpensesChartData(auth.spaceId, {
    days: 30,
    responsibleId: "all",
    currency: currencies[0],
    status: "all",
  });

  return (
    <ChartContainerClient
      initialData={chartData}
      spaceId={auth.spaceId}
      spaceMembers={spaceMembers}
      currencies={currencies}
    >
      {children}
    </ChartContainerClient>
  );
};
