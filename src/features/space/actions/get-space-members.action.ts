"use server";

import { cache } from "react";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/features/auth/guards/workspace.guard";

type SpaceMemberDTO = {
  id: number;
  name: string;
  email: string;
  role: string;
};

// get space members query
const getSpaceMembersQuery = cache(
  async (spaceId: number): Promise<SpaceMemberDTO[]> => {
    const spaceMembers = await prisma.spaceMember.findMany({
      where: { space_id: spaceId },
      select: {
        user_id: true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            is_active: true,
          },
        },
      },
      orderBy: {
        user: { name: "asc" },
      },
    });

    return spaceMembers
      .filter(member => member.user.is_active)
      .map(member => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        role: member.role,
      }));
  }
);

// public action with validation
export async function getSpaceMembers(
  spaceId: number
): Promise<SpaceMemberDTO[]> {
  await requireWorkspaceAccess(spaceId);
  return getSpaceMembersQuery(spaceId);
}
