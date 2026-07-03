"use client";

import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useAuth } from "@/contextos/authContext";
import { usePeriodos } from "@/contextos/periodosContext";
import { useTareas } from "@/contextos/tareasContext";
import { getCurrentPeriodo, normalizePeriodo } from "@/utils/periodos";
import { getDateKey } from "@/utils/tareas";
import CrearTarea from "./CrearTarea";
import Login from "./Login";
import Nav from "./Nav";
import Notificador from "./Notificador";
import ProgressBar from "./ProgressBar";
import Reloj from "./Reloj";
import Tareas from "./Tareas";

moment.locale("es");

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
  const todayKey = getDateKey();

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
  const backgroundColor = currentPeriodo?.color ?? "#3d3d3d";

  useEffect(() => {
    if (!autenticado || !currentPeriodo?._id) return;

    fetchTareas(currentPeriodo._id, todayKey);
    fetchHistorial(currentPeriodo._id, todayKey);
  }, [autenticado, currentPeriodo?._id, fetchHistorial, fetchTareas, todayKey]);

  const handleAddTarea = async (nuevaTarea) => {
    if (nuevaTarea.nombre.trim() === "" || !currentPeriodo?._id) return;

    const add = new Audio("/sounds/add.mp3");
    add.play();

    await createTarea(currentPeriodo._id, nuevaTarea, todayKey);
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

  const handleToggleCompleteTarea = async (tarea) => {
    if (!tarea?._id) return;

    playSound(
      !tarea.completed
        ? "/sounds/task-complete.wav"
        : "/sounds/task-reopen.wav",
    );

    await updateTarea(tarea._id, {
      ...tarea,
      completed: !tarea.completed,
      completedTime: !tarea.completed ? new Date() : null,
    });
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
        ? <button
            className="fixed top-5 left-5 z-50 bg-gray-900 text-white p-2 rounded-full shadow-md"
            onClick={() => setShowPeriodosMenu(true)}
            type="button"
          >
            <FaBars size={24} />
          </button>
        : null}

      {autenticado
        ? <>
            <Nav
              showPeriodosMenu={showPeriodosMenu}
              setShowPeriodosMenu={setShowPeriodosMenu}
              currentPeriodo={currentPeriodo}
            />
            <Notificador currentPeriodo={currentPeriodo} />
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
              handleToggleCompleteTarea={handleToggleCompleteTarea}
              handleMoveTarea={handleMoveTarea}
            />

            <CrearTarea
              handleAddTarea={handleAddTarea}
              currentPeriodo={currentPeriodo}
            />

            <section className="mx-auto mt-8 max-w-2xl rounded-xl bg-slate-900/80 p-4 text-gray-100 shadow-xl">
              <h2 className="titulo mb-3">Historial de tareas</h2>
              {historyLoading ? <p>Cargando historial...</p> : null}
              {!historyLoading && historial.length === 0
                ? <p className="text-sm text-slate-300">
                    Aún no hay tareas de días anteriores para este periodo.
                  </p>
                : null}
              <div className="flex flex-col gap-4">
                {historial.map((grupo) => (
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
