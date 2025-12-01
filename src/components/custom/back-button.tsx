"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoChevronBackOutline } from "react-icons/io5";

export function BackButton() {
  const router = useRouter();

  return (
    <Button className="btn" onClick={() => router.back()}>
      <IoChevronBackOutline className="w-5 h-5" />
    </Button>
  );
}
