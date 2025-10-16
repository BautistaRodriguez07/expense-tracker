"use client";

import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui/ui-store";
import Link from "next/link";
import { IoCloseOutline, IoPersonOutline } from "react-icons/io5";

export const Sidebar = () => {
  const isMenuOpen = useUIStore(state => state.isSideMenuOpen);
  const closeMenu = useUIStore(state => state.closeSideMenu);
  return (
    <div>
      {/* background */}
      {isMenuOpen && (
        <div
          className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"
          onClick={closeMenu}
        />
      )}

      <nav
        className={cn(
          "fixed p-5 right-0 top-0 w-full md:w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div>
          <IoCloseOutline size={40} onClick={closeMenu} />
        </div>

        <Link
          href="/"
          className="flex items-center w-full hover:bg-gray-200 my-5 p-3 rounded gap-4"
        >
          <IoPersonOutline size={30} />
          <span className="text-xl">Profile</span>
        </Link>
      </nav>
    </div>
  );
};
