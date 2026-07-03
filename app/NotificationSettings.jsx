import { useState } from "react";
import { FaBell } from "react-icons/fa";

const ALERT_OPTIONS = Array.from({ length: 11 }, (_, index) => index + 5);

export default function NotificationSettings({ settings, onChange }) {
  const [open, setOpen] = useState(false);

  const updateSetting = (key, value) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="fixed top-5 right-5 z-50">
      <button
        className="bg-gray-900 text-white p-2 rounded-full shadow-md"
        onClick={() => setOpen((current) => !current)}
        title="Opciones de notificaciones"
        type="button"
      >
        <FaBell size={24} />
      </button>

      {open ? (
        <div className="mt-3 w-72 rounded-xl border border-slate-700 bg-slate-950 p-4 text-gray-100 shadow-2xl">
          <h2 className="mb-3 font-bold uppercase">Notificaciones</h2>
          <label className="mb-3 flex items-center justify-between gap-3 text-sm">
            Activar notificaciones
            <input
              checked={settings.enabled}
              onChange={(event) =>
                updateSetting("enabled", event.target.checked)
              }
              type="checkbox"
            />
          </label>
          <label className="mb-3 flex items-center justify-between gap-3 text-sm">
            Notificaciones de periodos
            <input
              checked={settings.periodNotifications}
              disabled={!settings.enabled}
              onChange={(event) =>
                updateSetting("periodNotifications", event.target.checked)
              }
              type="checkbox"
            />
          </label>
          <label className="mb-3 flex items-center justify-between gap-3 text-sm">
            Notificaciones de tareas
            <input
              checked={settings.taskNotifications}
              disabled={!settings.enabled}
              onChange={(event) =>
                updateSetting("taskNotifications", event.target.checked)
              }
              type="checkbox"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Alerta antes de empezar/terminar periodo
            <select
              className="input"
              disabled={!settings.enabled || !settings.periodNotifications}
              onChange={(event) =>
                updateSetting("alertMinutes", Number(event.target.value))
              }
              value={settings.alertMinutes}
            >
              {ALERT_OPTIONS.map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} minutos antes
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}
    </div>
  );
}
