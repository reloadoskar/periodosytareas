import mongoose, { Schema, model } from "mongoose";

const TareaSchema = Schema({
    nombre: { type: String, required: true },
    completed: { type: Boolean, default: false },
    periodo: { type: Schema.ObjectId, ref: 'Periodo' },
    completedTime: { type: Date },
    repeat: { type: String, enum: ['diario', 'semanal', 'mensual'] },
}, {
    timestamps: true
});

export default mongoose.models.Tarea || model("Tarea", TareaSchema);
