import { Footer } from "@/components/custom/footer/footer";
import { Sidebar } from "@/components/custom/sidebar/sidebar";
import { TopMenu } from "@/components/custom/top-menu/top-menu";

export default function ExpenseTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
