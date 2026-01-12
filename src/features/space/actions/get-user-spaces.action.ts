"use server";

import { cache } from "react";
import { validateAuth } from "@/features/auth/services/auth.service";
import { SpaceService } from "../services/space.service";

const getUserSpacesQuery = cache(async (userId: string) => {
  return await SpaceService.getUserSpaces(userId);
});

export async function getUserSpaces() {
  const auth = await validateAuth();
  if (!auth) {
    throw new Error("Authentication required");
  }

  return getUserSpacesQuery(auth.dbUser.id);
}
