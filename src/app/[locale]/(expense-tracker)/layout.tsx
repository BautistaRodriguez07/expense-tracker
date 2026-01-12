import { Footer } from "@/components/custom/footer/footer";
import { Sidebar } from "@/components/custom/sidebar/sidebar";
import { TopMenu } from "@/components/custom/top-menu/top-menu";
import { validateAuth } from "@/features/auth/services/auth.service";
import { checkAndMarkOverdueExpenses } from "@/features/expense/services/check-overdue-expenses.service";

export default async function ExpenseTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check for overdue expenses on each page load
  const auth = await validateAuth();

  if (auth?.spaceId) {
    // Run in the background without blocking the UI
    checkAndMarkOverdueExpenses(auth.spaceId).catch(error => {
      console.error("Error checking overdue expenses:", error);
    });
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden max-w-full">
      <TopMenu />
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
