export function translateNotification(
  t: (key: string, values?: Record<string, unknown>) => string,
  notification: {
    title: string;
    message: string;
    data?: Record<string, unknown>;
  },
) {
  return {
    title: t(notification.title, notification.data),
    message: t(notification.message, notification.data),
  };
}
