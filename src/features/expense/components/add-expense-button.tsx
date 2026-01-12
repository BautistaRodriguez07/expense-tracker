import { Button } from "@/components/ui/button";
import { IoAddOutline } from "react-icons/io5";
import React from "react";
import { Link } from "@/i18n/navigation";

export const ExpenseButton = () => {
  return (
    <div className="absolute bottom-0 right-0 w-full h-full flex items-center justify-end sm:hidden">
      <Link href="/expense/new">
        <Button
          variant="outline"
          className="bottom-5 right-5 fixed rounded-full size-20"
        >
          <IoAddOutline className="size-8" />
        </Button>
      </Link>
    </div>
  );
};
