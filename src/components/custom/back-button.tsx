"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoChevronBackOutline } from "react-icons/io5";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      className="rounded-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white text-black bg-gray-100 hover:bg-white"
      onClick={() => router.back()}
    >
      <IoChevronBackOutline className="w-5 h-5" />
    </Button>
  );
}
