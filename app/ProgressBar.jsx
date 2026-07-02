import moment from "moment";
import { useEffect, useState } from "react";
import { normalizePeriodo } from "@/utils/periodos";

export default function ProgressBar({ currentPeriodo }) {
  const [duracion, setDuracion] = useState(0);
  const [transcurrido, setTranscurrido] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!currentPeriodo) return undefined;

    const periodo = normalizePeriodo(currentPeriodo);
    const updateBar = () => {
      const now = moment();
      const start = moment(periodo.horaInicio, "HH:mm");
      const end = moment(periodo.horaFin, "HH:mm");

      if (end.isSameOrBefore(start)) {
        end.add(1, "day");
      }

      const duration = end.diff(start);
      const durationMinutes = end.diff(start, "minutes");
      const elapsed = now.diff(start);
      const elapsedMinutes = now.diff(start, "minutes");
      const nextPercentage = Math.max(
        0,
        Math.min(100, (elapsed / duration) * 100),
      );

      setDuracion(durationMinutes);
      setTranscurrido(elapsedMinutes);
      setPercentage(nextPercentage);
    };

    updateBar();
    const interval = setInterval(updateBar, 1000);

    return () => clearInterval(interval);
  }, [currentPeriodo]);

  if (!currentPeriodo) return null;

  const periodo = normalizePeriodo(currentPeriodo);
  const duracionTexto =
    duracion > 60 ? `${duracion / 60} hrs` : `${duracion} min`;
  const restantes = Math.max(
    0,
    Number.parseInt(duracion, 10) - Number.parseInt(transcurrido, 10),
  );

  return (
    <div>
      <div
        className=" flex flex-col shadow-sm shadow-slate-700/60 w-full "
        style={{
          backgroundColor: periodo.color,
          opacity: "80%",
          borderRadius: "3px",
          overflow: "hidden",
          marginTop: "10px",
        }}
      >
        <div
          className="transition-transform duration-1000 ease-in-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: "#242424",
            opacity: "90%",
            height: "20px",
          }}
        />
      </div>
      <div className="flex justify-between">
        <p>{periodo.horaInicio}</p>
        <p>{periodo.horaFin}</p>
      </div>
      <div className="text-center">
        <p>
          duración: {duracionTexto} | Quedan: {restantes} min
        </p>
      </div>
    </div>
  );
}
