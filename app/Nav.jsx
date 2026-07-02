import React from 'react'
import Periodos from './periodos/Periodos'
import { FaTimes } from 'react-icons/fa'

export default function Nav({showPeriodosMenu, setShowPeriodosMenu, periodos, setPeriodos, currentPeriodo, addPeriodo, deletePeriodo, editPeriodo}) {
    return (
        < div className={
            `fixed top-0 left-0 h-full w-3/4 
            bg-slate-950 shadow-lg z-40 transition-transform duration-300 
            ${showPeriodosMenu ? "translate-x-0" : "-translate-x-full"}`
        }
        >
            {/* Botón para cerrar el menú */}
            < button
                className="absolute top-4 right-4 text-gray-800"
                onClick={() => setShowPeriodosMenu(false)}
            >
                <FaTimes size={24} />
            </button >
            <Periodos
                periodos={periodos}
                setPeriodos={setPeriodos}
                currentPeriodo={currentPeriodo}
                addPeriodo={addPeriodo}
                deletePeriodo={deletePeriodo}
                editPeriodo={editPeriodo}
            />
        </div >
    )
}
