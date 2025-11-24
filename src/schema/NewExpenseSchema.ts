import * as z from "zod";
import { OptionSchema } from "@/components/ui/multiple-selector";

export const BaseExpenseSchema = z
  .object({
    id: z.string().optional(),
    // obligatory fields
    amount: z.coerce
      .number()
      .positive("The amount must be greater than 0.")
      .min(0.01, "The amount must be at least 0.01."),

    currency: z.string().min(1, "You must select a currency."),

    receipt: z
      .array(
        z
          .instanceof(File, { message: "You must upload a receipt file." })
          .refine(file => file.size <= 5_000_000, {
            message: "Each file must be less than 5MB.",
          })
          .refine(
            file =>
              ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
            {
              message: "Only .jpg, .jpeg and .png formats are supported.",
            }
          )
      )
      .optional(),

    name: z
      .string()
      .min(3, "Expense name must be at least 3 characters.")
      .max(50, "Expense name must be at most 50 characters."),

    category: z.string().min(1, "You must select at least one category."),

    responsible: z.string().min(1, "You must select a responsible person."),

    status: z.string().min(1, "You must select a status."),

    expireDate: z.date().refine(
      dateStr => {
        const date = new Date(dateStr);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return date >= now;
      },
      { message: "The expiration date cannot be in the past." }
    ),

    // optional fields
    tags: z.array(OptionSchema).optional(),

    note: z
      .string()
      .max(500, "Note must be at most 500 characters.")
      .optional(),
  })
  .refine(
    data => {
      if (data.status === "paid") {
        return Array.isArray(data.receipt) && data.receipt.length > 0;
      }
      return true;
    },
    {
      message:
        "You must upload at least one receipt when the status is 'paid'.",
      path: ["receipt"],
    }
  );

export type BaseExpenseType = z.infer<typeof BaseExpenseSchema>;
export type CreateExpenseType = z.infer<Omit<typeof BaseExpenseSchema, "id">>;
export type UpdateExpenseType = z.infer<"id" & Partial<BaseExpenseType>>;
