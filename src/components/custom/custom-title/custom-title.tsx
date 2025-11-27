import { cn } from "@/lib/utils";

interface Props {
  title: string;
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
}

export const CustomTitle = ({ tag, title, className = "" }: Props) => {
  const Tag = tag;
  const baseClass = cn("font-bold text-3xl txt", className);

  return <Tag className={baseClass}>{title}</Tag>;
};
