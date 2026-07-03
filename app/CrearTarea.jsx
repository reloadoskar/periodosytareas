import { useState } from "react";

export default function CrearTarea({ handleAddTarea, currentPeriodo }) {
  const [text, setText] = useState("");
  const creaLaTarea = (event, taskName) => {
    event.preventDefault();
    handleAddTarea({
      nombre: taskName,
      completed: false,
    });
    setText("");
  };
  return (
    <div className="flex justify-center mt-5">
      {!currentPeriodo ? null : (
        <form
          onSubmit={(event) => creaLaTarea(event, text)}
          className="flex flex-col items-center gap-2"
        >
          <input
            name="nombre"
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Nueva tarea"
            className="inpt "
          />
          <button type="submit" className="btn">
            Agregar Tarea
          </button>
        </form>
      )}
    </div>
  );
}
