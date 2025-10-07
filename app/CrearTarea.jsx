import { useState } from "react";

export default function CrearTarea({handleAddTarea, currentPeriodo}) {
    const [text, setText] = useState("");
    const creaLaTarea = (e,text) =>{
        e.preventDefault();
        handleAddTarea({periodo:currentPeriodo.nombre, text:text, completed:false});
        setText("");
    }
    return (
        <div className="flex justify-center mt-5">
            {!currentPeriodo ? null :
                <form onSubmit={(e)=>creaLaTarea(e, text)} className="flex flex-col items-center gap-2">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Nueva tarea"
                        className="inpt "
                    />
                    <button type="submit" className="btn">
                        Agregar Tarea
                    </button>
                </form>
    }
        </div>
    )
}
