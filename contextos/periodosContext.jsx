"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { normalizePeriodo } from "@/utils/periodos";
import { useAuth } from "./authContext";

const periodosContext = createContext();

export const usePeriodos = () => useContext(periodosContext);

const initialPeriodo = () => ({
  nombre: "",
  horaInicio: "",
  horaFin: "",
  color: "#3d3d3d",
  horas: 0,
  fecha: new Date(),
  tareas: [],
});

const useProvidePeriodos = () => {
  const { autenticado } = useAuth();
  const [periodos, setPeriodos] = useState([]);
  const [currentPeriodoDraft, setCurrentPeriodoDraft] = useState(
    initialPeriodo(),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPeriodos = useCallback(async () => {
    if (!autenticado) {
      setPeriodos([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/periodos");
      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.error || "No se pudieron cargar los periodos");
      }

      setPeriodos(data.periodos.map(normalizePeriodo));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [autenticado]);

  useEffect(() => {
    fetchPeriodos();
  }, [fetchPeriodos]);

  const createPeriodo = async (periodo) => {
    const normalized = normalizePeriodo(periodo);
    const res = await fetch("/api/periodos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ periodo: normalized }),
    });
    const data = await res.json();

    if (!res.ok || data.status !== "success") {
      throw new Error(data.error || "Error creando periodo");
    }

    const created = normalizePeriodo(data.periodo);
    setPeriodos((current) => [...current, created]);
    setCurrentPeriodoDraft(initialPeriodo());
    return created;
  };

  const updatePeriodo = async (id, periodo) => {
    const normalized = normalizePeriodo(periodo);
    const res = await fetch("/api/periodos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, periodo: normalized }),
    });
    const data = await res.json();

    if (!res.ok || data.status !== "success") {
      throw new Error(data.error || "Error actualizando periodo");
    }

    const updated = normalizePeriodo(data.periodo);
    setPeriodos((current) =>
      current.map((periodoItem) =>
        periodoItem._id === id ? updated : periodoItem,
      ),
    );
    return updated;
  };

  const deletePeriodo = async (id) => {
    const res = await fetch("/api/periodos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();

    if (!res.ok || data.status !== "success") {
      throw new Error(data.error || "Error eliminando periodo");
    }

    setPeriodos((current) => current.filter((periodo) => periodo._id !== id));
  };

  return {
    periodos,
    setPeriodos,
    currentPeriodoDraft,
    setCurrentPeriodoDraft,
    loading,
    error,
    fetchPeriodos,
    createPeriodo,
    updatePeriodo,
    deletePeriodo,
  };
};

export function ProvidePeriodos({ children }) {
  const periodos = useProvidePeriodos();
  return (
    <periodosContext.Provider value={periodos}>
      {children}
    </periodosContext.Provider>
  );
}
