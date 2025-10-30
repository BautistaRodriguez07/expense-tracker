import { ToggleTheme } from "@/components";
import { currentUser } from "@clerk/nextjs/server";

export default async function SettingsPage() {
  const user = await currentUser();

  return (
    <div>
      <ToggleTheme />
      welcome {user?.firstName}
    </div>
  );
}
