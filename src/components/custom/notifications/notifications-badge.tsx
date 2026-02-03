import { Badge } from "@/components/ui/badge";

export const NotificationsBadge = ({ count }: { count: number }) => {
  return (
    <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums bg-red-500 dark:bg-red-400 text-white absolute -top-2 -right-2">
      {count}
    </Badge>
  );
};
