"use server";

import prisma from "@/lib/prisma";
import { getUserByClerkId } from "@/lib/users";
import { currentUser } from "@clerk/nextjs/server";

type SpaceMemberWithUser = {
  user_id: number;
  role: string;
  user: {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
  };
};

export async function getSpaceMembers(spaceId: number) {
  try {
    //get user from session
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("User not authenticated");

    const user = await getUserByClerkId(clerkUser.id);
    if (!user) throw new Error("User not found in database");

    //resolve space id
    let targetSpaceId = spaceId;

    if (!targetSpaceId) {
      //get first space of user
      const userSpaceMember = await prisma.spaceMember.findFirst({
        where: { user_id: user.id },
        select: { space_id: true },
      });

      if (!userSpaceMember) {
        throw new Error("User does not belong to any space");
      }
      targetSpaceId = userSpaceMember.space_id;
    }

    //get space members
    const spaceMembers = await prisma.spaceMember.findMany({
      where: {
        space_id: targetSpaceId,
      },
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
        user: {
          name: "asc",
        },
      },
    });

    //filter active users and map to simple format
    return spaceMembers
      .filter((member: SpaceMemberWithUser) => member.user.is_active)
      .map((member: SpaceMemberWithUser) => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        role: member.role,
      }));
  } catch (error) {
    console.error("Error fetching space members:", error);
    return [];
  }
}
