import {
  currentUser,
  clerkClient,
  User as ClerkUser,
} from "@clerk/nextjs/server";
import { createOrUpdateUser, getUserByClerkId } from "@/lib/users";
import { UserInterface } from "@/features/user/types/user.types";
import prisma from "@/lib/prisma";

export type AuthResult = {
  clerkUser: ClerkUser;
  dbUser: UserInterface;
  spaceId: number;
};

/**
 * validate authentication using activeSpaceId from Clerk metadata
 */
export async function validateAuth(): Promise<AuthResult | null> {
  // 1. get user from Clerk
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // 2. get user from database
  let dbUser = await getUserByClerkId(clerkUser.id);
  let spaceId = clerkUser.publicMetadata?.activeSpaceId as number | undefined;

  // If user is in Clerk but not in DB, try to sync immediately
  if (!dbUser) {
    try {
      console.log("User found in Clerk but not in DB. Syncing...");
      const result = await createOrUpdateUser({
        id: clerkUser.id,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        emailAddresses: clerkUser.emailAddresses.map(e => ({
          emailAddress: e.emailAddress,
        })),
      } as any);

      dbUser = result.user;
      spaceId = result.spaceId;
    } catch (error) {
      console.error("Failed to sync user during auth validation:", error);
      return null;
    }
  }

  if (!dbUser) return null;

  // 3. get activeSpaceId from Clerk metadata (faster)
  // spaceId is already set if we just synced, otherwise check metadata
  if (!spaceId) {
    spaceId = clerkUser.publicMetadata?.activeSpaceId as number | undefined;
  }

  // 4. if not exists in metadata (and wasn't just synced), search in DB (fallback)
  if (!spaceId) {
    const spaceMember = await prisma.spaceMember.findFirst({
      where: {
        user_id: dbUser.id,
        space: {
          deleted_at: null,
        },
      },
      select: { space_id: true },
    });

    if (!spaceMember) return null;

    spaceId = spaceMember.space_id;

    // update metadata in Clerk for next requests (without waiting)
    const clerk = await clerkClient();
    clerk.users
      .updateUserMetadata(clerkUser.id, {
        publicMetadata: { activeSpaceId: spaceId },
      })
      .catch(console.error);
  }

  // verify that spaceId is number before returning
  if (!spaceId || typeof spaceId !== "number") {
    return null;
  }

  return {
    clerkUser,
    dbUser,
    spaceId,
  };
}

// verify if the user is authenticated

export async function isAuthenticated(): Promise<boolean> {
  const result = await validateAuth();
  return result !== null;
}

export async function getExtendedAuthInfo(auth: AuthResult) {
  if (!auth.dbUser.is_system_admin) {
    throw new Error("Unauthorized: System admin only");
  }

  // debug information for system admins
  const allWorkspaces = await prisma.space.findMany({
    include: {
      members: {
        include: { user: true },
      },
    },
  });

  return {
    ...auth,
    systemInfo: {
      totalWorkspaces: allWorkspaces.length,
      workspaces: allWorkspaces,
    },
  };
}
