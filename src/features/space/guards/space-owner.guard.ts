import { validateAuth } from "@/features/auth/services/auth.service";
import prisma from "@/lib/prisma";

export async function requireSpaceOwnership(spaceId: string) {
  const auth = await validateAuth();

  if (!auth) {
    throw new Error("Authentication required");
  }

  const space = await prisma.space.findUnique({
    where: { id: spaceId, deleted_at: null },
    select: { owner_id: true },
  });

  if (!space) {
    throw new Error("Space not found");
  }

  if (space.owner_id !== auth.dbUser.id) {
    throw new Error("Only the space owner can perform this action");
  }

  return auth;
}
