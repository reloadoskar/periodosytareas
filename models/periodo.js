import mongoose, { Schema, model } from "mongoose";
const PeriodoSchema = Schema({
    nombre: { type: String, required: true },
    color: { type: String, required: true },
    fecha: { type: Date, required: true },
    tareas: [{ type: Schema.ObjectId, ref: 'Tarea' }],
    horaInicio: { type: String, required: true },
    horaFin: { type: String, required: true },
    status: { type: String, enum: ['pendiente', 'en progreso', 'completado'], default: 'pendiente' },
    horas: { type: Number, required: true },
    proyectoId: { type: Schema.ObjectId, ref: 'Proyecto' },
});
export default mongoose.models.Periodo || model("Periodo", PeriodoSchema);