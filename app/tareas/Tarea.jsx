import { useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaCheck,
  FaEdit,
  FaRedo,
  FaSave,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";

export default function Tarea({
  tarea,
  isEditing,
  saveEdit,
  cancelEdit,
  startEdit,
  handleToggleCompleteTarea,
  handleDeleteTarea,
  handleMoveTarea,
}) {
  const [draftName, setDraftName] = useState("");
  return (
    <li
      className={`flex gap-2 px-2 rounded-md odd:bg-slate-500/80 ${tarea.animate ? "animate-bounce" : ""} ${tarea.completed ? "bg-gray-800/60" : ""}`}
      key={tarea._id}
    >
      {isEditing ? (
        <input
          className="basis-9/12 inpt"
          onChange={(event) => setDraftName(event.target.value)}
          value={draftName}
        />
      ) : (
        <p
          className={`basis-9/12 font-black text-lg capitalize text-left ${tarea.completed ? "line-through" : ""}`}
        >
          {tarea.nombre}
        </p>
      )}
      <div className="basis-3/12 flex gap-2">
        <button
          className="basis-1/6"
          disabled={isEditing}
          onClick={() => handleMoveTarea(tarea._id, -1)}
          style={{ marginLeft: "10px" }}
          type="button"
        >
          <FaArrowUp />
        </button>
        <button
          className="basis-1/6"
          disabled={isEditing}
          onClick={() => handleMoveTarea(tarea._id, 1)}
          style={{ marginLeft: "10px" }}
          type="button"
        >
          <FaArrowDown />
        </button>
        {isEditing ? (
          <>
            <button
              className="basis-1/6"
              onClick={() => saveEdit(tarea)}
              style={{ marginLeft: "10px" }}
              type="button"
            >
              <FaSave />
            </button>
            <button
              className="basis-1/6"
              onClick={cancelEdit}
              style={{ marginLeft: "10px" }}
              type="button"
            >
              <MdCancel />
            </button>
          </>
        ) : (
          <>
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
              onClick={() => startEdit(tarea)}
              style={{ marginLeft: "10px" }}
              type="button"
            >
              <FaEdit />
            </button>
            <button
              className="basis-1/6"
              onClick={() => handleDeleteTarea(tarea._id)}
              style={{ marginLeft: "10px" }}
              type="button"
            >
              <MdCancel />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
