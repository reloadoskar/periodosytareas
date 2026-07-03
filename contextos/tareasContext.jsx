"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { getDateKey, groupTasksByDate, normalizeTask } from "@/utils/tareas";
import { useAuth } from "./authContext";

const tareasContext = createContext();

export const useTareas = () => useContext(tareasContext);

const useProvideTareas = () => {
  const { autenticado } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(getDateKey());

  const fetchTareas = useCallback(
    async (periodoId, dateKey = getDateKey()) => {
      setCurrentDate(dateKey);
      if (!autenticado || !periodoId) {
        setTareas([]);
        return [];
      }

      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({ periodoId, fecha: dateKey });
        const res = await fetch(`/api/tareas?${params.toString()}`);
        const data = await res.json();

        if (!res.ok || data.status !== "success") {
          throw new Error(data.error || "No se pudieron cargar las tareas");
        }

        const normalized = data.tareas.map((tarea) => normalizeTask(tarea));
        setTareas(normalized);
        return normalized;
      } catch (err) {
        setError(err.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [autenticado],
  );

  const fetchHistorial = useCallback(
    async (periodoId, todayKey = getDateKey()) => {
      if (!autenticado || !periodoId) {
        setHistorial([]);
        return [];
      }

      setHistoryLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          periodoId,
          fecha: todayKey,
          history: "true",
        });
        const res = await fetch(`/api/tareas?${params.toString()}`);
        const data = await res.json();

        if (!res.ok || data.status !== "success") {
          throw new Error(data.error || "No se pudo cargar el historial");
        }

        const grouped = groupTasksByDate(
          data.tareas.map((tarea) => normalizeTask(tarea)),
          todayKey,
        );
        setHistorial(grouped);
        return grouped;
      } catch (err) {
        setError(err.message);
        return [];
      } finally {
        setHistoryLoading(false);
      }
    },
    [autenticado],
  );

  const createTarea = async (periodoId, tarea, dateKey = currentDate) => {
    const res = await fetch("/api/tareas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tarea: normalizeTask(tarea, { periodoId, dateKey }),
      }),
    });
    const data = await res.json();

    if (!res.ok || data.status !== "success") {
      throw new Error(data.error || "Error creando tarea");
    }

    const created = normalizeTask(data.tarea);
    setTareas((current) => [...current, created]);
    return created;
  };

  const updateTarea = async (id, tarea) => {
    const res = await fetch("/api/tareas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, tarea }),
    });
    const data = await res.json();

    if (!res.ok || data.status !== "success") {
      throw new Error(data.error || "Error actualizando tarea");
    }

    const updated = normalizeTask(data.tarea);
    setTareas((current) =>
      current.map((tareaItem) => (tareaItem._id === id ? updated : tareaItem)),
    );
    return updated;
  };

  const reorderTarea = async (id, direction) => {
    const res = await fetch("/api/tareas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, direction }),
    });
    const data = await res.json();

    if (!res.ok || data.status !== "success") {
      throw new Error(data.error || "Error reordenando tarea");
    }

    const reordered = data.tareas.map((tarea) => normalizeTask(tarea));
    setTareas(reordered);
    return reordered;
  };

  const deleteTarea = async (id) => {
    const res = await fetch("/api/tareas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();

    if (!res.ok || data.status !== "success") {
      throw new Error(data.error || "Error eliminando tarea");
    }

    setTareas((current) => current.filter((tarea) => tarea._id !== id));
  };

  return {
    tareas,
    historial,
    loading,
    historyLoading,
    error,
    currentDate,
    fetchTareas,
    fetchHistorial,
    createTarea,
    updateTarea,
    reorderTarea,
    deleteTarea,
  };
};

export function ProvideTareas({ children }) {
  const tareas = useProvideTareas();
  return (
    <tareasContext.Provider value={tareas}>{children}</tareasContext.Provider>
  );
}
