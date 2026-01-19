import { getUserSpaces } from "../actions/get-user-spaces.action";
import { getSpace } from "../actions/get-space.action";
import { validateAuth } from "@/features/auth/services/auth.service";
import { redirect } from "next/navigation";
import { DeleteSpaceDialog } from "./delete-space-dialog";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { IoAddOutline } from "react-icons/io5";

type SpaceWithDetails = Awaited<ReturnType<typeof getUserSpaces>>[number];

export const SpaceList = async () => {
  const t = await getTranslations("spaces");
  const auth = await validateAuth();
  if (!auth) redirect("/sign-in");

  const spaces = await getUserSpaces();
  const currentSpace = await getSpace(auth.spaceId);

  return (
    <div className="grid gap-3">
      {spaces.map((space: SpaceWithDetails) => {
        const isOwner = space.owner_id === auth.dbUser.id;
        const isCurrent = space.id === currentSpace?.id;
        const isDefault = space.is_default;
        const memberCount = space.members.length;

        return (
          <div
            key={space.id}
            className="card-container flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="txt font-medium">{space.name}</h3>
                {isCurrent && <Badge variant="secondary">{t("current")}</Badge>}
                {isOwner && <Badge variant="outline">{t("owner")}</Badge>}
                {isDefault && <Badge variant="default">{t("default")}</Badge>}
              </div>
              <p className="txt-muted text-sm">
                {memberCount} {memberCount === 1 ? t("member") : t("members")} •{" "}
                {space._count.expenses} {t("expenses")}
              </p>
            </div>
            {isOwner && !isDefault && (
              <DeleteSpaceDialog spaceId={space.id} spaceName={space.name} />
            )}
            {!isDefault && (
              <Button variant="outline" size="icon">
                <IoAddOutline />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};
