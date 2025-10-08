import React from 'react'
import { MdCancel } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";

export default function Tareas({ tareas, handleDeleteTarea, handleToggleCompleteTarea, handleMoveTarea, currentPeriodo }) {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}
            className="max-h-64 overflow-auto">
                {!currentPeriodo ? null :

                    tareas.length === 0 ? <p className="text-2xl py-12">¿Nada qué hacer aún?</p> : (
                        <div className="py-12" style={{ textAlign: "center", width: "600px" }}>
                            <h2 className="titulo">Tareas</h2>
                            <ul className="flex flex-col gap-2">
                                {tareas.map((tarea, index) => (
                                    <li className={`flex gap-2 rounded-md ${tarea.animate ? 'animate-bounce' : ''} ${tarea.completed ? "bg-gray-800/60" : ""}`} key={index} >
                                        <p className={`basis-4/6 font-black text-lg capitalize ${tarea.completed ? "line-through" : ""}`} >
                                            {tarea.text}
                                        </p>
                                        <button className="basis-1/6" onClick={() => handleToggleCompleteTarea(index)} style={{ marginLeft: "10px" }}>
                                            {tarea.completed ? <FaRedo /> : <FaCheck />}
                                        </button>
                                        <button className="basis-1/6" onClick={() => handleDeleteTarea(index)} style={{ marginLeft: "10px" }}>
                                            <MdCancel /> 
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
        </div>
    )
}
