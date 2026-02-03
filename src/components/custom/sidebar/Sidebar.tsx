"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui/ui-store";
import { useTranslations } from "next-intl";
import { SignOutButton } from "@clerk/nextjs";
import {
  IoAddOutline,
  IoCloseOutline,
  IoHomeOutline,
  IoListOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { Separator } from "@/components/ui/separator";
import { FiBarChart2, FiGrid, FiTrendingUp } from "react-icons/fi";

export const Sidebar = () => {
  const t = useTranslations("sidebar");
  const { isSideMenuOpen, closeSideMenu } = useUIStore((state) => state);

  return (
    <>
      {/* background */}
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black opacity-30"
          onClick={closeSideMenu}
        />
      )}

      <nav
        className={cn(
          "fixed p-5 right-0 top-0 w-full md:w-[500px] h-screen bg-light z-20 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto overflow-x-hidden",
          isSideMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div>
          <IoCloseOutline size={40} onClick={closeSideMenu} />
        </div>

        <Link
          onClick={closeSideMenu}
          href="/"
          className="flex items-center w-full  mb-2 mt-5 p-3 rounded gap-4"
        >
          <IoHomeOutline size={30} />
          <span className="text-xl w-full">{t("home")}</span>
        </Link>

        <Link
          onClick={closeSideMenu}
          href="/expense/list"
          className="flex items-center w-full my-2 p-3 rounded gap-4"
        >
          <IoListOutline size={30} />
          <span className="text-xl w-full">{t("expenses")}</span>
        </Link>

        {/* new expense */}
        <Link
          onClick={closeSideMenu}
          href="/expense/new"
          className="flex items-center w-full my-2 p-3 rounded gap-4"
        >
          <IoAddOutline size={30} />
          <span className="text-xl w-full">{t("newExpense")}</span>
        </Link>

        <Separator />

        <Link
          onClick={closeSideMenu}
          href="/expense/new"
          className="flex items-center w-full my-2 p-3 rounded gap-4"
        >
          <FiBarChart2 size={30} />
          <span className="text-xl w-full">{t("analytics")}</span>
        </Link>

        <Link
          onClick={closeSideMenu}
          href="/expense/new"
          className="flex items-center w-full my-2 p-3 rounded gap-4 ml-10"
        >
          <FiGrid size={30} />
          <span className="text-xl w-full">{t("resume")}</span>
        </Link>

        <Link
          onClick={closeSideMenu}
          href="/expense/new"
          className="flex items-center w-full my-2 p-3 rounded gap-4 ml-10"
        >
          <FiTrendingUp size={30} />
          <span className="text-xl w-full">{t("trends")}</span>
        </Link>

        <Separator />

        <Link
          onClick={closeSideMenu}
          href="/notifications"
          className="flex items-center w-full my-2 p-3 rounded gap-4"
        >
          <IoNotificationsOutline size={30} />
          <span className="text-xl w-full">{t("notifications")}</span>
        </Link>

        <Link
          onClick={closeSideMenu}
          href="/settings"
          className="flex items-center w-full my-2 p-3 rounded gap-4"
        >
          <IoSettingsOutline size={30} />
          <span className="text-xl w-full">{t("settings")}</span>
        </Link>

        <Separator />

        <SignOutButton>
          <div
            onClick={closeSideMenu}
            className="flex items-center w-full my-2 p-3 rounded gap-4 cursor-pointer"
          >
            <IoLogOutOutline size={30} />
            <span className="text-xl w-full">{t("signOut")}</span>
          </div>
        </SignOutButton>
      </nav>
    </>
  );
};
