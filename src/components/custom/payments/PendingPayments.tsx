import { CustomTitle, PendingPayment } from "@/components";

export const PendingPayments = () => {
  return (
    <>
      <CustomTitle
        title="Pagos pendientes"
        tag="h3"
        className="text-lg py-2 txt-muted"
      />

      <PendingPayment />
    </>
  );
};
