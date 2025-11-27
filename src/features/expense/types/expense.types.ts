export interface ExpenseInterface {
  id: number;
  space_id: number;
  name: string;
  description: string;
  amount: number;
  currency: string;
  date: Date;
  paid_by: number;
  category_id: number;
  created_by: number;
  created_at: Date;
}
