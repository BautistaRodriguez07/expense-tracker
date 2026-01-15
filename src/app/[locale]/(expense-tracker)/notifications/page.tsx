import { CustomTitle, NotificationsList } from "@/components";

export default function NotificationsPage() {
  return (
    <div className=" flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-3xl w-full">
        <CustomTitle title="Notifications" tag="h1" />
        <NotificationsList />
      </div>
    </div>
  );
}
