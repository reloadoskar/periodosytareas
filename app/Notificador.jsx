import moment from "moment";
import { useEffect, useRef } from "react";
import { normalizePeriodo } from "@/utils/periodos";

export default function Notificador({ currentPeriodo }) {
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
      !currentPeriodo ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      return undefined;
    }

    const periodo = normalizePeriodo(currentPeriodo);
    const start = moment(periodo.horaInicio, "HH:mm");
    const end = moment(periodo.horaFin, "HH:mm");
    if (end.isSameOrBefore(start)) end.add(1, "day");

    const notifications = [
      {
        title: `Estás en el periodo: ${periodo.nombre}`,
        time: start.clone().add(10, "seconds"),
      },
      {
        title: `10 minutos para finalizar el periodo: ${periodo.nombre}`,
        time: end.clone().subtract(10, "minutes"),
      },
      {
        title: `5 minutos para finalizar el periodo: ${periodo.nombre}`,
        time: end.clone().subtract(5, "minutes"),
      },
      {
        title: `Periodo finalizó: ${periodo.nombre}`,
        time: end.clone().subtract(5, "seconds"),
      },
    ];

    Notification.requestPermission().then((permission) => {
      if (permission !== "granted") return;

      navigator.serviceWorker.ready.then((registration) => {
        const now = moment();
        notifications.forEach((notification) => {
          const delay = notification.time.diff(now);
          if (delay > 0) {
            const timeoutId = setTimeout(() => {
              registration.showNotification(notification.title, {
                body: `Periodo: ${periodo.nombre}`,
                badge: "/icons/icon-192.png",
                icon: "/icons/icon-192.png",
                data: { url: "/" },
              });
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
  }, [currentPeriodo]);

  return null;
}
