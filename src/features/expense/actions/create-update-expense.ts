'use server';

import { BaseExpenseType, CreateExpenseType, UpdateExpenseType } from "@/schema/NewExpenseSchema";
import { z } from "zod";

export function CreateExpense(expense: CreateExpenseType, spaceId: string): Promise<BaseExpenseType> {
    // get user from session
    
    // Validate expense data against schema
    z.safeParse(expense);
    
    // 1. is user authenticated?
    -> No -> Throw new Error('User not authenticated');

    // 2. si el usuario pertenece al space?

    // 3. User has permission: 
    -> Invalid -> Throw new Error('Invalid expense data');

    // 4. Create expense in DB

    // 5. return created expense

}

export function updateExpense(expense: UpdateExpenseType, spaceId: string): Promise<BaseExpenseType> {
    // get user from session

    // 1. is user authenticated?

    // 2. si el usuario pertenece al space?

    // 3. Validar que el gasto existe

    // 4. User has permission: (solo podes editar si sos el creador o un admin o el responsable asignado)
}