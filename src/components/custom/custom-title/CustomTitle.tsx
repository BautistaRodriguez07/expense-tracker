import { cn } from "@/lib/utils";
import { JSX } from "react";

interface Props {
  title: string;
  tag?: keyof JSX.IntrinsicElements;
  className: string;
}

export const CustomTitle = ({ tag = "h1", title, className = "" }: Props) => {
  const Tag = tag;
  const baseClass = cn("font-bold text-3xl", className);

  return <Tag className={baseClass}>{title}</Tag>;
};
