"use client";

import {
  CreateExpenseSchema,
  UpdateExpenseSchema,
  type BaseExpenseType,
} from "@/features/expense/types/expense.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Resolver } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectContent } from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import MultipleSelector from "@/components/ui/multiple-selector";
import {
  createExpense,
  updateExpense,
} from "@/features/expense/actions/create-update-expense.action";

import { useTransition } from "react";
import { Category } from "@prisma/client";
import type { Option } from "@/components/ui/multiple-selector";
import { Calendar22 } from "@/components/custom/calendar/calendar";
import { useTranslations, useMessages } from "next-intl";
import { translateCategory } from "@/lib/translate-category";

interface ExpenseFormProps {
  categories: Category[];
  spaceMembers: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
  spaceId: string;
  tags: Option[];
  expense?: {
    id: string;
    name: string;
    amount: number;
    currency: string;
    date: Date;
    category_id: number;
    responsible_id: string;
    status?: "pending" | "paid" | "cancelled" | "overdue";
    description?: string;
    tags?: Option[];
  } | null;
}

export const ExpenseForm = ({
  categories,
  spaceMembers,
  spaceId,
  tags,
  expense,
}: ExpenseFormProps) => {
  const t = useTranslations("expense");
  const messages = useMessages();
  const [isPending, startTransition] = useTransition();

  const isEditing = !!expense?.id;

  const schema = isEditing ? UpdateExpenseSchema : CreateExpenseSchema;

  const form = useForm<BaseExpenseType>({
    resolver: zodResolver(schema) as unknown as Resolver<BaseExpenseType>,
    defaultValues: expense
      ? {
          id: expense.id,
          amount: expense.amount,
          currency: expense.currency,
          name: expense.name,
          category: expense.category_id.toString(),
          responsible: expense.responsible_id,
          status: expense.status || "pending",
          expireDate: new Date(expense.date),
          tags: expense.tags || [],
          note: expense.description || "",
          receipt: [],
        }
      : {
          amount: 0,
          currency: "",
          receipt: [],
          name: "",
          category: "",
          responsible: "",
          status: "pending",
          expireDate: new Date(),
          tags: [],
          note: "",
        },
  });

  const onSubmit = (data: BaseExpenseType) => {
    if (isPending) return;
    const formData = new FormData();

    // if is editing, add the ID
    if (expense?.id) {
      formData.append("id", expense.id);
    }

    formData.append("name", data.name);
    formData.append("amount", data.amount.toString());
    formData.append("currency", data.currency);
    formData.append("category", data.category);
    formData.append("responsible", data.responsible);
    formData.append("status", data.status || "pending");
    formData.append("note", data.note || "");
    formData.append("expireDate", data.expireDate.toISOString());

    //handle receipts
    if (data.receipt && data.receipt.length > 0) {
      data.receipt.forEach((file) => {
        formData.append("receipt", file);
      });
    }

    //handle tags
    if (data.tags) {
      formData.append("tags", JSON.stringify(data.tags));
    }

    startTransition(async () => {
      // ✅ Call the correct function based on the mode
      const result = isEditing
        ? await updateExpense(formData, expense!.id, spaceId)
        : await createExpense(formData, spaceId);

      if (result?.success) {
        if (!isEditing) {
          form.reset();
        }
      } else {
        console.error("Error:", result?.error);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="card-container">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between gap-3">
                  <Label className="text-xl font-semibold">{t("name")}</Label>
                  <Input
                    className="border-0 shadow-none bg-light text-lg font-semibold md:w-100 sm:w-60 w-full"
                    {...field}
                    placeholder={t("name")}
                  />
                </div>
                {fieldState.invalid && (
                  <p className="text-red-500 text-end">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />
          <Separator className="my-5" />

          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between gap-3">
                  <Label className="text-xl font-semibold">{t("price")}</Label>
                  <Input
                    className="border-0 shadow-none bg-light text-lg font-semibold md:w-100 sm:w-60 w-full"
                    {...field}
                    placeholder={t("price")}
                  />
                </div>
                {fieldState.invalid && (
                  <p className="text-red-500 text-end">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />
          <Separator className="my-5" />

          <Controller
            name="note"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between gap-3">
                  <Label className="text-xl font-semibold">{t("note")}</Label>
                  <Input
                    className="border-0 shadow-none bg-light text-lg font-semibold md:w-100 sm:w-60 w-full"
                    {...field}
                    placeholder={t("note")}
                  />
                </div>
              </div>
            )}
          />

          <Separator className="my-5" />

          <Controller
            name="currency"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap justify-between gap-3 items-center">
                  <Label className="text-xl font-semibold">
                    {t("currency")}
                  </Label>
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="text-lg font-semibold txt card-container w-56 sm:w-60 md:w-100">
                      <SelectValue placeholder={t("selectCurrency")} />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className={cn("card-container", "!p-1")}
                    >
                      <SelectGroup>
                        <SelectItem
                          className="bg text-lg font-semibold"
                          value="ARS"
                        >
                          ARS
                        </SelectItem>
                        <SelectItem
                          className="bg text-lg font-semibold"
                          value="USD"
                        >
                          USD
                        </SelectItem>
                        <SelectItem
                          className="bg text-lg font-semibold"
                          value="EUR"
                        >
                          EUR
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {fieldState.invalid && (
                  <p className="text-red-500 text-end">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />
          <Separator className="my-5" />

          <Controller
            name="responsible"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap justify-between gap-3 items-center">
                  <Label className="text-xl font-semibold">
                    {t("responsible")}
                  </Label>
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="text-lg font-semibold txt card-container w-56 sm:w-60 md:w-100">
                      <SelectValue placeholder={t("selectResponsible")} />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className={cn("card-container", "!p-1")}
                    >
                      <SelectGroup>
                        {spaceMembers.map((member) => (
                          <SelectItem
                            key={member.id}
                            className="bg text-lg font-semibold"
                            value={member.id}
                          >
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {fieldState.invalid && (
                  <p className="text-red-500 text-end">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />
          <Separator className="my-5" />

          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap justify-between gap-3 items-center">
                  <Label className="text-xl font-semibold">
                    {t("category")}
                  </Label>
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="text-lg font-semibold txt card-container w-56 sm:w-60 md:w-100">
                      <SelectValue placeholder={t("selectCategory")} />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className={cn("card-container", "!p-1")}
                    >
                      <SelectGroup className="max-h-40 overflow-y-auto">
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            className="bg text-lg font-semibold"
                            value={category.id.toString()}
                          >
                            {translateCategory(category.name, messages)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {fieldState.invalid && (
                  <p className="text-red-500 text-end">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />

          <Separator className="my-5" />

          <Controller
            name="expireDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap justify-between gap-3 items-center">
                  <Label className="text-xl font-semibold">
                    {t("expirationDate")}
                  </Label>
                  <Calendar22
                    selectedDate={field.value}
                    onDateChange={field.onChange}
                  />
                </div>
                {fieldState.invalid && (
                  <p className="text-red-500 text-end">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />

          <Separator className="my-5" />

          <Controller
            name="tags"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-wrap justify-between gap-3 items-center">
                <Label className="text-xl font-semibold">{t("tags")}</Label>
                <div className="w-56 sm:w-60 md:w-100">
                  <MultipleSelector
                    {...field}
                    defaultOptions={tags}
                    placeholder={t("selectOrCreateTags")}
                    creatable
                    value={field.value}
                    onChange={field.onChange}
                    emptyIndicator={<p>{t("noResultsFound")}</p>}
                  />
                </div>
              </div>
            )}
          />
        </div>
        <div className="w-full items-end flex justify-end mt-10">
          <Button type="submit" className="btn" disabled={isPending}>
            {isPending
              ? isEditing
                ? t("updating")
                : t("creating")
              : isEditing
                ? t("updateExpense")
                : t("createExpense")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
