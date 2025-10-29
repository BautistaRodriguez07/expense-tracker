import { UserAvatar } from "@/components";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export const PendingPayment = () => {
  const t = useTranslations("pendingPayment");
  return (
    <div className="overflow-auto flex gap-2">
      {/* pago pendiente 1 */}
      <div className="card-container p-3 mb-5 mx-1 min-w-80">
        <UserAvatar userName="Gonzalo" title="Gonzalo" legend="Comida evento" />
        <div className="py-2">
          <span className="txt-muted ml-2">{t("expirationDate")} </span>
          <span className="font-semibold text-red-500 dark:text-red-400">
            10/04/2025
          </span>
        </div>

        <div className="flex justify-between p-3">
          <Button className="btn-danger">{t("cancel")}</Button>
          <Button className="btn-success">{t("pay")}</Button>
        </div>
      </div>
    </div>
  );
};
