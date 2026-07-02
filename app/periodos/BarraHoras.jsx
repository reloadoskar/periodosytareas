import { normalizePeriodo, timeToMinutes } from "@/utils/periodos";

export default function BarraHoras({ periodos, currentPeriodo }) {
  const renderBar = () => {
    if (periodos.length === 0 || currentPeriodo === null) return null;

    return periodos.map((item) => {
      const periodo = normalizePeriodo(item);
      const startMinutes = timeToMinutes(periodo.horaInicio) ?? 0;
      const width = (periodo.horas / 24) * 100;
      const left = (startMinutes / (24 * 60)) * 100;

      return (
        <div
          key={periodo._id ?? periodo.nombre}
          style={{
            position: "absolute",
            left: `${left}%`,
            width: `${width}%`,
            backgroundColor: periodo.color,
            height: "20px",
            border: `${periodo._id === currentPeriodo._id ? "solid 3px" : "none"}`,
          }}
        />
      );
    });
  };

  const renderScale = () => {
    const scale = [];
    for (let i = 0; i <= 24; i++) {
      scale.push(
        <div
          key={`hour-${i}`}
          style={{
            position: "absolute",
            left: `${(i / 24) * 100}%`,
            transform: "translateX(-50%)",
            height: "20px",
            borderLeft: "1px solid #000",
            color: "#000",
            fontSize: "10px",
            textAlign: "center",
          }}
        >
          {i}
        </div>,
      );
    }
    return scale;
  };

  return (
    <div className="w-full h-6 flex">
      {renderBar()}
      {renderScale()}
    </div>
  );
}
