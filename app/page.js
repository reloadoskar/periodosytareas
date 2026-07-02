"use client";

import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useAuth } from "@/contextos/authContext";
import { usePeriodos } from "@/contextos/periodosContext";
import {
  getCurrentPeriodo,
  normalizePeriodo,
  reorderItem,
  updatePeriodoTask,
} from "@/utils/periodos";
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
  const {
    periodos,
    loading: periodosLoading,
    error,
    updatePeriodo,
  } = usePeriodos();
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm"));
  const [showPeriodosMenu, setShowPeriodosMenu] = useState(false);

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

  const persistCurrentPeriodo = async (updatedPeriodo) => {
    if (!updatedPeriodo?._id) return;
    await updatePeriodo(updatedPeriodo._id, updatedPeriodo);
  };

  const handleAddTarea = async (nuevaTarea) => {
    if (nuevaTarea.nombre.trim() === "" || !currentPeriodo) return;

    const add = new Audio("/sounds/add.mp3");
    add.play();

    await persistCurrentPeriodo({
      ...normalizePeriodo(currentPeriodo),
      tareas: [...(currentPeriodo.tareas || []), nuevaTarea],
    });
  };

  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);
    audio.play();
  };

  const handleDeleteTarea = async (index) => {
    if (!currentPeriodo) return;

    playSound("/sounds/task-delete.wav");

    await persistCurrentPeriodo({
      ...normalizePeriodo(currentPeriodo),
      tareas: (currentPeriodo.tareas || []).filter((_, i) => i !== index),
    });
  };

  const handleToggleCompleteTarea = async (index) => {
    if (!currentPeriodo) return;

    const task = currentPeriodo.tareas?.[index];
    playSound(
      task && !task.completed
        ? "/sounds/task-complete.wav"
        : "/sounds/task-reopen.wav",
    );

    await persistCurrentPeriodo(
      updatePeriodoTask(currentPeriodo, index, (tarea) => ({
        ...tarea,
        completed: !tarea.completed,
        completedTime: !tarea.completed ? new Date() : null,
      })),
    );
  };

  const handleMoveTarea = async (index, direction) => {
    if (!currentPeriodo) return;

    const nextTareas = reorderItem(
      currentPeriodo.tareas || [],
      index,
      direction,
    );
    if (nextTareas === (currentPeriodo.tareas || [])) return;

    playSound(direction < 0 ? "/sounds/task-up.wav" : "/sounds/task-down.wav");

    await persistCurrentPeriodo({
      ...normalizePeriodo(currentPeriodo),
      tareas: nextTareas,
    });
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

            {currentPeriodo
              ? <div className="w-3/4 m-auto">
                  <h1 className="ttlbig">{currentPeriodo.nombre}</h1>
                  <ProgressBar currentPeriodo={currentPeriodo} />
                </div>
              : <div className="titulo">
                  {"<--Crea un periodo para empezar a trabajar con tareas"}
                </div>}

            <Tareas
              currentPeriodo={currentPeriodo}
              tareas={currentPeriodo?.tareas || []}
              handleDeleteTarea={handleDeleteTarea}
              handleToggleCompleteTarea={handleToggleCompleteTarea}
              handleMoveTarea={handleMoveTarea}
            />

            <CrearTarea
              handleAddTarea={handleAddTarea}
              currentPeriodo={currentPeriodo}
            />
          </>
        : <Login />}
    </div>
  );
}
