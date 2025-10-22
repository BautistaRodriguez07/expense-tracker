import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  userName: string;
  title?: string;
  legend?: string;
  imageUrl?: string;
}

export const UserAvatar = ({ userName, legend, imageUrl, title }: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 p-1">
        <Avatar className="border-gray-300 border">
          <AvatarImage src={`${imageUrl ?? userName.slice(0, 2)} `} />
          <AvatarFallback>{userName.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{title}</span>
      </div>

      <span className="text-gray-700 ml-2">{legend}</span>
    </div>
  );
};
