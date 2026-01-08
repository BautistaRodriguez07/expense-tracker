"use client";

import { UserAvatar } from "@/components/custom/user/user-avatar";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { IoChevronForwardOutline } from "react-icons/io5";

interface Props {
  userImg: string;
  userName: string;
  categoryName: string;
  expirationDate: string;
  expenseName: string;
  id: string;
}

export const PendingPayment = ({
  userImg,
  userName,
  categoryName,
  expirationDate,
  expenseName,
  id,
}: Props) => {
  const t = useTranslations("pendingPayment");

  return (
    <div className="flex gap-2">
      {/* pending payment 1 */}
      <Link
        href={`/expense/${id}`}
        className="card-container p-3 mb-5 mx-1 min-w-80 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
      >
        <div>
          <UserAvatar
            userName={userName}
            imageUrl={userImg}
            expenseName={expenseName}
            categoryName={categoryName}
          />
          <div className="py-2">
            <span className="txt-muted ml-2">{t("expirationDate")} </span>
            <span className="font-semibold text-red-500 dark:text-red-400">
              {expirationDate}
            </span>
          </div>
        </div>

        <IoChevronForwardOutline
          size={18}
          className="text-black dark:text-white"
        />
      </Link>
    </div>
  );
};
