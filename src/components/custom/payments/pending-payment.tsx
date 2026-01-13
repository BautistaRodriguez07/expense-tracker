"use client";

import { UserAvatar } from "@/components/custom/user/user-avatar";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { IoChevronForwardOutline } from "react-icons/io5";
import { MdOutlinePendingActions } from "react-icons/md";
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
  const tExpense = useTranslations("expense");
  const isOverdue = new Date(expirationDate) < new Date();
  const isDueSoon =
    new Date(expirationDate) <
      new Date(new Date().setDate(new Date().getDate() + 3)) && !isOverdue;

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
            <span className="font-semibold text-red-500 dark:text-red-400 flex items-center gap-2">
              {expirationDate}{" "}
              {isOverdue && (
                <>
                  <MdOutlinePendingActions className="animate-pulse " />
                  <span className="text-xs animate-pulse">
                    {tExpense("overdue")}
                  </span>
                </>
              )}
              {isDueSoon && (
                <>
                  <MdOutlinePendingActions className="animate-pulse text-yellow-500 dark:text-yellow-400" />
                  <span className="text-xs animate-pulse text-yellow-500 dark:text-yellow-400">
                    {tExpense("dueSoon")}
                  </span>
                </>
              )}
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
