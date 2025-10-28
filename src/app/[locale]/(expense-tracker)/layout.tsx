import { Footer, Sidebar, TopMenu } from "@/components";

export default function ExpenseTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <TopMenu />
      <Sidebar />
      <div className="p-5">{children}</div>
      <Footer />
    </div>
  );
}
