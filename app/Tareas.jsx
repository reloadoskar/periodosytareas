import { FaArrowDown, FaArrowUp, FaCheck, FaRedo } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

export default function Tareas({
  tareas,
  handleDeleteTarea,
  handleToggleCompleteTarea,
  handleMoveTarea,
  currentPeriodo,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="max-h-64 overflow-auto"
    >
      {!currentPeriodo ? null : tareas.length === 0 ? (
        <p className="text-2xl py-12">¿Nada qué hacer aún?</p>
      ) : (
        <div className="py-12" style={{ textAlign: "center", width: "600px" }}>
          <h2 className="titulo">Tareas de hoy</h2>
          <ul className="flex flex-col gap-2">
            {tareas.map((tarea) => (
              <li
                className={`flex gap-2 rounded-md ${tarea.animate ? "animate-bounce" : ""} ${tarea.completed ? "bg-gray-800/60" : ""}`}
                key={tarea._id}
              >
                <p
                  className={`basis-3/6 font-black text-lg capitalize ${tarea.completed ? "line-through" : ""}`}
                >
                  {tarea.nombre}
                </p>
                <button
                  className="basis-1/6"
                  onClick={() => handleMoveTarea(tarea._id, -1)}
                  style={{ marginLeft: "10px" }}
                  type="button"
                >
                  <FaArrowUp />
                </button>
                <button
                  className="basis-1/6"
                  onClick={() => handleMoveTarea(tarea._id, 1)}
                  style={{ marginLeft: "10px" }}
                  type="button"
                >
                  <FaArrowDown />
                </button>
                <button
                  className="basis-1/6"
                  onClick={() => handleToggleCompleteTarea(tarea)}
                  style={{ marginLeft: "10px" }}
                  type="button"
                >
                  {tarea.completed ? <FaRedo /> : <FaCheck />}
                </button>
                <button
                  className="basis-1/6"
                  onClick={() => handleDeleteTarea(tarea._id)}
                  style={{ marginLeft: "10px" }}
                  type="button"
                >
                  <MdCancel />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
