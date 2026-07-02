import mongoose, { model, Schema } from "mongoose";
import { TareaSchema } from "./tarea";

export const PeriodoSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    color: { type: String, required: true, default: "#3d3d3d" },
    fecha: { type: Date, default: Date.now },
    tareas: { type: [TareaSchema], default: [] },
    horaInicio: { type: String, required: true },
    horaFin: { type: String, required: true },
    status: {
      type: String,
      enum: ["pendiente", "en progreso", "completado"],
      default: "pendiente",
    },
    horas: { type: Number, required: true, default: 0 },
    proyectoId: { type: Schema.ObjectId, ref: "Proyecto" },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Periodo || model("Periodo", PeriodoSchema);
