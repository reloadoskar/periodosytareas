import moment from "moment";
import { useEffect, useRef } from "react";
import { canNotifyPeriods } from "@/utils/notificaciones";
import { normalizePeriodo } from "@/utils/periodos";

const showNotification = (registration, title, body) =>
  registration.showNotification(title, {
    body,
    badge: "/icons/icon-192.png",
    icon: "/icons/icon-192.png",
    data: { url: "/" },
  });

const getNextMoment = (timeValue, now) => {
  const next = moment(timeValue, "HH:mm");
  if (next.isSameOrBefore(now)) next.add(1, "day");
  return next;
};

export default function Notificador({
  currentPeriodo,
  periodos = [],
  settings,
}) {
  const timeouts = useRef([]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((error) => {
          console.log("Error al registrar el Service Worker:", error);
        });
    }
  }, []);

  useEffect(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    if (
      !canNotifyPeriods(settings) ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      return undefined;
    }

    Notification.requestPermission().then((permission) => {
      if (permission !== "granted") return;

      navigator.serviceWorker.ready.then((registration) => {
        const now = moment();
        const alertMinutes = settings.alertMinutes;
        const periodosNormalizados = periodos.map(normalizePeriodo);
        const notifications = [];

        if (currentPeriodo) {
          const periodo = normalizePeriodo(currentPeriodo);
          const start = moment(periodo.horaInicio, "HH:mm");
          const end = moment(periodo.horaFin, "HH:mm");
          if (end.isSameOrBefore(start)) end.add(1, "day");
          if (end.isSameOrBefore(now)) end.add(1, "day");

          notifications.push({
            title: `${alertMinutes} minutos para finalizar el periodo: ${periodo.nombre}`,
            body: `Periodo: ${periodo.nombre}`,
            time: end.clone().subtract(alertMinutes, "minutes"),
          });
        }

        periodosNormalizados.forEach((periodo) => {
          const start = getNextMoment(periodo.horaInicio, now);
          notifications.push({
            title: `${alertMinutes} minutos para empezar el periodo: ${periodo.nombre}`,
            body: `Periodo: ${periodo.nombre}`,
            time: start.clone().subtract(alertMinutes, "minutes"),
          });
        });

        notifications.forEach((notification) => {
          const delay = notification.time.diff(now);
          if (delay > 0) {
            const timeoutId = setTimeout(() => {
              showNotification(
                registration,
                notification.title,
                notification.body,
              );
            }, delay);
            timeouts.current.push(timeoutId);
          }
        });
      });
    });

    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, [currentPeriodo, periodos, settings]);

  return null;
}
