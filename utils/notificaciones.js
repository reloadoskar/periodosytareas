export const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: true,
  periodNotifications: true,
  taskNotifications: true,
  alertMinutes: 10,
};

export function normalizeNotificationSettings(settings = {}) {
  const alertMinutes = Math.min(
    15,
    Math.max(
      5,
      Number(settings.alertMinutes) ||
        DEFAULT_NOTIFICATION_SETTINGS.alertMinutes,
    ),
  );

  return {
    enabled:
      typeof settings.enabled === "boolean"
        ? settings.enabled
        : DEFAULT_NOTIFICATION_SETTINGS.enabled,
    periodNotifications:
      typeof settings.periodNotifications === "boolean"
        ? settings.periodNotifications
        : DEFAULT_NOTIFICATION_SETTINGS.periodNotifications,
    taskNotifications:
      typeof settings.taskNotifications === "boolean"
        ? settings.taskNotifications
        : DEFAULT_NOTIFICATION_SETTINGS.taskNotifications,
    alertMinutes,
  };
}

export function canNotifyTasks(settings = {}) {
  const normalized = normalizeNotificationSettings(settings);
  return normalized.enabled && normalized.taskNotifications;
}

export function canNotifyPeriods(settings = {}) {
  const normalized = normalizeNotificationSettings(settings);
  return normalized.enabled && normalized.periodNotifications;
}
