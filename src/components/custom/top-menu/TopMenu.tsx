"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

import {
  IoMenu,
  IoPersonCircleOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { useUIStore } from "@/store/ui/ui-store";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
// import { ExpensoLogo } from "../logos/ExpensoLogo";

export const TopMenu = () => {
  const openMenu = useUIStore(state => state.openSideMenu);

  return (
    <div className="flex justify-between items-center p-4 ">
      {/* logo */}
      <IoWalletOutline size={40} />

      {/* space selector */}

      <div className="flex-1 items-center justify-center flex">
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-gray-100 p-2 mx-5 rounded-xl w-full max-w-xl">
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

        {/* <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar> */}

        {/* menu */}

        <div onClick={openMenu}>
          <IoMenu size={40} />
        </div>
      </div>
    </div>
  );
};
