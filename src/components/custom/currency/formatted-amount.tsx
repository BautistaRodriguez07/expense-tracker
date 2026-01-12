import { cn } from "@/lib/utils";

interface FormattedAmountProps {
  amount: number;
  currency: string;
  locale: string;
  className?: string;
}

export const FormattedAmount = ({
  amount,
  currency,
  locale,
  className,
}: FormattedAmountProps) => {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

  return <span className={cn("tabular-nums", className)}>{formatted}</span>;
};
