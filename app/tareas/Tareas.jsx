import { useState } from "react";
import Tarea from "./Tarea";

export default function Tareas({
  tareas,
  handleDeleteTarea,
  handleToggleCompleteTarea,
  handleMoveTarea,
  handleEditTarea,
  currentPeriodo,
}) {
  const [editingId, setEditingId] = useState(null);

  const startEdit = (tarea) => {
    setEditingId(tarea._id);
    setDraftName(tarea.nombre);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftName("");
  };

  const saveEdit = async (tarea) => {
    await handleEditTarea(tarea, draftName);
    cancelEdit();
  };

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
            {tareas.map((tarea) => {
              const isEditing = editingId === tarea._id;

              return (
                <Tarea
                  key={tarea._id}
                  tarea={tarea}
                  isEditing={isEditing}
                  saveEdit={saveEdit}
                  cancelEdit={cancelEdit}
                  startEdit={startEdit}
                  handleToggleCompleteTarea={handleToggleCompleteTarea}
                  handleDeleteTarea={handleDeleteTarea}
                  handleMoveTarea={handleMoveTarea}
                />
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
