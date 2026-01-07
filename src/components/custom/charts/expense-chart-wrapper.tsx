"use client";

import * as React from "react";
import { ChartDataItem } from "./pie-chart";
import type { SpaceMemberDTO } from "@/features/space/actions/get-space-members.action";
import { ChartFilters } from "./chart-filters";
import {
  ChartConfig,
  ChartContainer as RechartsContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Label, Pie, PieChart } from "recharts";
import { Loading } from "../loading/loading";

type ExpenseChartWrapperProps = {
  initialData: ChartDataItem[];
  spaceId: string;
  spaceMembers: SpaceMemberDTO[];
  currencies: string[];
  onFilterChange: (filters: {
    days: number;
    responsibleId: string;
    currency: string;
    status: string;
  }) => Promise<ChartDataItem[]>;
};

export function ExpenseChartWrapper(props: ExpenseChartWrapperProps) {
  const id = "pie-interactive";
  const [chartData, setChartData] = React.useState(props.initialData);

  const [filters, setFilters] = React.useState({
    days: 30,
    responsibleId: "all",
    currency: props.currencies[0] || "USD",
    status: "all",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await props.onFilterChange(filters);
        setChartData(data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      amount: {
        label: "Amount",
      },
    };

    chartData.forEach(item => {
      config[item.category] = {
        label: item.category,
        color: item.fill,
      };
    });

    return config;
  }, [chartData]);

  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);

  // Build the title section with filters
  const titleSection = (
    <div>
      <h4 className="text-lg txt mb-2">Expenses by Category</h4>
      <ChartFilters
        filters={filters}
        onFiltersChange={setFilters}
        spaceMembers={props.spaceMembers}
        currencies={props.currencies}
      />
    </div>
  );

  // Build the chart
  const chart = (
    <>
      <ChartStyle id={id} config={chartConfig} />
      {isLoading ? (
        <div className="h-[300px] rounded flex items-center justify-center txt-muted">
          <Loading />
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-[300px] rounded flex items-center justify-center txt-muted">
          No expenses found
        </div>
      ) : (
        <RechartsContainer
          id={id}
          config={chartConfig}
          className="h-[300px] w-full max-w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={2}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const totalCount = chartData.reduce(
                      (sum, item) => sum + item.count,
                      0
                    );

                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          ${totalAmount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          {totalCount} expenses
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </RechartsContainer>
      )}
    </>
  );

  // Build category list
  const categoryList = (
    <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {chartData.map(item => {
        const percentage = ((item.amount / totalAmount) * 100).toFixed(1);

        return (
          <div
            key={item.categoryId}
            className="flex items-center justify-between p-2 rounded"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: item.fill }}
              />
              <div>
                <p className="text-sm txt">{item.category}</p>
                <p className="text-xs txt-muted">
                  {item.count} {item.count === 1 ? "expense" : "expenses"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium txt">
                ${item.amount.toLocaleString()}
              </p>
              <p className="text-xs txt-muted">{percentage}%</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="sm:grid sm:grid-cols-3 gap-2 card-container my-4 overflow-hidden">
      {/* title and filters */}
      <div className="min-w-0">{titleSection}</div>

      {/* total */}
      <h4 className="text-xl txt-muted font-semibold">
        ${totalAmount.toLocaleString()}
      </h4>

      {/* chart */}
      <div className="sm:col-span-2 min-w-0 overflow-hidden">{chart}</div>

      {/* category list */}
      {categoryList}
    </div>
  );
}
