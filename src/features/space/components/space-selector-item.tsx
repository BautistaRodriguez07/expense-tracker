"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { switchWorkspace } from "../actions/switch-workspace.action";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  spaceId: string;
  spaceName: string;
  isDisabled?: boolean;
};

export const SpaceSelectorItem = (props: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (props.isDisabled || isLoading) return;

    setIsLoading(true);
    const result = await switchWorkspace(props.spaceId);

    if (result.success) {
      router.refresh();
    } else {
      console.error("Failed to switch workspace:", result.error);
    }

    setIsLoading(false);
  };

  return (
    <DropdownMenuItem
      onClick={handleClick}
      disabled={props.isDisabled || isLoading}
      className="cursor-pointer"
    >
      {isLoading ? "Switching..." : props.spaceName}
    </DropdownMenuItem>
  );
};
