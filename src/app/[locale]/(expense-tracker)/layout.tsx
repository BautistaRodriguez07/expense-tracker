import { Loading } from "@/components";
import { Footer } from "@/components/custom/footer/footer";
import { Sidebar } from "@/components/custom/sidebar/sidebar";
import { TopMenu } from "@/components/custom/top-menu/top-menu";
import { validateAuth } from "@/features/auth/services/auth.service";
import { checkAndMarkOverdueExpenses } from "@/features/expense/services/check-overdue-expenses.service";
import { SpaceSelector } from "@/features/space/components/space-selector";
import { getSpace } from "@/features/space/actions/get-space.action";
import { translateSpace } from "@/lib/translate-space";
import { getMessages } from "next-intl/server";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default async function ExpenseTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check for overdue expenses on each page load
  const auth = await validateAuth();

  if (!auth) {
    redirect("/sign-in");
  }

  if (auth.spaceId) {
    // Run in the background without blocking the UI
    checkAndMarkOverdueExpenses(auth.spaceId).catch((error) => {
      console.error("Error checking overdue expenses:", error);
    });
  }

  // Get current space name
  const currentSpace = await getSpace(auth.spaceId);
  const messages = await getMessages();
  const currentSpaceName = currentSpace?.name
    ? translateSpace(currentSpace.name, messages)
    : "Space";

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden max-w-full">
      <TopMenu
        currentSpaceName={currentSpaceName}
        spaceSelector={
          <Suspense fallback={<Loading />}>
            <SpaceSelector />
          </Suspense>
        }
      />
      <div className="flex flex-1 overflow-x-hidden">
        <Sidebar />
        <main className="flex-1 p-5 overflow-x-hidden max-w-full">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
