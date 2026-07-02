import mongoose, { model, Schema } from "mongoose";

export const TareaSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    completedTime: { type: Date },
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
