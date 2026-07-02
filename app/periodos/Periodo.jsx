import { useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { calculateHours, normalizePeriodo } from "@/utils/periodos";

export default function Periodo({ periodo, deletePeriodo, editPeriodo }) {
  const normalized = normalizePeriodo(periodo);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(normalized);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextForm = { ...form, [name]: value };
    setForm({
      ...nextForm,
      horas: calculateHours(nextForm.horaInicio, nextForm.horaFin),
    });
  };

  const handleSave = async () => {
    await editPeriodo(periodo, form);
    setEditMode(false);
  };

  return (
    <div className="flex px-2 gap-2 odd:bg-slate-700 text-slate-50 border-b border-slate-100">
      {editMode ? (
        <>
          <input
            className="basis-1/5 inpt"
            name="nombre"
            onChange={handleChange}
            value={form.nombre}
          />
          <input
            className="basis-1/5 inpt"
            name="horaInicio"
            onChange={handleChange}
            type="time"
            value={form.horaInicio}
          />
          <input
            className="basis-1/5 inpt"
            name="horaFin"
            onChange={handleChange}
            type="time"
            value={form.horaFin}
          />
          <input
            className="basis-1/5 inpt"
            name="horas"
            readOnly
            type="number"
            value={form.horas}
          />
          <input
            className="px-2"
            name="color"
            onChange={handleChange}
            type="color"
            value={form.color}
          />
          <button onClick={handleSave} type="button">
            <FaSave />
          </button>
          <button onClick={() => setEditMode(false)} type="button">
            <MdCancel />
          </button>
        </>
      ) : (
        <>
          <div className="basis-1/5">{normalized.nombre}</div>
          <div className="basis-1/5">{normalized.horaInicio}</div>
          <div className="basis-1/5">{normalized.horaFin}</div>
          <div className="basis-1/5">{Math.floor(normalized.horas)} horas</div>
          <div className="px-2">
            <svg
              aria-label={`Color ${normalized.color}`}
              height="20"
              role="img"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                fill={normalized.color}
                height="10"
                width="10"
                x="10"
                y="10"
              />
            </svg>
          </div>
          <button onClick={() => setEditMode(true)} type="button">
            <FaEdit />
          </button>
          <button onClick={() => deletePeriodo(periodo)} type="button">
            <RiDeleteBin5Fill />
          </button>
        </>
      )}
    </div>
  );
}
