import { Footer, Sidebar, TopMenu } from "@/components";

export default function ExpenseTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopMenu />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-5">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
