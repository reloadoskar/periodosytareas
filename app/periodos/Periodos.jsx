'use client'

import { useState } from "react"
import CrearPeriodo from "./CrearPeriodo"
import Periodo from "./Periodo";
//import BarraHoras from "./BarraHoras";

export default function Periodos({ periodos, setPeriodos, editPeriodo, addPeriodo, deletePeriodo, currentPeriodo }) {
    const [createMode, setCreateMode] = useState(false)
    const totalHoras = periodos.reduce((hrs, p) => hrs += p.horas, 0);
    return (
        <div id="periodos" className='w-full'>
            {/* <BarraHoras periodos={periodos} currentPeriodo={currentPeriodo} /> */}
            <div className="flex justify-center items-center">
                <div className="flex gap-4">
                    <h1 className="titulo">Periodos</h1>
                </div>
            </div>

            <div className={`flex flex-col gap-2 mt-6 md:px-6 p-2 transition-all ease-in duration-300 shadow-lg max-h-screen opacity-100 overflow-y-auto`}>
                {!createMode ?
                    <div className="flex md:justify-end justify-center p-2">
                        <button className="btn"
                            onClick={(e) => setCreateMode(!createMode)}
                            disabled={totalHoras >= 24}>
                            + Crear periodo
                        </button>
                    </div>
                    : <CrearPeriodo add={addPeriodo} salir={() => setCreateMode(false)} periodos={periodos} />
                }

                {periodos.length > 0 ?
                <>
                    <div className="flex-col gap-2 px-4 my-6 hidden md:flex">
                        {periodos.map((periodo, index) => (
                            <Periodo 
                                key={periodo.nombre} 
                                periodo={periodo} 
                                index={index} 
                                deletePeriodo={deletePeriodo} 
                                editPeriodo={editPeriodo} 
                            />
                        ))}
                        <div className='flex px-2 gap-2'>
                            <div className="basis-3/5"></div>
                            <div className="basis-1/5">
                                {Math.floor(totalHoras)} horas
                            </div>
                            <div className="basis-1/5"></div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 p-2 md:hidden ">
                        {periodos.map((periodo,i)=>(
                            <div key={i} className={`flex flex-col odd:bg-gray-800/20 ${periodo.nombre === currentPeriodo?.nombre ? "border-4 border-gray-800" : ""}`}>
                                <div className="flex h-2" style={{backgroundColor:periodo.color}}></div>
                                <div className="flex flex-col px-2">
                                    <div className="titulo">{periodo.nombre}</div>
                                    <div className="flex justify-end">
                                        <div>desde:{periodo.inicio} hasta:{periodo.final} </div>
                                    </div>
                                    <div className="">{periodo.horas} horas</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
                    : null
                }
            </div>
        </div>
    )
}
