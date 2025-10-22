import { UserAvatar } from "@/components";
import { Button } from "@/components/ui/button";

export const PendingPayment = () => {
  return (
    <div className="overflow-auto flex gap-2">
      {/* pago pendiente 1 */}
      <div className="card-container p-3 mb-5 mx-1 min-w-80">
        <UserAvatar userName="Gonzalo" title="Gonzalo" legend="Comida evento" />
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
        <UserAvatar userName="Gonzalo" title="Gonzalo" legend="Comida evento" />
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
  );
};
