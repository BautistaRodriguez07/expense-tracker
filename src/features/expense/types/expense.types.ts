export interface ExpenseInterface {
  id: string;
  space_id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  date: Date;
  responsible_id: string;
  status: "pending" | "paid" | "cancelled" | "overdue";
  category_id: number;
  created_by: string;
  created_at: Date;
}
