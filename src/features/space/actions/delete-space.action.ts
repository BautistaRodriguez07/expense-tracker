"use server";

import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import { SpaceService } from "../services/space.service";
import { requireSpaceOwnership } from "../guards/space-owner.guard";

type ActionResult = {
  success: boolean;
  error?: string;
};

export async function deleteSpace(spaceId: string): Promise<ActionResult> {
  try {
    // Validate ownership
    const auth = await requireSpaceOwnership(spaceId);

    // Get user's other spaces
    const userSpaces = await SpaceService.getUserSpaces(auth.dbUser.id);
    const otherSpaces = userSpaces.filter(
      (s: { id: string }) => s.id !== spaceId
    );

    if (otherSpaces.length === 0) {
      throw new Error(
        "Cannot delete your last space. Create another space first."
      );
    }

    // Delete space using service
    await SpaceService.delete(spaceId, auth.dbUser.id);

    // Switch to another space
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(auth.clerkUser.id, {
      publicMetadata: {
        activeSpaceId: otherSpaces[0].id,
      },
    });

    // Revalidate paths
    revalidatePath("/", "layout");
    revalidatePath("/settings");

    return { success: true };
  } catch (error) {
    console.error("Error deleting space:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
