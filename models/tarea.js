import mongoose, { model, Schema } from "mongoose";

export const TareaSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    periodoId: {
      type: Schema.ObjectId,
      ref: "Periodo",
      required: true,
      index: true,
    },
    fecha: { type: String, required: true, index: true },
    completed: { type: Boolean, default: false },
    completedTime: { type: Date },
    order: { type: Number, default: 0 },
    repeat: {
      type: String,
      enum: ["diario", "semanal", "mensual", "ninguno"],
      default: "ninguno",
    },
  },
  {
    _id: true,
    timestamps: true,
  },
);

export default mongoose.models.Tarea || model("Tarea", TareaSchema);
