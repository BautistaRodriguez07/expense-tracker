"use client";

import { IoMenu } from "react-icons/io5";
import { useUIStore } from "@/store/ui/ui-store";
import { Logo } from "@/components/custom/logo/logo";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { UserAvatar } from "@/components";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  spaceSelector?: ReactNode;
  currentSpaceName: string;
};

export const TopMenu = (props: Props) => {
  const openMenu = useUIStore(state => state.openSideMenu);

  return (
    <div className="flex justify-between items-center p-4 bg">
      {/* logo */}
      <Link href="/">
        <Logo />
      </Link>

      {/* space selector */}

      <div className="flex-1 items-center justify-center flex">
        <DropdownMenu>
          <DropdownMenuTrigger className="btn p-2 txt mx-5 rounded-xl w-full max-w-xl">
            {props.currentSpaceName}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={cn("card-container txt-muted font-medium", "!p-1")}
          >
            {props.spaceSelector}
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
