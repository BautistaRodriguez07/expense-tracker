"use server";

import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { requireWorkspaceAccess } from "@/features/auth/guards/workspace.guard";
import { revalidatePath } from "next/cache";

export async function switchWorkspace(newSpaceId: number) {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    // verify that the user has access to that workspace
    await requireWorkspaceAccess(newSpaceId);

    // update activeSpaceId in Clerk metadata
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(user.id, {
      publicMetadata: {
        activeSpaceId: newSpaceId,
        lastSwitched: new Date().toISOString(),
      },
    });

    // revalidate all paths
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Error switching workspace:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
