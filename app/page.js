"use client";

import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { FaBars, FaDownload } from "react-icons/fa";
import { useAuth } from "@/contextos/authContext";
import { usePeriodos } from "@/contextos/periodosContext";
import { useTareas } from "@/contextos/tareasContext";
import {
  canNotifyTasks,
  DEFAULT_NOTIFICATION_SETTINGS,
  normalizeNotificationSettings,
} from "@/utils/notificaciones";
import { getCurrentPeriodo, normalizePeriodo } from "@/utils/periodos";
import {
  filterHistoryByCompleted,
  getDateKey,
  updateTaskName,
} from "@/utils/tareas";
import Login from "./Login";
import Nav from "./Nav";
import Notificador from "./Notificador";
import NotificationSettings from "./NotificationSettings";
import ProgressBar from "./ProgressBar";
import Reloj from "./Reloj";
import CrearTarea from "./tareas/CrearTarea";
import Tareas from "./tareas/Tareas";

moment.locale("es");

const NOTIFICATION_SETTINGS_KEY = "periodos-tareas-notification-settings";

const getStoredNotificationSettings = () => {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATION_SETTINGS;

  try {
    return normalizeNotificationSettings(
      JSON.parse(
        window.localStorage.getItem(NOTIFICATION_SETTINGS_KEY) || "{}",
      ),
    );
  } catch (_error) {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
};

const showTaskNotification = async (settings, title, body) => {
  if (!canNotifyTasks(settings) || !("Notification" in window)) return;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const options = {
    body,
    badge: "/icons/icon-192.png",
    icon: "/icons/icon-192.png",
    data: { url: "/" },
  };

  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, options);
    return;
  }

  new Notification(title, options);
};

