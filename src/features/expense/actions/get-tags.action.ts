"use server";

import { cache } from "react";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/features/auth/guards/workspace.guard";
import type { Option } from "@/components/ui/multiple-selector";
import type { Tag } from "@prisma/client";

// get all tags for a workspace (cached)
const getTagsQuery = cache(async (spaceId: string): Promise<Option[]> => {
  const tags = await prisma.tag.findMany({
    where: {
      space_id: spaceId,
      deleted_at: null,
    },
    orderBy: {
      name: "asc",
    },
  });

  return tags.map((tag: Tag) => ({
    label: tag.name,
    value: tag.id,
  }));
});

export async function getTags(spaceId: string): Promise<Option[]> {
  await requireWorkspaceAccess(spaceId);
  return getTagsQuery(spaceId);
}
