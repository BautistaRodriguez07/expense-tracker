"use server";

import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/features/auth/guards/workspace.guard";

export type SpaceMemberDTO = {
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl: string | null;
};

interface Member {
  user_id: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    profile_image: string | null;
  };
}

// get space members query
const getSpaceMembersQuery = async (
  spaceId: string,
): Promise<SpaceMemberDTO[]> => {
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
          profile_image: true,
        },
      },
    },
    orderBy: {
      user: { name: "asc" },
    },
  });

  return spaceMembers
    .filter((member: Member) => member.user.is_active)
    .map((member: Member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      role: member.role,
      imageUrl: member.user.profile_image,
    }));
};

// public action with validation
export async function getSpaceMembers(
  spaceId: string,
): Promise<SpaceMemberDTO[]> {
  await requireWorkspaceAccess(spaceId);
  return getSpaceMembersQuery(spaceId);
}
