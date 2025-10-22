import {
  ChartContainer,
  CustomTitle,
  HistoryList,
  PendingPayments,
} from "@/components";

export default function HomePage() {
  return (
    <div>
      <CustomTitle title="Hola, David" tag="h1" className="txt" />
      <CustomTitle
        title="Grupo, Familia"
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
