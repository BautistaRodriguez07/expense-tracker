"use server";

import { getExpensesChartData } from "./get-expenses-chart-data.action";

export async function getExpensesChartDataWrapper(
  spaceId: string,
  filters: {
    days: number;
    responsibleId: string;
    currency: string;
    status: string;
  }
) {
  return await getExpensesChartData(spaceId, filters);
}
