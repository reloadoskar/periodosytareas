import { useEffect, useRef, useState } from "react";
import moment from "moment";

export default function Notificador({ currentPeriodo }) {
    const [notifications, setNotifications] = useState([]);
    const notificationsScheduled = useRef(false);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registrado con éxito:', registration);
                })
                .catch(error => {
                    console.log('Error al registrar el Service Worker:', error);
                });
        }
    }, []);

    const sendNotification = (title, body) => {
        if (!("Notification" in window && Notification.permission === "granted")) {
            new Notification(title, { body: body, icon: "/icon.png" });
        }
    }

    useEffect(() => {
        if (currentPeriodo) {
            const start = moment(currentPeriodo.inicio, "HH:mm:ss");
            const end = moment(currentPeriodo.final, "HH:mm:ss");
            const notifications = [
                { title: `Estas en el periodo: ${currentPeriodo.nombre}`, time: start.clone().add(10,'seconds') },
                { title: `10 minutos para finalizar el periodo: ${currentPeriodo.nombre}`, time: end.clone().subtract(10, 'minutes') },
                { title: `5 minutos para finalizar el periodo: ${currentPeriodo.nombre}`, time: end.clone().subtract(5, 'minutes') },
                { title: `Periodo finalizó: ${currentPeriodo.nombre}`, time: end.clone().subtract(5,'seconds') }
            ];
            setNotifications(notifications);
            notificationsScheduled.current = false;
            console.log(notifications);
            console.log(notificationsScheduled);
        }
    }, [currentPeriodo]);

    const scheduleNotifications = () => {
        console.log(notificationsScheduled.current);
        if (notificationsScheduled.current){
            console.log("Notificaciones ya programadas "+notificationsScheduled);
            return; // Avoid scheduling notifications multiple times
        } 
        console.log("Programando notificaciones");
        if (!("Notification" in window) || !("serviceWorker" in navigator)) {
            console.log("Notificaciones o Service Workers no son soportados en este navegador.");
            return;
        }

        Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
                console.log("Permiso de notificaciones denegado.");
                return;
            }

            navigator.serviceWorker.ready.then(registration => {
                const now = moment();
                notifications.forEach(notification => {
                    const delay = notification.time.diff(now);
                    if (delay > 0) {
                        setTimeout(() => {
                            registration.showNotification(notification.title, {
                                body: `Periodo: ${currentPeriodo.nombre}`,
                                icon: '/icon.png'
                            });
                        }, delay);
                    }
                });
                notificationsScheduled.current = true; // Set the flag to true after scheduling notifications
            });
        });
    };

    const testNotification = () => {
        if (!("Notification" in window) || !("serviceWorker" in navigator)) {
            console.log("Notificaciones o Service Workers no son soportados en este navegador.");
            return;
        }

        Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
                console.log("Permiso de notificaciones denegado.");
                return;
            }

            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification("Test Notification", {
                    body: "This is a test notification",
                    icon: '/icon.png'
                });
            }).catch((e) => console.log(e));
        });
    };

    useEffect(() => {
        scheduleNotifications();
    }, [notifications]);

    return (
        <div>
            {/* <button className="btn" onClick={testNotification}>test notif</button> */}
        </div>
    );
}
