import type { AbstractIntlMessages } from "next-intl";

/**
 * Translates a space name based on the current locale messages
 * @param spaceName - The original space name in English from the database
 * @param messages - The i18n messages object from next-intl
 * @returns The translated space name or the original if no translation exists
 */
export function translateSpace(
  spaceName: string,
  messages: AbstractIntlMessages
): string {
  // Check if spaces translations exist
  const spaces = messages?.spaces as Record<string, string> | undefined;

  if (!spaces) {
    return spaceName;
  }

  // Return the translated space name or fallback to the original name
  return spaces[spaceName] || spaceName;
}
