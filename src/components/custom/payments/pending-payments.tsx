import { CustomTitle, PendingPayment } from "@/components";
import { useTranslations } from "next-intl";

export const PendingPayments = () => {
  const t = useTranslations("pendingPayments");
  return (
    <>
      <CustomTitle
        title={t("title")}
        tag="h3"
        className="text-lg py-2 txt-muted"
      />

      <PendingPayment />
    </>
  );
};
