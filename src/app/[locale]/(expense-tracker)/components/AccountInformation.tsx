"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

export const AccountInformation = () => {
  const t = useTranslations("settings");
  const { user, isLoaded } = useUser();
  const [usernameDisabled, setUsernameDisabled] = useState<boolean>(true);
  const usernameRef = useRef<HTMLInputElement | null>(null);

  const [inputValues, setInputValues] = useState({
    image: "",
    username: "",
  });

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValues.image.length > 0) {
      try {
        const base64Response = await fetch(inputValues.image);
        const blob = await base64Response.blob();
        const file = new File([blob], "profile.jpg", { type: blob.type });

        await user?.setProfileImage({ file });

        setInputValues({ ...inputValues, image: "" });
      } catch (error) {
        console.error("Error:", error);
      }
    }

    if (inputValues.username.length > 0) {
      user?.update({ username: inputValues.username });
    }
  };

  const clearImage = () => {
    const input = document.getElementById("image") as HTMLInputElement | null;
    if (input) input.value = "";
    setInputValues({ ...inputValues, image: "" });
  };

  const convertToBase64AndSet = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setInputValues(prev => ({ ...prev, image: reader.result as string }));
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
                className="absolute -top-1 -right-1 size-6 rounded-full cursor-pointer"
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
        <div className="flex flex-col items-start justify-between text-lg">
          <div className="txt font-medium">{t("name")}</div>
          <input
            className="font-semibold txt-muted"
            type="text"
            name="username"
            id="username"
            ref={usernameRef}
            onChange={handleInput}
            defaultValue={user.fullName ?? "Username"}
            disabled={usernameDisabled}
          />
        </div>
        <Button
          type="button"
          onClick={() => {
            setUsernameDisabled(false);
            setTimeout(() => {
              usernameRef.current?.focus();
            }, 100);
          }}
          className="cursor-pointer text-sm font-medium btn  px-3 py-2"
        >
          {t("edit")}
        </Button>
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
        <Button
          type="submit"
          className="btn-success rounded-xl"
          disabled={!inputValues.image}
        >
          Save
        </Button>
      </div>
    </form>
  );
};
