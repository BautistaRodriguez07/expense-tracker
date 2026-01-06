import { UserAvatar } from "@/components";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { IoChevronForwardOutline } from "react-icons/io5";

interface Props {
  userImg: string;
  userName: string;
  categoryName: string;
  expirationDate: string;
  id: string;
}

export const PendingPayment = ({
  userImg,
  userName,
  categoryName,
  expirationDate,
  id,
}: Props) => {
  const t = useTranslations("pendingPayment");

  return (
    <div className=" flex gap-2">
      {/* pending payment 1 */}

      <div className="card-container p-3 mb-5 mx-1 min-w-80 flex items-center justify-between">
        <div>
          <UserAvatar
            userName={userName}
            imageUrl={userImg}
            categoryName={categoryName}
          />
          <div className="py-2">
            <span className="txt-muted ml-2">{t("expirationDate")} </span>
            <span className="font-semibold text-red-500 dark:text-red-400">
              {expirationDate}
            </span>
          </div>
        </div>

        <Link href={`/expense/${id}`}>
          <IoChevronForwardOutline
            size={18}
            className="text-black dark:text-white"
          />
        </Link>
      </div>
    </div>
  );
};
