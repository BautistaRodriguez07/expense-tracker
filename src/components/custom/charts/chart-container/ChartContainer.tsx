import { CustomTitle, Users } from "@/components";

export const ChartContainer = () => {
  return (
    <div className="sm:grid sm:grid-cols-3 gap-2 card-container my-4">
      {/* title */}
      <CustomTitle
        title="Gastos del mes"
        tag="h4"
        className="text-lg text-muted-foreground"
      />
      <CustomTitle
        title="1.500.000"
        tag="h4"
        className="text-xl text-gray-700"
      />

      {/* chart */}
      <div className=" sm:col-span-2">
        {/* <ChartPieInteractive /> */}
        <div className="h-[300px]  rounded flex items-center justify-center text-3xl">
          Pie Chart
        </div>
      </div>

      {/* users */}
      <Users />
    </div>
  );
};
