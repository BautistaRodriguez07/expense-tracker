"use client";

import {
  BaseExpenseSchema,
  type BaseExpenseType,
} from "@/schema/NewExpenseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { Calendar22 } from "../../../../components/custom/calendar/Calendar";
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
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { OPTIONS } from "@/components/ui/creatable-selector";
import MultipleSelector from "@/components/ui/multiple-selector";

const onSubmit = (data: BaseExpenseType) => {};

export const ExpenseForm = () => {
  const form = useForm<BaseExpenseType>({
    resolver: zodResolver(
      BaseExpenseSchema
    ) as unknown as Resolver<BaseExpenseType>,
    defaultValues: {
      amount: 0,
      currency: "",
      receipt: [],
      name: "",
      category: "",
      responsible: "",
      status: "",
      expireDate: new Date(),

      tags: [],
      note: "",
    },
  });
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
                  <Label className="text-lg">name</Label>
                  <Input
                    className="border-0 shadow-none bg-light"
                    {...field}
                    placeholder="name"
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
                  <Label className="text-lg">amount</Label>
                  <Input
                    className="border-0 shadow-none bg-light"
                    {...field}
                    placeholder="amount"
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
                  <Label className="text-lg">note</Label>
                  <Input
                    className="border-0 shadow-none bg-light"
                    {...field}
                    placeholder="note"
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
              <Field orientation="horizontal" className="!items-center">
                <FieldLabel className="text-lg w-auto">currency</FieldLabel>

                <FieldContent className="items-end">
                  <Select
                    value={field.value}
                    onValueChange={val => field.onChange(val)}
                  >
                    <SelectTrigger className="text-lg font-semibold txt card-container w-60">
                      <SelectValue placeholder="Select currency" />
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
                  {fieldState.invalid && (
                    <p className="text-red-500">{fieldState.error?.message}</p>
                  )}
                </FieldContent>
              </Field>
            )}
          />
          <Separator className="my-5" />

          <Controller
            name="responsible"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" className="!items-center">
                <FieldLabel className="text-lg w-auto">responsible</FieldLabel>

                <FieldContent className="items-end">
                  <Select
                    value={field.value}
                    onValueChange={val => field.onChange(val)}
                  >
                    <SelectTrigger className="text-lg font-semibold txt card-container w-60">
                      <SelectValue placeholder="Select responsible" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className={cn("card-container", "!p-1")}
                    >
                      <SelectGroup>
                        <SelectItem
                          className="bg text-lg font-semibold"
                          value="john_doe"
                        >
                          John Doe
                        </SelectItem>
                        <SelectItem
                          className="bg text-lg font-semibold"
                          value="jane_smith"
                        >
                          Jane Smith
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <p className="text-red-500">{fieldState.error?.message}</p>
                  )}
                </FieldContent>
              </Field>
            )}
          />
          <Separator className="my-5" />

          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" className="!items-center">
                <FieldLabel className="text-lg w-auto">category</FieldLabel>

                <FieldContent className="items-end">
                  <Select
                    value={field.value}
                    onValueChange={val => field.onChange(val)}
                  >
                    <SelectTrigger className="text-lg font-semibold txt card-container w-60">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className={cn("card-container", "!p-1")}
                    >
                      <SelectGroup>
                        <SelectItem
                          className="bg text-lg font-semibold"
                          value="travel"
                        >
                          Travel
                        </SelectItem>
                        <SelectItem
                          className="bg text-lg font-semibold"
                          value="food"
                        >
                          Food
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <p className="text-red-500">{fieldState.error?.message}</p>
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Separator className="my-5" />

          <Controller
            name="expireDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" className="!items-center">
                <div className="flex flex-col w-full">
                  <div className="flex justify-between w-full">
                    <FieldLabel className="text-lg">expiration date</FieldLabel>
                    <FieldContent className="items-end">
                      <Calendar22
                        selectedDate={field.value}
                        onDateChange={field.onChange}
                      />
                    </FieldContent>
                  </div>

                  {fieldState.invalid && (
                    <p className="text-red-500 text-end">
                      {fieldState.error?.message}
                    </p>
                  )}
                </div>
              </Field>
            )}
          />

          <Separator className="my-5" />

          <Controller
            name="tags"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <Label className="text-lg">tags</Label>
                  <div className="w-60">
                    <MultipleSelector
                      {...field}
                      defaultOptions={OPTIONS}
                      placeholder="Select or create tags..."
                      creatable
                      value={field.value}
                      onChange={field.onChange}
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          no results found.
                        </p>
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          />

          <Separator className="my-5" />

          <div className="w-full items-end flex justify-end mt-10">
            <Button type="submit" className="btn">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
