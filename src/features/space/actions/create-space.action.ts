"use server";

import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import { validateAuth } from "@/features/auth/services/auth.service";
import { SpaceService } from "../services/space.service";
import { createSpaceSchema } from "../types/space.schema";

type ActionResult = {
  success: boolean;
  spaceId?: string;
  error?: string;
};

export async function createSpace(formData: FormData): Promise<ActionResult> {
  try {
    // Validate authentication
    const auth = await validateAuth();
    if (!auth) {
      throw new Error("Authentication required");
    }

    // Parse and validate input
    const data = {
      name: formData.get("name") as string,
      default_currency: formData.get("default_currency") as string,
    };

    const validatedData = createSpaceSchema.parse(data);

    // Create space using service
    const newSpace = await SpaceService.create({
      ...validatedData,
      owner_id: auth.dbUser.id,
    });

    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(auth.clerkUser.id, {
      publicMetadata: {
        activeSpaceId: newSpace.id,
      },
    });

    // Revalidate paths
    revalidatePath("/", "layout");
    revalidatePath("/settings");

    return {
      success: true,
      spaceId: newSpace.id,
    };
  } catch (error) {
    console.error("Error creating space:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
