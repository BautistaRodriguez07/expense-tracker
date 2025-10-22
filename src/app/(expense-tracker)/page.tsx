import { ChartPieInteractive, CustomTitle } from "@/components";
import { UserAvatar } from "@/components/custom/user-avatar/UserAvatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoChevronForwardOutline, IoFastFood } from "react-icons/io5";

export default function HomePage() {
  return (
    <div>
      <CustomTitle title="Hola, David" subTitle='Grupo "Familia' />

      <div className="sm:grid sm:grid-cols-3 gap-2 card-container my-4">
        <div className="absolute text-start">
          <p className="text-sm font-medium">Gastos del mes</p>
          <p className="text-2xl font-bold text-cyan-700">$1.500.000</p>
        </div>

        <div className=" sm:col-span-2">
          {/* <ChartPieInteractive /> */}
          <div className="h-[300px]  rounded flex items-center justify-center text-3xl">
            Pie Chart
          </div>
        </div>
        <div className=" overflow-auto sm:p-0 py-6">
          {/* users  */}

          <div className="flex gap-2 sm:block flex-nowrap">
            {/* user */}
            <div className="flex gap-2 items-center justify-start btn btn-info p-1 mb-2">
              <UserAvatar userName="Gonzalo" title="Gonzalo" />
            </div>
            {/* user 2 */}
            <div className="flex gap-2 items-center justify-start p-1 btn mb-2">
              <UserAvatar userName="Gabriela" title="Gabriela" />
            </div>
          </div>
        </div>
      </div>

      <div className="font-semibold pb-3 text-lg">pagos pendientes</div>

      <div className="overflow-auto flex gap-2">
        {/* pago pendiente 1 */}
        <div className="card-container p-3 mb-5 mx-2 min-w-80">
          <UserAvatar
            userName="Gonzalo"
            title="Gonzalo"
            legend="Comida evento"
          />
          <div className="py-2">
            <span className="text-gray-700 ml-2">Vence: </span>
            <span className="font-semibold text-red-500">10/04/2025</span>
          </div>

          <div className="flex justify-between p-3">
            <Button className="btn-danger">descartar</Button>
            <Button className="btn-success">Pagar</Button>
          </div>
        </div>

        {/* pago pendiente 2 */}
        <div className="card-container mb-5 mx-2 p-3 min-w-80">
          <UserAvatar
            userName="Gonzalo"
            title="Gonzalo"
            legend="Comida evento"
          />
          <div className="py-2">
            <span className="ml-2 text-gray-700">Vence: </span>
            <span className="font-semibold text-red-500">10/04/2025</span>
          </div>

          <div className="flex justify-between p-3">
            <Button className="btn-danger">descartar</Button>
            <Button className="btn-success">Pagar</Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg">Últimos gastos</span>
          <Link href={"/"} className="link underline font-medium">
            Ver más
          </Link>
        </div>

        <ul className="space-y-2">
          {/* 1 */}
          <li className="flex justify-between items-center card-container">
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
              <IoChevronForwardOutline size={18} className="text-gray-400" />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
