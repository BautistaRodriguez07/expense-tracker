import { requireWorkspaceAccess } from "@/features/auth/guards/workspace.guard";
import prisma from "@/lib/prisma";
import { cache } from "react";

const getSpaceQuery = cache(async (spaceId: string) => {
  return await prisma.space.findUnique({
    where: { id: spaceId },
    select: {
      id: true,
      name: true,
      default_currency: true,
    },
  });
});

export async function getSpace(spaceId: string) {
  await requireWorkspaceAccess(spaceId);
  return getSpaceQuery(spaceId);
}
