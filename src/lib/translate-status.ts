import type { AbstractIntlMessages } from "next-intl";

/**
 * Translates a status name based on the current locale messages
 * @param statusName - The original status name in English from the database
 * @param messages - The i18n messages object from next-intl
 * @returns The translated status name or the original if no translation exists
 */
export function translateStatus(
  statusName: string,
  messages: AbstractIntlMessages
): string {
  // Check if statuses translations exist
  const statuses = messages?.statuses as Record<string, string> | undefined;

  if (!statuses) {
    return statusName;
  }

  // Return the translated status or fallback to the original name
  return statuses[statusName] || statusName;
}
