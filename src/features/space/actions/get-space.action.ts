import { requireWorkspaceAccess } from "@/features/auth/guards/workspace.guard";
import prisma from "@/lib/prisma";
import { cache } from "react";

const getSpaceQuery = cache(async (spaceId: number) => {
  return await prisma.space.findUnique({
    where: { id: spaceId },
    select: {
      id: true,
      name: true,
      default_currency: true,
    },
  });
});

export async function getSpace(spaceId: number) {
  await requireWorkspaceAccess(spaceId);
  return getSpaceQuery(spaceId);
}
