// crear Schema de proyecto con mongoose, exportar modelo como Proyecto
import mongoose, { model, Schema } from "mongoose";

const ProyectoSchema = Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pendiente", "en progreso", "completado"],
      default: "pendiente",
    },
    tareas: [{ type: Schema.ObjectId, ref: "Tarea" }],
    periodos: [{ type: Schema.ObjectId, ref: "Periodo" }],
  },
  {
    timestamps: true,
  },
);
export default mongoose.models.Proyecto || model("Proyecto", ProyectoSchema);
