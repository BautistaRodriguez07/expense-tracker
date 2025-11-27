"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { IoCloseOutline } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccountInformationSchema,
  AccountInformationType,
} from "@/features/user/types/account-information.schema";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

export const AccountInformation = () => {
  const t = useTranslations("settings");
  const { user, isLoaded } = useUser();

  // const initialValues = {
  //   username: user?.firstName ?? "",
  //   image: user?.imageUrl as File | undefined,
  // };

  const form = useForm<AccountInformationType>({
    resolver: zodResolver(AccountInformationSchema),
    defaultValues: {
      username: "",
      image: undefined,
    },
  });

  const { isDirty } = form.formState;

  const handleSubmit = async (data: AccountInformationType) => {
    if (!user) return;

    try {
      if (data.image instanceof File) {
        await user.setProfileImage({ file: data.image });
      }

      if (data.username && data.username.length > 3) {
        await user.update({ firstName: data.username });
      }
      await user.reload();

      form.reset({
        username: user.firstName ?? "",
        image: undefined,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const convertToBase64AndSet = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
      }
    };
  };

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (name === "image" && files && files[0]) {
      user?.setProfileImage({ file: files[0] });
      convertToBase64AndSet(files[0]);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      form.setValue("username", user?.firstName ?? "");
    }
  }, [user, isLoaded, form]);

  if (!isLoaded || !user) return <div>Loading...</div>;

  console.log(form.formState.errors);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* image section */}
      <div className="flex items-center justify-between mb-6">
        <p className="txt font-medium text-lg">{t("image")}</p>

        <div className="flex items-center gap-4">
          <Controller
            name="image"
            control={form.control}
            render={({
              field: { value, onChange, ...fieldProps },
              fieldState,
            }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  hidden
                  htmlFor="form-rhf-input-image"
                  className="txt font-medium text-md"
                >
                  Image
                </FieldLabel>
                <Input
                  type="file"
                  {...fieldProps}
                  id="image"
                  name="image"
                  aria-invalid={fieldState.invalid}
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    onChange(file || null);
                  }}
                />

                {/* image preview */}

                <div className="relative">
                  <Image
                    className="rounded-full object-cover border size-20"
                    src={
                      value instanceof File
                        ? URL.createObjectURL(value)
                        : user.imageUrl
                    }
                    alt="User image"
                    width={80}
                    height={80}
                  />
                  {value instanceof File && (
                    <Button
                      type="button"
                      onClick={() => onChange(null)}
                      variant="destructive"
                      size="icon"
                      className="absolute -top-1 -right-1 size-6 rounded-full cursor-pointer"
                    >
                      <IoCloseOutline className="text-lg" />
                    </Button>
                  )}
                </div>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Edit */}
          <div>
            <label
              htmlFor="image"
              className="cursor-pointer text-sm font-medium btn px-3 py-2"
            >
              {t("edit")}
            </label>
          </div>
        </div>
      </div>

      <Separator className="my-5" />

      {/* name */}
      <div className="flex justify-between items-center">
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="form-rhf-input-username"
                className="txt font-medium text-md"
              >
                <span className="txt font-medium text-lg">{t("name")}</span>
              </FieldLabel>
              <Input
                className="border-0 shadow-none bg-light"
                {...field}
                name="username"
                aria-invalid={fieldState.invalid}
                placeholder={user?.firstName ?? "name"}
                autoComplete="username"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Separator className="my-5" />

      {/* email */}
      <div className="flex flex-col items-start justify-between text-lg">
        <span className="txt font-medium text-lg">{t("email")}</span>
        <span className="font-semibold txt-muted text-md">
          {user.emailAddresses[0]?.emailAddress}
        </span>
      </div>

      <div className="flex items-center justify-end mt-5 gap-2">
        <Button
          type="button"
          className="btn"
          onClick={() =>
            form.reset({
              username: user.firstName ?? "",
              image: undefined,
            })
          }
          disabled={!isDirty}
        >
          Reset
        </Button>

        <Button type="submit" className="btn" disabled={!isDirty}>
          Save
        </Button>
      </div>
    </form>
  );
};
