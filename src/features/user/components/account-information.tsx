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
import { useEffect, useState } from "react";
import { Loading } from "@/components/custom/loading/loading";
import { updateUserAction } from "@/features/user/actions/update-user.action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const AccountInformation = () => {
  const t = useTranslations("settings");

  const { user, isLoaded } = useUser();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // const initialValues = {
  //   username: user?.firstName ?? "",
  //   image: user?.imageUrl as File | undefined,
  // };

  const form = useForm<AccountInformationType>({
    resolver: zodResolver(AccountInformationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      image: undefined,
    },
  });

  const { isDirty } = form.formState;

  const handleReset = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }

    form.reset({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      image: undefined,
    });
  };

  const handleSubmit = async (data: AccountInformationType) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      let imageUrl = user.imageUrl;

      if (data.image instanceof File) {
        try {
          await user.setProfileImage({ file: data.image });
          await user.reload();

          imageUrl = user.imageUrl;

          if (!imageUrl) {
            throw new Error("Failed to get image URL from Clerk after upload");
          }
        } catch (uploadError) {
          console.error("❌ Error uploading image to Clerk:", uploadError);
          toast.error("Error al subir la imagen");
          setIsSubmitting(false);
          return;
        }
      }

      const result = await updateUserAction({
        firstName: data.firstName || user.firstName || undefined,
        lastName: data.lastName || user.lastName || undefined,
        imageUrl,
      });

      if (result.success) {
        toast.success(
          t("profileUpdated") || "Perfil actualizado correctamente",
        );

        await user.reload();

        form.reset({
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          image: undefined,
        });
      } else {
        console.error("❌ Update failed:", result.error);
        toast.error(
          result.error || t("updateError") || "Error al actualizar perfil",
        );
      }
    } catch (error) {
      console.error("❌ Unexpected error updating profile:", error);
      toast.error(t("updateError") || "Error al actualizar perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      form.setValue("firstName", user?.firstName ?? "");
      form.setValue("lastName", user?.lastName ?? "");
    }
  }, [user, isLoaded, form]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!isLoaded || !user || !t) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loading />
      </div>
    );
  }

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
                  disabled={isSubmitting}
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      if (imagePreview) {
                        URL.revokeObjectURL(imagePreview);
                      }
                      const preview = URL.createObjectURL(file);
                      setImagePreview(preview);
                      onChange(file);
                    } else {
                      if (imagePreview) {
                        URL.revokeObjectURL(imagePreview);
                      }
                      setImagePreview(null);
                      onChange(null);
                    }
                  }}
                />

                {/* image preview */}

                <div className="relative">
                  <label
                    htmlFor="image"
                    className="flex sm:hidden inset-0 absolute rounded-full hover:bg-black/50 transition-all duration-300 cursor-pointer"
                  />
                  <Image
                    className="rounded-full object-cover border size-20"
                    src={imagePreview || user.imageUrl}
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
                      disabled={isSubmitting}
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
          <div className="hidden sm:block">
            <label
              htmlFor="image"
              className={`cursor-pointer text-sm font-medium btn px-3 py-2 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="form-rhf-input-firstName"
                className="txt font-medium text-md"
              >
                <span className="txt font-medium text-lg">
                  {t("firstName")}
                </span>
              </FieldLabel>
              <Input
                className="border-0 shadow-none bg-light"
                {...field}
                name="firstName"
                aria-invalid={fieldState.invalid}
                placeholder={user?.firstName ?? t("firstName")}
                autoComplete="given-name"
                disabled={isSubmitting}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Separator className="my-5" />

      {/* last name */}
      <div className="flex justify-between items-center">
        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="form-rhf-input-lastName"
                className="txt font-medium text-md"
              >
                <span className="txt font-medium text-lg">{t("lastName")}</span>
              </FieldLabel>
              <Input
                className="border-0 shadow-none bg-light"
                {...field}
                name="lastName"
                aria-invalid={fieldState.invalid}
                placeholder={user?.lastName ?? "lastName"}
                autoComplete="family-name"
                disabled={isSubmitting}
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
          onClick={handleReset}
          disabled={!isDirty || isSubmitting}
        >
          {t("reset")}
        </Button>

        <Button
          type="submit"
          className="btn"
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("save")}
        </Button>
      </div>
    </form>
  );
};
