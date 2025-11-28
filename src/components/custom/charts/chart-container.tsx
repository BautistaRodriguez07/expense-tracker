import { CustomTitle } from "@/components";
import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";

export const ChartContainer = ({ children }: PropsWithChildren) => {
  const t = useTranslations("chartContainer");

  return (
    <div className="sm:grid sm:grid-cols-3 gap-2 card-container my-4">
      {/* title */}
      <CustomTitle
        title={t("monthlyExpenses")}
        tag="h4"
        className="text-lg txt"
      />
      <CustomTitle title="1.500.000" tag="h4" className="text-xl txt-muted" />

      {/* chart */}
      <div className=" sm:col-span-2">
        {/* <ChartPieInteractive /> */}
        <div className="h-[300px]  rounded flex items-center justify-center txt text-3xl">
          Pie Chart
        </div>
      </div>

      {/* users */}
      {children}
    </div>
  );
};
