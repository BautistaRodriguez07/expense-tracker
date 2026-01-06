import { CustomTitle, PendingPayment } from "@/components";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { validateAuth } from "@/features/auth/services/auth.service";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export const PendingPayments = async () => {
  const t = await getTranslations("pendingPayments");
  const user = await currentUser();
  // Obtener usuario actual
  const auth = await validateAuth();

  if (!auth) {
    redirect("/sign-in");
  }

  // Filtrar gastos pendientes del usuario actual
  const pendingPayments = await prisma.expense.findMany({
    where: {
      status: "pending",
      responsible_id: auth.dbUser.id, // Solo gastos donde el usuario es responsable
      space_id: auth.spaceId, // Solo del espacio actual
      deleted_at: null, // Excluir eliminados
    },
    include: {
      responsible: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        // Agregar categoria para mostrar el nombre
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
        },
      },
    },
    orderBy: {
      date: "asc", // Ordenar por fecha más cercana primero
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

      <div className="flex overflow-x-auto max-w-[100vw]">
        {pendingPayments.map(pendingPayment => (
          <PendingPayment
            key={pendingPayment.id}
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
