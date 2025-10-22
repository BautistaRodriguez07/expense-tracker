import { IoFastFood, IoChevronForwardOutline } from "react-icons/io5";

export const HistoryItem = () => {
  return (
    <div className="flex justify-between items-center card-container mb-2">
      <div className="flex items-center gap-3">
        <IoFastFood size={40} className=" p-1 rounded-full" />
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">Comida</span>
          <span className="text-gray-500 text-sm">usuario</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="font-medium text-gray-800">$25.06</span>
          <span className="text-gray-500 text-sm">Today</span>
        </div>
        <IoChevronForwardOutline
          size={18}
          className="text-gray-400 hover:text-black hover:scale-150 transition-all"
        />
      </div>
    </div>
  );
};