export default function Page() {
  const { autenticado, loading: authLoading } = useAuth();
  const { periodos, loading: periodosLoading, error } = usePeriodos();
  const {
    tareas,
    historial,
    loading: tareasLoading,
    historyLoading,
    error: tareasError,
    fetchTareas,
    fetchHistorial,
    createTarea,
    updateTarea,
    reorderTarea,
    deleteTarea,
  } = useTareas();
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm"));
  const [showPeriodosMenu, setShowPeriodosMenu] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState(
    DEFAULT_NOTIFICATION_SETTINGS,
  );
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showCompletedHistoryTasks, setShowCompletedHistoryTasks] =
    useState(true);
  const todayKey = getDateKey();

  useEffect(() => {
    setNotificationSettings(getStoredNotificationSettings());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      NOTIFICATION_SETTINGS_KEY,
      JSON.stringify(notificationSettings),
    );
  }, [notificationSettings]);

  useEffect(() => {
    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    const updateInstalledState = () => {
      setIsInstalled(
        standaloneQuery.matches || window.navigator.standalone === true,
      );
    };
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };

    updateInstalledState();
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    standaloneQuery.addEventListener("change", updateInstalledState);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      standaloneQuery.removeEventListener("change", updateInstalledState);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentTime(moment().format("HH:mm")),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  const currentPeriodo = useMemo(
    () => getCurrentPeriodo(periodos, currentTime),
    [periodos, currentTime],
  );
  const filteredHistorial = useMemo(
    () => filterHistoryByCompleted(historial, showCompletedHistoryTasks),
    [historial, showCompletedHistoryTasks],
  );
  const backgroundColor = currentPeriodo?.color ?? "#3d3d3d";

  useEffect(() => {
    if (!autenticado || !currentPeriodo?._id) return;

    fetchTareas(currentPeriodo._id, todayKey);
    fetchHistorial(currentPeriodo._id, todayKey);
  }, [autenticado, currentPeriodo?._id, fetchHistorial, fetchTareas, todayKey]);

  const handleInstallApp = async () => {
    if (!installPrompt) {
      window.alert(
        "Si tu navegador no muestra el instalador, usa la opción 'Agregar a pantalla principal' del menú del navegador.",
      );
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setIsInstalled(true);
    setInstallPrompt(null);
  };

  const handleAddTarea = async (nuevaTarea) => {
    if (nuevaTarea.nombre.trim() === "" || !currentPeriodo?._id) return;

    const add = new Audio("/sounds/add.wav");
    add.play();

    const created = await createTarea(currentPeriodo._id, nuevaTarea, todayKey);
    await showTaskNotification(
      notificationSettings,
      "Tarea creada",
      created.nombre,
    );
  };

  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);
    audio.play();
  };

  const handleDeleteTarea = async (tareaId) => {
    if (!tareaId) return;

    playSound("/sounds/task-delete.wav");
    await deleteTarea(tareaId);
  };

  const handleEditTarea = async (tarea, nombre) => {
    const updated = updateTaskName(tarea, nombre);
    if (!updated.nombre) return;

    await updateTarea(tarea._id, updated);
    await showTaskNotification(
      notificationSettings,
      "Tarea actualizada",
      updated.nombre,
    );
  };

  const handleToggleCompleteTarea = async (tarea) => {
    if (!tarea?._id) return;

    playSound(
      !tarea.completed
        ? "/sounds/task-complete.wav"
        : "/sounds/task-reopen.wav",
    );

    const updated = await updateTarea(tarea._id, {
      ...tarea,
      completed: !tarea.completed,
      completedTime: !tarea.completed ? new Date() : null,
    });
    await showTaskNotification(
      notificationSettings,
      updated.completed ? "Tarea completada" : "Tarea reabierta",
      updated.nombre,
    );
  };

  const handleMoveTarea = async (tareaId, direction) => {
    if (!tareaId) return;

    playSound(direction < 0 ? "/sounds/task-up.wav" : "/sounds/task-down.wav");
    await reorderTarea(tareaId, direction);
  };

  if (authLoading) return null;

  return (
    <div
      className="min-h-screen p-5"
      style={{ backgroundColor, transition: "background-color 6s" }}
    >
      {!showPeriodosMenu && autenticado
        ? <div className="fixed top-5 left-5 z-50 flex gap-3">
            <button
              className="bg-gray-900 text-white p-2 rounded-full shadow-md"
              onClick={() => setShowPeriodosMenu(true)}
              type="button"
            >
              <FaBars size={24} />
            </button>
            {!isInstalled
              ? <button
                  className="bg-gray-900 text-white p-2 rounded-full shadow-md"
                  onClick={handleInstallApp}
                  title="Instalar app"
                  type="button"
                >
                  <FaDownload size={24} />
                </button>
              : null}
          </div>
        : null}

      {autenticado
        ? <>
            <Nav
              showPeriodosMenu={showPeriodosMenu}
              setShowPeriodosMenu={setShowPeriodosMenu}
              currentPeriodo={currentPeriodo}
            />
            <NotificationSettings
              onChange={(settings) =>
                setNotificationSettings(normalizeNotificationSettings(settings))
              }
              settings={notificationSettings}
            />
            <Notificador
              currentPeriodo={currentPeriodo}
              periodos={periodos}
              settings={notificationSettings}
            />
            <div className="text-slate-950 text-center md:text-right md:pr-28 pr-5">
              <Reloj />
            </div>

            {periodosLoading
              ? <p className="text-center text-white">Cargando periodos...</p>
              : null}
            {error ? <p className="text-center text-red-500">{error}</p> : null}
            {tareasError
              ? <p className="text-center text-red-500">{tareasError}</p>
              : null}

            {currentPeriodo
              ? <div className="w-3/4 m-auto">
                  <h1 className="ttlbig">{currentPeriodo.nombre}</h1>
                  <ProgressBar
                    currentPeriodo={normalizePeriodo(currentPeriodo)}
                  />
                </div>
              : <div className="titulo">
                  {"<--Crea un periodo para empezar a trabajar con tareas"}
                </div>}

            {tareasLoading
              ? <p className="text-center text-white">Cargando tareas...</p>
              : null}
            <Tareas
              currentPeriodo={currentPeriodo}
              tareas={tareas}
              handleDeleteTarea={handleDeleteTarea}
              handleEditTarea={handleEditTarea}
              handleToggleCompleteTarea={handleToggleCompleteTarea}
              handleMoveTarea={handleMoveTarea}
            />

            <CrearTarea
              handleAddTarea={handleAddTarea}
              currentPeriodo={currentPeriodo}
            />

            <section className="mx-auto mt-8 max-w-2xl rounded-xl bg-slate-900/80 p-4 text-gray-100 shadow-xl">
              <div className="mb-4 flex flex-col gap-4 border-b border-slate-700 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="titulo mb-1">Historial de tareas</h2>
                  <p className="text-sm text-slate-300">
                    Ajusta qué tareas aparecen en los días anteriores.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Filtros
                  </p>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-100">
                    <span>Mostrar completadas</span>
                    <button
                      aria-checked={showCompletedHistoryTasks}
                      aria-label="Mostrar tareas completadas en el historial"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                        showCompletedHistoryTasks
                          ? "bg-blue-500"
                          : "bg-slate-600"
                      }`}
                      onClick={() =>
                        setShowCompletedHistoryTasks(
                          (currentValue) => !currentValue,
                        )
                      }
                      role="switch"
                      type="button"
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          showCompletedHistoryTasks
                            ? "translate-x-5"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              {historyLoading ? <p>Cargando historial...</p> : null}
              {!historyLoading && historial.length === 0
                ? <p className="text-sm text-slate-300">
                    Aún no hay tareas de días anteriores para este periodo.
                  </p>
                : null}
              {!historyLoading &&
              historial.length > 0 &&
              filteredHistorial.length === 0
                ? <p className="text-sm text-slate-300">
                    No hay tareas para mostrar con los filtros activos.
                  </p>
                : null}
              <div className="flex flex-col gap-4">
                {filteredHistorial.map((grupo) => (
                  <div key={grupo.fecha}>
                    <h3 className="font-bold text-blue-200">{grupo.fecha}</h3>
                    <ul className="mt-2 flex flex-col gap-1">
                      {grupo.tareas.map((tarea) => (
                        <li
                          className={`rounded-md bg-slate-800 px-3 py-2 ${
                            tarea.completed ? "line-through opacity-70" : ""
                          }`}
                          key={tarea._id}
                        >
                          {tarea.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </>
        : <Login />}
    </div>
  );
}
