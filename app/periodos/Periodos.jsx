"use client";

import { useState } from "react";
import { usePeriodos } from "@/contextos/periodosContext";
import CrearPeriodo from "./CrearPeriodo";
import Periodo from "./Periodo";

export default function Periodos({ currentPeriodo }) {
  const { periodos, deletePeriodo, updatePeriodo } = usePeriodos();
  const [createMode, setCreateMode] = useState(false);
  const [error, setError] = useState("");
  const totalHoras = periodos.reduce(
    (hrs, periodo) => hrs + Number(periodo.horas || 0),
    0,
  );

  const handleDelete = async (periodo) => {
    try {
      setError("");
      await deletePeriodo(periodo._id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (periodo, updatedPeriodo) => {
    try {
      setError("");
      await updatePeriodo(periodo._id, { ...periodo, ...updatedPeriodo });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div id="periodos" className="w-full">
      <div className="flex justify-center items-center">
        <div className="flex gap-4">
          <h1 className="titulo">Periodos</h1>
        </div>
      </div>

      {error ? <p className="text-red-500 text-center">{error}</p> : null}

      <div className="flex flex-col gap-2 mt-6 md:px-6 p-2 transition-all ease-in duration-300 shadow-lg max-h-screen opacity-100 overflow-y-auto">
        {!createMode ? (
          <div className="flex md:justify-end justify-center p-2">
            <button
              className="btn"
              onClick={() => setCreateMode(true)}
              disabled={totalHoras >= 24}
              type="button"
            >
              + Crear periodo
            </button>
          </div>
        ) : (
          <CrearPeriodo salir={() => setCreateMode(false)} />
        )}

        {periodos.length > 0 ? (
          <>
            <div className="flex-col gap-2 px-4 my-6 hidden md:flex">
              {periodos.map((periodo) => (
                <Periodo
                  key={periodo._id}
                  periodo={periodo}
                  deletePeriodo={handleDelete}
                  editPeriodo={handleEdit}
                />
              ))}
              <div className="flex px-2 gap-2">
                <div className="basis-3/5" />
                <div className="basis-1/5">{Math.floor(totalHoras)} horas</div>
                <div className="basis-1/5" />
              </div>
            </div>

            <div className="flex flex-col gap-2 p-2 md:hidden ">
              {periodos.map((periodo) => (
                <div
                  key={periodo._id}
                  className={`flex flex-col even:bg-slate-500 ${periodo._id === currentPeriodo?._id ? "border-4 border-gray-800" : ""}`}
                >
                  <div
                    className="flex h-2"
                    style={{ backgroundColor: periodo.color }}
                  />
                  <div className="flex flex-col px-2">
                    <div className="titulo">{periodo.nombre}</div>
                    <div className="flex justify-end">
                      <div>
                        desde:{periodo.horaInicio} hasta:{periodo.horaFin}
                      </div>
                    </div>
                    <div>{periodo.horas} horas</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
