import React from "react";
import { getUserSpaces } from "../actions/get-user-spaces.action";
import { translateSpace } from "@/lib/translate-space";
import { getMessages } from "next-intl/server";
import { validateAuth } from "@/features/auth/services/auth.service";
import { getSpace } from "../actions/get-space.action";
import { SpaceSelectorItem } from "./space-selector-item";

type SpaceWithDetails = Awaited<ReturnType<typeof getUserSpaces>>[number];

export const SpaceSelector = async () => {
  const auth = await validateAuth();
  if (!auth) return null;

  const spaces = await getUserSpaces();
  const currentSpace = await getSpace(auth.spaceId);
  const messages = await getMessages();

  return (
    <>
      {spaces.map((space: SpaceWithDetails) => {
        const isCurrent = space.id === currentSpace?.id;
        const translatedName = translateSpace(space.name, messages);

        return (
          <SpaceSelectorItem
            key={space.id}
            spaceId={space.id}
            spaceName={translatedName}
            isDisabled={isCurrent}
          />
        );
      })}
    </>
  );
};
