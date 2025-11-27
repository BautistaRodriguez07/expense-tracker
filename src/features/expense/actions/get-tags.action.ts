"use server";

import { cache } from "react";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/features/auth/guards/workspace.guard";
import type { Option } from "@/components/ui/multiple-selector";

// get all tags for a workspace (cached)
const getTagsQuery = cache(async (spaceId: number): Promise<Option[]> => {
  const tags = await prisma.tag.findMany({
    where: {
      space_id: spaceId,
      deleted_at: null,
    },
    orderBy: {
      name: "asc",
    },
  });

  return tags.map(tag => ({
    label: tag.name,
    value: tag.id.toString(),
  }));
});

export async function getTags(spaceId: number): Promise<Option[]> {
  await requireWorkspaceAccess(spaceId);
  return getTagsQuery(spaceId);
}
