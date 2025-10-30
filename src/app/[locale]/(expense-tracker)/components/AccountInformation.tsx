"use client";

import { UserAvatar } from "@/components";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

export const AccountInformation = () => {
  const t = useTranslations("settings");
  const { user } = useUser();
  return (
    <div className="card-container">
      {/* image */}
      <div className="flex items-center justify-between text-lg">
        <p className="txt-muted">{t("image")}</p>
        <UserAvatar
          userName={user?.fullName ?? "User"}
          imageUrl={user?.imageUrl}
        />
      </div>
      <Separator className="my-5" />
      {/* name */}
      <div className="flex items-center justify-between text-lg">
        <p className="txt-muted">{t("name")}</p>
        <p className="font-semibold">{user?.fullName}</p>
      </div>
      {/* email */}
      <Separator className="my-5" />
      <div className="flex items-center justify-between text-lg">
        <p className="txt-muted">{t("email")}</p>
        <p className="font-semibold">{user?.emailAddresses[0]?.emailAddress}</p>
      </div>
    </div>
  );
};
