import { CustomTitle, HistoryItem } from "@/components";
import Link from "next/link";

export const HistoryList = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <CustomTitle
          title="Últimos gastos"
          tag="h3"
          className="text-lg py-2 text-gray-700"
        />
        <Link href={"/"} className="link underline font-medium">
          Ver más
        </Link>
      </div>

      <HistoryItem />
    </>
  );
};
