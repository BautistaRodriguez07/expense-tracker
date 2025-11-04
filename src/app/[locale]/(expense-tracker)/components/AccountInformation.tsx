"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

export const AccountInformation = () => {
  const t = useTranslations("settings");
  const { user, isLoaded } = useUser();

  const [inputValues, setInputValues] = useState({ image: "" });

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValues.image.length > 0) {
      user?.setProfileImage({ file: inputValues.image });
    }
  };

  const clearImage = () => {
    const input = document.getElementById("image") as HTMLInputElement | null;
    if (input) input.value = "";
    setInputValues({ image: "" });
  };

  const convertToBase64AndSet = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setInputValues(prev => ({ ...prev, image: reader.result }));
      }
    };
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (name === "image" && files && files[0]) {
      convertToBase64AndSet(files[0]);
    }
  };

  if (!isLoaded || !user) return <div>Loading...</div>;

  return (
    <form onSubmit={submitForm} className="card-container">
      {/* image section */}
      <div className="flex items-center justify-between mb-6">
        <p className="txt font-medium">{t("image")}</p>

        <div className="flex items-center gap-4">
          {/* img */}
          <div className="relative">
            <Image
              className="rounded-full object-cover border size-20"
              src={inputValues.image || user.imageUrl}
              alt="User image"
              width={80}
              height={80}
            />
            {inputValues.image && (
              <Button
                type="button"
                onClick={clearImage}
                variant="destructive"
                size="icon"
                className="absolute -top-1 -right-1 size-6 rounded-full"
              >
                <IoCloseOutline className="text-lg" />
              </Button>
            )}
          </div>

          {/* Edit */}
          <div>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleInput}
              hidden
            />
            <label
              htmlFor="image"
              className="cursor-pointer text-sm font-medium btn px-1"
            >
              {t("edit")}
            </label>
          </div>
        </div>
      </div>

      <Separator className="my-5" />

      {/* name */}
      <div className="flex flex-col items-start justify-between text-lg">
        <p className="txt font-medium">{t("name")}</p>
        <p className="font-semibold txt-muted">{user.fullName}</p>
      </div>

      <Separator className="my-5" />

      {/* email */}
      <div className="flex flex-col items-start justify-between text-lg">
        <p className="txt font-medium">{t("email")}</p>
        <p className="font-semibold txt-muted">
          {user.emailAddresses[0]?.emailAddress}
        </p>
      </div>

      <div className="flex items-center justify-end mt-5">
        <Button className="btn-success rounded-xl">Save</Button>
      </div>
    </form>
  );
};
