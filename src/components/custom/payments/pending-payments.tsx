import { CustomTitle } from "@/components/custom/custom-title/custom-title";
import { PendingPayment } from "@/components/custom/payments/pending-payment";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { validateAuth } from "@/features/auth/services/auth.service";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { SerializedExpense } from "@/features/expense/utils/serialize-expense";

export const PendingPayments = async () => {
  const t = await getTranslations("pendingPayments");
  const user = await currentUser();
  const auth = await validateAuth();

  if (!auth) {
    redirect("/sign-in");
  }

  const pendingPayments = await prisma.expense.findMany({
    where: {
      status: "pending",
      responsible_id: auth.dbUser.id,
      space_id: auth.spaceId,
      deleted_at: null,
    },
    include: {
      responsible: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  if (pendingPayments.length === 0) {
    return (
      <div className="txt-muted text-center py-4">
        {t("noPayments") || "No pending payments"}
      </div>
    );
  }

  return (
    <>
      <CustomTitle
        title={t("title")}
        tag="h3"
        className="text-lg py-2 txt-muted"
      />

      <div className="flex overflow-x-auto max-w-[calc(100vw-2rem)]">
        {pendingPayments.map((pendingPayment: SerializedExpense) => (
          <PendingPayment
            key={pendingPayment.id}
            expenseName={pendingPayment.name}
            id={pendingPayment.id}
            userImg={user?.imageUrl || ""}
            userName={pendingPayment.responsible?.name || "Unknown"}
            categoryName={pendingPayment.category?.name || "Unknown"}
            expirationDate={new Date(pendingPayment.date).toLocaleDateString()}
          />
        ))}
      </div>
    </>
  );
};
