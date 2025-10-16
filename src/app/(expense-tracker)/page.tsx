import { ChartPieInteractive, CustomTitle } from "@/components";
import Link from "next/link";
import {
  IoChevronForwardOutline,
  IoFastFood,
  IoPersonCircleOutline,
} from "react-icons/io5";

export default function HomePage() {
  return (
    <div>
      <CustomTitle title="Hola, David" subTitle='Grupo "Familia' />

      <div className="py-5 flex items-center justify-center">
        Gastos del mes $1.500.000
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <ChartPieInteractive />
        </div>
        <div>
          {/* user */}
          <div className="flex gap-2 items-center justify-start bg-purple-100 p-1 rounded-xl mb-2 max-w-sm">
            <div className="size-10">
              <IoPersonCircleOutline className="size-10 bg-white rounded-full" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold">Gonzalo</span>
              {/* <span className="text-purple-700 font-medium text-sm">
                $100.000
              </span> */}
            </div>
          </div>

          {/* user 2 */}
          <div className="flex gap-2 items-center justify-start border p-1 rounded-xl mb-2 max-w-sm">
            <div className="size-10">
              <IoPersonCircleOutline className="size-10" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold">Gabriela</span>
              {/* <span className="font-medium text-sm">$100.000</span> */}
            </div>
          </div>
        </div>
      </div>

      {/* <div>pagos pendientes</div> */}

      <div className="space-y-3 mt-10">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Últimos gastos</span>
          <Link href={"/"} className="text-purple-700 font-medium">
            Ver más
          </Link>
        </div>

        <ul className="space-y-2">
          {/* 1 */}
          <li className="flex justify-between items-center bg-white p-3 rounded-xl shadow">
            <div className="flex items-center gap-3">
              <IoFastFood
                size={20}
                className="bg-purple-200 p-1 rounded-full text-purple-700"
              />
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
              <IoChevronForwardOutline size={18} className="text-gray-400" />
            </div>
          </li>

          {/* 2 */}
          <li className="flex justify-between items-center bg-white p-3 rounded-xl border-2 border-purple-700">
            <div className="flex items-center gap-3">
              <IoFastFood
                size={20}
                className="bg-purple-200 p-1 rounded-full text-purple-700"
              />
              <div className="flex flex-col">
                <span className="font-medium text-purple-700">Comida</span>
                <span className="text-sm">usuario</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="font-medium text-purple-700">$25.06</span>
                <span className=" text-sm text-purple-700">Today</span>
              </div>
              <IoChevronForwardOutline size={18} className="text-gray-400" />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
