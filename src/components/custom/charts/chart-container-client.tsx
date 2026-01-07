"use client";

import * as React from "react";
import { ChartFilters } from "./chart-filters";
import { ExpenseChart } from "./expense-chart";
import type { ChartDataItem } from "./pie-chart";
import type { SpaceMemberDTO } from "@/features/space/actions/get-space-members.action";
import { useTranslations } from "next-intl";

type ChartContainerClientProps = {
  initialData: ChartDataItem[];
  spaceId: string;
  spaceMembers: SpaceMemberDTO[];
  currencies: string[];
  children?: React.ReactNode;
};

export function ChartContainerClient(props: ChartContainerClientProps) {
  const t = useTranslations("chartContainer");
  const [filters, setFilters] = React.useState({
    days: 30,
    responsibleId: "all",
    currency: props.currencies[0] || "USD",
    status: "all",
  });
  const [currentTotal, setCurrentTotal] = React.useState(
    props.initialData.reduce((sum, item) => sum + item.amount, 0)
  );

  return (
    <div className="sm:grid sm:grid-cols-3 gap-2 card-container my-4">
      {/* Title and Filters */}
      <div>
        <h4 className="text-lg txt font-bold">
          {t("monthlyExpenses")} ({filters.currency})
        </h4>
        <h4 className="text-xl txt-muted font-semibold">
          {filters.currency} {currentTotal.toLocaleString()}
        </h4>
        <div className="mt-2">
          <ChartFilters
            spaceMembers={props.spaceMembers}
            currencies={props.currencies}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </div>

      {/* Chart (span-2) */}
      <div className="sm:col-span-2">
        <ExpenseChart
          spaceId={props.spaceId}
          initialData={props.initialData}
          filters={filters}
          onTotalChange={setCurrentTotal}
        />
      </div>

      {/* Users */}
      {props.children}
    </div>
  );
}

