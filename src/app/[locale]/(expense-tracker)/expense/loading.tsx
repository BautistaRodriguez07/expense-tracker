import { Loading } from "@/components";

export default function ExpenseLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loading />
    </div>
  );
}
