import React, { useState } from 'react'
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEdit } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { FaSave } from 'react-icons/fa';
export default function Periodo({ periodo, index, deletePeriodo, editPeriodo }) {
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        nombre: periodo.nombre,
        inicio: periodo.inicio,
        final: periodo.final,
        horas: periodo.horas,
        color: periodo.color
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSave = () => {
        editPeriodo(index, form);
        setEditMode(false);
    };

    return (
        <div className={`flex px-2 gap-2 odd:bg-gray-800/20 ${periodo.nombre === periodo?.nombre ? "border-b border-gray-800" : ""}`}>
            {editMode ? (
                <>
                    <input className="basis-1/5 inpt" name="nombre" value={form.nombre} onChange={handleChange} />
                    <input className="basis-1/5 inpt" name="inicio" value={form.inicio} onChange={handleChange} />
                    <input className="basis-1/5 inpt" name="final" value={form.final} onChange={handleChange} />
                    <input className="basis-1/5 inpt" name="horas" type="number" value={form.horas} onChange={handleChange} />
                    <input className="px-2" name="color" type="color" value={form.color} onChange={handleChange} />
                    <button onClick={handleSave}><FaSave /></button>
                    <button onClick={() => setEditMode(false)}> <MdCancel /> </button>
                </>
            ) : (
                <>
                    <div className="basis-1/5">{periodo.nombre}</div>
                    <div className="basis-1/5">{periodo.inicio}</div>
                    <div className="basis-1/5">{periodo.final}</div>
                    <div className="basis-1/5">{Math.floor(periodo.horas)} horas</div>
                    <div className="px-2">
                        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                            <rect width="10" height="10" x="10" y="10" fill={periodo.color} />
                        </svg>
                    </div>
                    <button onClick={() => setEditMode(true)}><FaEdit /></button>
                    <button onClick={() => deletePeriodo(index)}><RiDeleteBin5Fill/></button>
                </>
            )}
        </div>
    )
}