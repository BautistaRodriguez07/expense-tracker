"use client";

import { CustomTitle } from "@/components";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

export const HomeTitle = () => {
  const t = useTranslations("home");
  const { user } = useUser();
  return (
    <div>
      <CustomTitle
        title={`${t("title")}, ${user?.firstName ?? "User"}`}
        tag="h1"
        className="txt"
      />
      <CustomTitle
        title={`${t("subTitle")}, (name)`}
        tag="h2"
        className="text-xl txt-muted"
      />
    </div>
  );
};
