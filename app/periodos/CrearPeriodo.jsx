import { useMemo, useState } from "react";
import { usePeriodos } from "@/contextos/periodosContext";
import { calculateHours, normalizePeriodo } from "@/utils/periodos";

export default function CrearPeriodo({ salir }) {
  const { createPeriodo, currentPeriodoDraft, setCurrentPeriodoDraft } =
    usePeriodos();
  const [error, setError] = useState("");

  const periodo = normalizePeriodo(currentPeriodoDraft);
  const horas = useMemo(
    () => calculateHours(periodo.horaInicio, periodo.horaFin),
    [periodo.horaInicio, periodo.horaFin],
  );

  const setPeriodoField = (field, value) => {
    setCurrentPeriodoDraft((current) =>
      normalizePeriodo({ ...current, [field]: value }),
    );
  };

  const guardar = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await createPeriodo({ ...periodo, horas });
      salir();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="flex px-4 justify-center items-center" onSubmit={guardar}>
      <div className="flex w-full gap-4 justify-center items-center flex-wrap">
        <div className="flex flex-col">
          <label htmlFor="nombre">Nombre</label>
          <input
            className="inpt"
            id="nombre"
            name="nombre"
            onChange={(e) => setPeriodoField("nombre", e.target.value)}
            required
            type="text"
            value={periodo.nombre}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="horaInicio">Desde:</label>
          <input
            className="inpt"
            name="horaInicio"
            onChange={(e) => setPeriodoField("horaInicio", e.target.value)}
            required
            type="time"
            value={periodo.horaInicio}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="horaFin">Hasta:</label>
          <input
            className="inpt"
            name="horaFin"
            onChange={(e) => setPeriodoField("horaFin", e.target.value)}
            required
            type="time"
            value={periodo.horaFin}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="color">Color:</label>
          <input
            name="color"
            onChange={(e) => setPeriodoField("color", e.target.value)}
            required
            type="color"
            value={periodo.color}
          />
        </div>
        <div className="text-white">{horas} h</div>
        <div className="flex gap-2">
          <button className="btn_cncl" onClick={salir} type="button">
            salir
          </button>
          <button className="btn" type="submit">
            guardar
          </button>
        </div>
        {error ? (
          <p className="w-full text-red-500 text-center">{error}</p>
        ) : null}
      </div>
    </form>
  );
}
