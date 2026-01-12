// src/app/[locale]/(expense-tracker)/charts/page.tsx
import { ChartContainer } from "@/components/custom/charts/chart-container";
import { Users } from "@/components/custom/user/users-list";

export default async function ChartsPage() {
  return (
    <>
      <ChartContainer>
        <Users />
      </ChartContainer>
    </>
  );
}
