import { z } from "zod";

export const createSpaceSchema = z.object({
  name: z
    .string()
    .min(3, "Space name must be at least 3 characters")
    .max(50, "Space name must be less than 50 characters")
    .trim(),
  default_currency: z.enum(["USD", "EUR", "ARS"]),
});

export const deleteSpaceSchema = z.object({
  spaceId: z.string().uuid("Invalid space ID"),
  confirmationText: z.string().min(1, "Confirmation is required"),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
export type DeleteSpaceInput = z.infer<typeof deleteSpaceSchema>;
