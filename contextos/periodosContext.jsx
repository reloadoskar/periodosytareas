'use client'
import React, { useState, useEffect, useContext, createContext } from "react"
// import axios from "axios"

const periodosContext = createContext();


export const usePeriodos = () => {
    return useContext(periodosContext);
};

const useProvidePeriodos = () => {
    const [periodos, setPeriodos] = useState([]);
    const [currentPeriodo, setCurrentPeriodo] = useState({nombre:"", horaInicio:"", horaFin:"", color:"#000000", horas:0, fecha: new Date()});
    useEffect(() => {
        const storedPeriodos = localStorage.getItem('periodos');
        if (storedPeriodos) {
            setPeriodos(JSON.parse(storedPeriodos));
        }
    }, []);
    const createPeriodo = async (database, periodo) => {
        try {
            const res = await fetch("/api/periodos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ database, periodo })
            });
            const newPeriodo = await res.json();
            setPeriodos([...periodos, newPeriodo]);
        } catch (error) {
            console.error("Error creating periodo:", error);
        }
    };  
    return {
        periodos, setPeriodos,
        currentPeriodo, setCurrentPeriodo,
        createPeriodo
    }
}

export function ProvidePeriodos({ children }) {
    const periodos = useProvidePeriodos();
    return <periodosContext.Provider value={periodos}>{children}</periodosContext.Provider>;
}
