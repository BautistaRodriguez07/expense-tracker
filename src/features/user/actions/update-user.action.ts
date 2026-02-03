"use server";

import { auth } from "@clerk/nextjs/server";
import { updateUserBoth } from "@/lib/users";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(3, "First name must be at least 3 characters")
    .optional(),
  lastName: z
    .string()
    .min(3, "Last name must be at least 3 characters")
    .optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
});

export async function updateUserAction(data: z.infer<typeof updateUserSchema>) {
  try {
    const { userId } = await auth();

    if (!userId) {
      console.error("❌ Update user failed: User not authenticated");
      return {
        success: false,
        error: "No autenticado",
      };
    }

    const validated = updateUserSchema.parse(data);

    const updatedUser = await updateUserBoth(userId, validated);

    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/(expense-tracker)", "layout");

    return {
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profile_image,
      },
    };
  } catch (error) {
    console.error("❌ Error in updateUserAction:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation error",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido al actualizar usuario",
    };
  }
}
