import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DEFAULT_NOTIFICATION_SETTINGS,
  normalizeNotificationSettings,
} from "../utils/notificaciones.js";

describe("preferencias de notificación", () => {
  it("usa valores por defecto seguros", () => {
    assert.deepEqual(
      normalizeNotificationSettings(),
      DEFAULT_NOTIFICATION_SETTINGS,
    );
  });

  it("limita minutos de alerta entre 5 y 15", () => {
    assert.equal(
      normalizeNotificationSettings({ alertMinutes: 2 }).alertMinutes,
      5,
    );
    assert.equal(
      normalizeNotificationSettings({ alertMinutes: 20 }).alertMinutes,
      15,
    );
    assert.equal(
      normalizeNotificationSettings({ alertMinutes: 12 }).alertMinutes,
      12,
    );
  });

  it("respeta interruptores booleanos", () => {
    assert.deepEqual(
      normalizeNotificationSettings({
        enabled: false,
        periodNotifications: false,
        taskNotifications: true,
      }),
      {
        enabled: false,
        periodNotifications: false,
        taskNotifications: true,
        alertMinutes: 10,
      },
    );
  });
});
