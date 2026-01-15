import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { IoNotifications } from "react-icons/io5";
import { NotificationsBadge } from "./notifications-badge";

export const NotificationsBell = () => {
  return (
    // dropdown menu
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        <IoNotifications size={30} />
        <NotificationsBadge count={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="card-container">
        <DropdownMenuItem>
          <Link
            className="flex items-start flex-col cursor-pointer"
            href="/notifications"
          >
            <span className="font-medium txt">Notification 1</span>
            <span className="text-xs txt-muted">12:00</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link className="link underline font-medium" href="/notifications">
            View More
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
