"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessages } from "next-intl";
import { translateCategory } from "@/lib/translate-category";

interface Props {
  userName: string;
  categoryName?: string;
  imageUrl?: string;
  expenseName?: string;
}

export const UserAvatar = ({
  userName,
  categoryName,
  imageUrl,
  expenseName,
}: Props) => {
  const messages = useMessages();
  const translatedCategory = categoryName
    ? translateCategory(categoryName, messages)
    : "";

  return (
    // selected user avatar
    <div className="flex flex-col">
      <div className="flex items-center gap-2 p-1">
        <Avatar className="border-gray-300 border dark:border-0 txt">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{userName.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <span className="font-medium text-lg">{userName}</span>
      </div>

      {expenseName && (
        <span className="txt-muted ml-2 text-lg font-semibold">
          {expenseName}
        </span>
      )}
      <span className="txt-muted ml-2">{translatedCategory}</span>
    </div>
  );
};
