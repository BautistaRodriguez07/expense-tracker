"use client";

import * as React from "react";
import { Cell, Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartDataItem } from "./pie-chart";
import { getExpensesChartDataWrapper } from "@/features/expense/actions/get-expenses-chart-data-wrapper.action";
import { Loading } from "../loading/loading";

type ExpenseChartProps = {
  spaceId: string;
  initialData: ChartDataItem[];
  filters: {
    days: number;
    responsibleId: string;
    currency: string;
    status: string;
  };
  onTotalChange?: (total: number) => void;
};

export function ExpenseChart(props: ExpenseChartProps) {
  const id = "expense-chart";
  const [chartData, setChartData] = React.useState(props.initialData);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getExpensesChartDataWrapper(
          props.spaceId,
          props.filters
        );
        setChartData(data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.filters.days,
    props.filters.responsibleId,
    props.filters.currency,
    props.filters.status,
    props.spaceId,
  ]);

  // Notify parent of total changes
  const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);
  const { onTotalChange } = props;
  React.useEffect(() => {
    if (onTotalChange) {
      onTotalChange(totalAmount);
    }
  }, [totalAmount, onTotalChange]);

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

  return (
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
        <ChartContainer
          id={id}
          config={chartConfig}
          className="h-[300px] w-full"
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
        </ChartContainer>
      )}
    </>
  );
}
