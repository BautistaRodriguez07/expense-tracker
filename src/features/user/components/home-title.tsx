import { CustomTitle } from "@/components/custom/custom-title/custom-title";
import { validateAuth } from "@/features/auth/services/auth.service";
import { redirect } from "next/navigation";
import { getTranslations, getMessages } from "next-intl/server";
import { getSpace } from "@/features/space/actions/get-space.action";
import { translateSpace } from "@/lib/translate-space";

export const HomeTitle = async () => {
  const t = await getTranslations("home");
  const messages = await getMessages();
  const auth = await validateAuth();
  if (!auth) redirect("/sign-in");

  const space = await getSpace(auth.spaceId);
  const translatedSpaceName = space?.name
    ? translateSpace(space.name, messages)
    : "Unknown Space";

  return (
    <div>
      <CustomTitle
        title={`${t("title")}, ${auth.clerkUser.firstName ?? "User"}`}
        tag="h1"
        className="txt"
      />
      <CustomTitle
        title={`${t("subTitle")}, ${translatedSpaceName}`}
        tag="h2"
        className="text-xl txt-muted"
      />
    </div>
  );
};
