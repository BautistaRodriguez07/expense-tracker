"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui/ui-store";
// import { useTranslations } from "next-intl";
import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import {
  IoCloseOutline,
  IoHomeOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoSettingsOutline,
} from "react-icons/io5";

export const Sidebar = () => {
  const t = useTranslations("sidebar");
  const { isSideMenuOpen, closeSideMenu } = useUIStore(state => state);
  const { isSignedIn } = useAuth();

  return (
    <>
      {/* background */}
      {isSideMenuOpen && (
        <div
          className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"
          onClick={closeSideMenu}
        />
      )}

      <nav
        className={cn(
          "fixed p-5 right-0 top-0 w-full md:w-[500px] h-screen bg-light z-20 shadow-2xl transform transition-transform duration-300 ease-in-out",
          isSideMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div>
          <IoCloseOutline size={40} onClick={closeSideMenu} />
        </div>

        {/* if is singed in */}

        {isSignedIn && (
          <>
            <Link
              onClick={closeSideMenu}
              href="/"
              className="flex items-center w-full  my-5 p-3 rounded gap-4"
            >
              <IoHomeOutline size={30} />
              <span className="text-xl w-full">{t("home")}</span>
            </Link>

            <Link
              onClick={closeSideMenu}
              href="/settings"
              className="flex items-center w-full my-5 p-3 rounded gap-4"
            >
              <IoSettingsOutline size={30} />
              <span className="text-xl w-full">{t("settings")}</span>
            </Link>

            <div
              onClick={closeSideMenu}
              className="flex items-center w-full my-5 p-3 rounded gap-4 cursor-pointer"
            >
              <IoLogOutOutline size={30} />
              <span className="text-xl w-full">
                <SignOutButton />
              </span>
            </div>
          </>
        )}
        {!isSignedIn && (
          <div
            onClick={closeSideMenu}
            className="flex items-center w-full my-5 p-3 rounded gap-4 cursor-pointer"
          >
            <IoLogInOutline size={30} />
            <span className="text-xl w-full">
              <SignInButton />
            </span>
          </div>
        )}
      </nav>
    </>
  );
};
