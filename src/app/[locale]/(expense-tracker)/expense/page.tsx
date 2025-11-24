"use client";

import { CustomTitle } from "@/components";
import { ExpenseForm } from "./ExpenseForm";

export default function ExpensePage() {
  return (
    <div className=" flex flex-col items-center justify-center">
      <CustomTitle tag="h1" title="Create new expense" className="py-3" />
      <div className="max-w-3xl w-full">
        <ExpenseForm />
      </div>
    </div>
  );
}
