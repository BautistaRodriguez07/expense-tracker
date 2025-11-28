export interface ExpenseInterface {
  id: number;
  space_id: number;
  name: string;
  description: string;
  amount: number;
  currency: string;
  date: Date;
  responsible_id: number;
  status: "pending" | "paid" | "cancelled";
  category_id: number;
  created_by: number;
  created_at: Date;
}
