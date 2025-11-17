"use client";

import { IoMenu, IoWalletOutline } from "react-icons/io5";
import { useUIStore } from "@/store/ui/ui-store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { UserAvatar } from "@/components";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export const TopMenu = () => {
  const t = useTranslations("topMenu");

  const openMenu = useUIStore(state => state.openSideMenu);

  return (
    <div className="flex justify-between items-center p-4 bg">
      {/* logo */}
      <Link href="/">
        <IoWalletOutline size={40} className="cursor-pointer" />
      </Link>

      {/* space selector */}

      <div className="flex-1 items-center justify-center flex">
        <DropdownMenu>
          <DropdownMenuTrigger className="btn p-2 txt mx-5 rounded-xl w-full max-w-xl">
            {t("spaceSelector")}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={cn("card-container txt-muted font-medium", "!p-1")}
          >
            <DropdownMenuItem>{t("personalAccount")}</DropdownMenuItem>
            <DropdownMenuItem>{t("group")} 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex gap-3">
        {/* profile */}
        {/* <Link href="/profile">
          <UserAvatar userName="David" />
        </Link> */}

        {/* menu */}

        <div onClick={openMenu} className="cursor-pointer">
          <IoMenu size={40} />
        </div>
      </div>
    </div>
  );
};
