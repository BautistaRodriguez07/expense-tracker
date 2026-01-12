import type { AbstractIntlMessages } from "next-intl";

/**
 * Translates a category name based on the current locale messages
 * @param categoryName - The original category name in English from the database
 * @param messages - The i18n messages object from next-intl
 * @returns The translated category name or the original if no translation exists
 */
export function translateCategory(
  categoryName: string,
  messages: AbstractIntlMessages
): string {
  // Check if categories translations exist
  const categories = messages?.categories as Record<string, string> | undefined;

  if (!categories) {
    return categoryName;
  }

  // Return the translated category or fallback to the original name
  return categories[categoryName] || categoryName;
}
