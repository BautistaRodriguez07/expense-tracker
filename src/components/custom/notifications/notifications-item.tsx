import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type NotificationsItemProps = {
  userName: string;
  userImageUrl?: string;
  message: string;
  badge?: string;
  date: string;
  time: string;
  isRead?: boolean;
};

export const NotificationsItem = (props: NotificationsItemProps) => {
  return (
    <div className="flex gap-3 items-start card-container max-w-3xl p-3">
      {/* avatar */}
      <div className="flex-shrink-0">
        <Avatar className="border-gray-300 border dark:border-0">
          <AvatarImage src={props.userImageUrl} />
          <AvatarFallback>{props.userName.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </div>

      {/* content */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {/* name and message */}
        <div className="flex flex-col gap-0.5">
          <p className="font-medium txt text-sm">
            <span className="font-semibold">{props.userName}</span>{" "}
            <span className="txt-muted">{props.message}</span>
          </p>
        </div>

        {/* badge and date and time */}
        <div className="flex gap-2 items-center flex-wrap">
          {props.badge && (
            <Badge variant="outline" className="text-xs">
              {props.badge}
            </Badge>
          )}

          <div className="flex gap-1.5 items-center">
            <span className="font-medium txt-muted text-xs">{props.date}</span>
            <span className="txt-muted text-xs">•</span>
            <span className="font-medium txt-muted text-xs">{props.time}</span>
          </div>
        </div>
      </div>

      {/* unread indicator */}
      {!props.isRead && (
        <div className="flex-shrink-0 pt-1">
          <div className="size-2 bg-red-500 dark:bg-red-400 rounded-full" />
        </div>
      )}
    </div>
  );
};
