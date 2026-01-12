"use server";

import { cache } from "react";
import prisma from "@/lib/prisma";
import type { Category } from "@prisma/client";

export const getCategories = cache(async (): Promise<Category[]> => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
});
