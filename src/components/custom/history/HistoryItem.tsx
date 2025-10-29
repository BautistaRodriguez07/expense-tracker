import { useTranslations } from "next-intl";
import { IoFastFood, IoChevronForwardOutline } from "react-icons/io5";

export const HistoryItem = () => {
  const t = useTranslations("historyItem");
  return (
    <div className="flex justify-between items-center card-container mb-2">
      <div className="flex items-center gap-3">
        <IoFastFood size={40} className=" p-1 rounded-full" />
        <div className="flex flex-col">
          <span className="font-medium txt">{t("food")}</span>
          <span className="txt-muted text-sm">usuario</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="font-medium txt">$25.06</span>
          <span className="txt-muted text-sm">Today</span>
        </div>
        <IoChevronForwardOutline
          size={18}
          className="text-gray-400 dark:hover:text-white hover:text-black hover:scale-150 transition-all"
        />
      </div>
    </div>
  );
};
