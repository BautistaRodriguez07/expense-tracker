import { CustomTitle } from "@/components";
import { validateAuth } from "@/features/auth/services/auth.service";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getSpace } from "@/features/space/actions/get-space.action";

export const HomeTitle = async () => {
  const t = await getTranslations("home");
  const auth = await validateAuth();
  if (!auth) redirect("/sign-in");

  const space = await getSpace(auth.spaceId);

  return (
    <div>
      <CustomTitle
        title={`${t("title")}, ${auth.clerkUser.firstName ?? "User"}`}
        tag="h1"
        className="txt"
      />
      <CustomTitle
        title={`${t("subTitle")}, ${space?.name ?? "Unknown Space"}`}
        tag="h2"
        className="text-xl txt-muted"
      />
    </div>
  );
};
