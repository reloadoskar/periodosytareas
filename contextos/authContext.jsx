'use client'
import React, { useState, useEffect, useContext, createContext } from "react"
// import axios from "axios"

const authContext = createContext();

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
    return useContext(authContext);
};

function useProvideAuth() {
    const [credenciales, setCredenciales] = useState({
        email: "",
        password: "",
    })
    const [autenticado, setAutenticado] = useState(false)
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState(null)

    useEffect(() => {
        // console.log("leyendo token de las cookies...")
        const storedToken = document.cookie.split("; ").find(row => row.startsWith("authToken="))?.split("=")[1];
        // const storedToken = localStorage.getItem("authToken");
        // console.log("Token encontrado en cookies:", storedToken);
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        // Aquí podrías agregar lógica para verificar el token, obtener el perfil del usuario, etc.
        if (token) {
            const verifyToken = async () => {
                try {
                    const res = await fetch("api/auth/profile", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });
                    const data = await res.json();
                    // console.log("Perfil del usuario:", data.payload);
                    setUser(data.payload);
                    setAutenticado(true);
                } catch (error) {
                    console.error("Error al verificar el token:", error);
                }
            };

            verifyToken();
        }
    }, [token]);

    const handleChange = (e) => {
        setCredenciales({
            ...credenciales,
            [e.target.name]: e.target.value,
        })
    }

    const login = async () => {
        try {
            const res = await fetch("api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ credenciales })
            })
            const data = await res.json()
            // const res = await axios.post("api/auth/login", { credenciales })
            if (data.status === 'success') {
                setAutenticado(true)
                setToken(data.token)
                setMensaje("Login exitoso.")
                setError("")
            } else {
                setMensaje("Usuario o Password incorrecto.")
                setError("Usuario o Password incorrecto.")  
            }
        } catch (err) {
            // console.log("Error al autenticar.", err)
            setError("Error al autenticar.")
        }
    }

    const signup = async (credenciales) => {
        try {
            // console.log("Registrando usuario con credenciales:", credenciales);
            const res = await fetch("api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ credenciales })
            })
            const data = await res.json()
            // console.log(data)
            if (data.status === 'success') {
                setAutenticado(true)
                setToken(data.token)
                setMensaje("Registro exitoso.")
                setError("")
                return data
            } else {
                setMensaje("Error al registrarse.")
                setError(data.error || "Error al registrarse.")
                return data
            }
        } catch (err) {
            // console.log("Error al registrarse.", err)
            setError(err.message || "Error al registrarse.")
            return false
        }
    }

    // useEffect(() => {
    //     if (payload) {
    //         setUser(payload)
    //         setAutenticado(true)
    //     }
    // }, [payload])

    // const logout = async (cb) => {
    //     // localStorage.removeItem('usertoken')
    //     const res = await axios.delete("api/auth")
    //     // console.log(res)
    //     setAutenticado(false)
    //     setToken(null)
    //     setUser(null)
    //     return cb()
    // };
    // const sendPasswordResetEmail = (email) => {
    //     return false
    // };
    // const confirmPasswordReset = (code, password) => {
    //     return false
    // };

    return {
        user, setUser,
        token,
        autenticado, setAutenticado,
        credenciales, setCredenciales,
        handleChange,
        mensaje,
        error,
        login,
        signup,
        // logout,
        // sendPasswordResetEmail,
        // confirmPasswordReset,
    };
}