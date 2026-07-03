import { normalizePeriodo } from "./periodos.js";

const DEFAULT_PERIODOS = [
  {
    nombre: "Mañana",
    horaInicio: "06:00",
    horaFin: "12:00",
    color: "#facc15",
  },
  {
    nombre: "Tarde",
    horaInicio: "12:00",
    horaFin: "18:00",
    color: "#fb923c",
  },
  {
    nombre: "Noche",
    horaInicio: "18:00",
    horaFin: "22:00",
    color: "#312e81",
  },
  {
    nombre: "Sueño",
    horaInicio: "22:00",
    horaFin: "06:00",
    color: "#0f172a",
  },
];

export function getDefaultPeriodos() {
  return DEFAULT_PERIODOS.map((periodo) => normalizePeriodo({ ...periodo }));
}
