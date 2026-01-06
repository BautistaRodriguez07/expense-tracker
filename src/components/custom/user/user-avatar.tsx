import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  userName: string;
  categoryName?: string;
  imageUrl?: string;
}

export const UserAvatar = ({ userName, categoryName, imageUrl }: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 p-1">
        <Avatar className="border-gray-300 border dark:border-0 txt">
          <AvatarImage src={`${imageUrl ?? userName.slice(0, 2)} `} />
          <AvatarFallback>{userName.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{userName}</span>
      </div>

      <span className="txt-muted ml-2">{categoryName}</span>
    </div>
  );
};
