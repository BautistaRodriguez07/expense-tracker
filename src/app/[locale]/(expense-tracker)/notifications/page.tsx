import { validateAuth } from "@/features/auth/services/auth.service";
import { redirect } from "next/navigation";
import { NotificationsList } from "@/features/notifications/components/notifications-list";
import { CustomTitle, Loading } from "@/components";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function NotificationsPage({ searchParams }: Props) {
  const t = await getTranslations("invitations");
  const auth = await validateAuth();

  if (!auth) {
    redirect("/sign-in");
  }

  // Get current page from searchParams
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  return (
    <div className=" flex flex-col items-center justify-top min-h-screen">
      <div className="max-w-3xl w-full">
        <CustomTitle
          title={t("notifications")}
          tag="h1"
          className="txt text-2xl font-bold pb-4"
        />

        {/* Notifications List */}
        <Suspense
          key={currentPage}
          fallback={
            <div className="flex items-center justify-center h-[300px]">
              <Loading />
            </div>
          }
        >
          <NotificationsList initialPage={currentPage} />
        </Suspense>
      </div>
    </div>
  );
}
