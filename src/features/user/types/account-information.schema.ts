import * as z from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg"];

export const AccountInformationSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(15, "Username must be at most 15 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores."
    )
    .optional(),
  image: z

    .instanceof(File, { message: "Expected a File" }) // Ensure the input is a File object
    .refine(file => file.size <= MAX_UPLOAD_SIZE, {
      message: `File size must be less than ${
        MAX_UPLOAD_SIZE / (1024 * 1024)
      }MB`,
    })
    .refine(file => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: `File must be one of the following types: ${ACCEPTED_FILE_TYPES.join(
        ", "
      )}`,
    })
    .optional(),
});

export type AccountInformationType = z.infer<typeof AccountInformationSchema>;
