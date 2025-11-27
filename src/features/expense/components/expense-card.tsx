// features/expense/components/expense-card.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { SerializedExpense } from "../utils/serialize-expense";
import Link from "next/link";

type ExpenseCardProps = {
  expense: SerializedExpense & {
    category: { id: number; name: string };
    paidBy: { id: number; name: string; email: string };
    createdBy: { id: number; name: string };
  };
};

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const formattedDate = new Date(expense.date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: expense.currency,
  }).format(expense.amount);

  return (
    <div className="card-container mb-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="txt text-xl font-semibold">{expense.name}</h3>
          <p className="txt-muted text-sm">
            Created by {expense.createdBy.name} · {formattedDate}
          </p>
        </div>
        <div className="text-right">
          <p className="txt text-2xl font-bold">{formattedAmount}</p>
          <Badge variant="outline" className="mt-1">
            {expense.category.name}
          </Badge>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Details */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="txt-muted">Responsible:</span>
          <span className="txt font-medium">{expense.paidBy.name}</span>
        </div>

        {expense.description && (
          <>
            <Separator className="my-2" />
            <div>
              <span className="txt-muted text-sm">Note:</span>
              <p className="txt text-sm mt-1">{expense.description}</p>
            </div>
          </>
        )}
      </div>

      <Separator className="my-4" />

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Link href={`/expense/${expense.id}`}>
          <Button variant="outline" size="sm" className="btn">
            View Details
          </Button>
        </Link>
        <Link href={`/expense/edit/${expense.id}`}>
          <Button size="sm" className="btn">
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
}
