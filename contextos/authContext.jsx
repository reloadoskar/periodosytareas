"use client";

import { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => useContext(authContext);

function useProvideAuth() {
  const [credenciales, setCredenciales] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (!res.ok || data.status !== "success") {
          setAutenticado(false);
          setUser(null);
          return;
        }

        setUser(data.payload);
        setAutenticado(true);
      } catch (err) {
        console.error("Error al verificar el token:", err);
        setAutenticado(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async () => {
    setError("");
    setMensaje(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credenciales }),
      });
      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        const message =
          data.message || data.error || "Usuario o contraseña incorrectos.";
        setMensaje(message);
        setError(message);
        return data;
      }

      setAutenticado(true);
      setUser(data.user);
      setMensaje("Login exitoso.");
      setError("");
      return data;
    } catch (err) {
      setError(err.message || "Error al autenticar.");
      return { status: "error", error: err.message };
    }
  };

  const signup = async (credencialesRegistro) => {
    setError("");
    setMensaje(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credenciales: credencialesRegistro }),
      });
      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        const message = data.error || "Error al registrarse.";
        setMensaje(message);
        setError(message);
        return data;
      }

      setAutenticado(true);
      setUser(data.user);
      setMensaje("Registro exitoso.");
      setError("");
      return data;
    } catch (err) {
      setError(err.message || "Error al registrarse.");
      return { status: "error", error: err.message };
    }
  };

  const updateProfile = async (profile) => {
    setError("");
    setMensaje(null);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: profile }),
      });
      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        const message = data.error || "Error actualizando perfil.";
        setError(message);
        return data;
      }

      setUser(data.user);
      setMensaje("Perfil actualizado.");
      return data;
    } catch (err) {
      setError(err.message || "Error actualizando perfil.");
      return { status: "error", error: err.message };
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAutenticado(false);
    setUser(null);
    setCredenciales({ email: "", password: "", confirmPassword: "" });
    setMensaje("Sesión cerrada.");
    setError("");
  };

  return {
    user,
    setUser,
    autenticado,
    setAutenticado,
    loading,
    credenciales,
    setCredenciales,
    mensaje,
    error,
    login,
    signup,
    updateProfile,
    logout,
  };
}
