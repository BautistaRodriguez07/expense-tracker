"use client";

import { IoMenu, IoWalletOutline } from "react-icons/io5";
import { useUIStore } from "@/store/ui/ui-store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components";
import Link from "next/link";

export const TopMenu = () => {
  const openMenu = useUIStore(state => state.openSideMenu);

  return (
    <div className="flex justify-between items-center p-4 ">
      {/* logo */}
      <Link href="/">
        <IoWalletOutline size={40} className="cursor-pointer" />
      </Link>

      {/* space selector */}

      <div className="flex-1 items-center justify-center flex">
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-light p-2 txt mx-5 rounded-xl w-full max-w-xl">
            Space selector
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Personal account</DropdownMenuItem>
            <DropdownMenuItem>Group 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex gap-3">
        {/* profile */}
        <Link href="/profile">
          <UserAvatar userName="David" />
        </Link>

        {/* menu */}

        <div onClick={openMenu} className="cursor-pointer">
          <IoMenu size={40} />
        </div>
      </div>
    </div>
  );
};
