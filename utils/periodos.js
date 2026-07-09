const DEFAULT_COLOR = "#3d3d3d";

export function timeToMinutes(value) {
  if (!value || typeof value !== "string") return null;
  const [hours, minutes] = value.split(":").map(Number);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

export function calculateHours(horaInicio, horaFin) {
  const start = timeToMinutes(horaInicio);
  const end = timeToMinutes(horaFin);

  if (start === null || end === null) return 0;

  const duration = end > start ? end - start : 24 * 60 - start + end;
  return duration / 60;
}

export function normalizePeriodo(periodo = {}) {
  const { inicio: _inicio, final: _final, ...rest } = periodo;
  const horaInicio = periodo.horaInicio ?? periodo.inicio ?? "";
  const horaFin = periodo.horaFin ?? periodo.final ?? "";
  const tareas = Array.isArray(periodo.tareas) ? periodo.tareas : [];

  return {
    ...rest,
    nombre: periodo.nombre ?? "",
    horaInicio,
    horaFin,
    color: periodo.color ?? DEFAULT_COLOR,
    tareas,
    horas: Number(periodo.horas) || calculateHours(horaInicio, horaFin),
  };
}

export function isTimeInsidePeriodo(periodo, timeValue) {
  const normalized = normalizePeriodo(periodo);
  const current = timeToMinutes(timeValue);
  const start = timeToMinutes(normalized.horaInicio);
  const end = timeToMinutes(normalized.horaFin);

  if (current === null || start === null || end === null || start === end) {
    return false;
  }

  if (end > start) {
    return current >= start && current < end;
  }

  return current >= start || current < end;
}

export function getCurrentPeriodo(periodos = [], timeValue) {
  return (
    periodos
      .map(normalizePeriodo)
      .find((periodo) => isTimeInsidePeriodo(periodo, timeValue)) ?? null
  );
}

export function sortPeriodosByStart(periodos = []) {
  return [...periodos].map(normalizePeriodo).sort((periodoA, periodoB) => {
    const startA = timeToMinutes(periodoA.horaInicio);
    const startB = timeToMinutes(periodoB.horaInicio);

    if (startA === null && startB === null) return 0;
    if (startA === null) return 1;
    if (startB === null) return -1;

    return startA - startB;
  });
}

export function getAdjacentPeriodo(periodos = [], activePeriodoId, direction) {
  const sorted = sortPeriodosByStart(periodos);
  if (sorted.length === 0) return null;

  const activeIndex = sorted.findIndex(
    (periodo) => String(periodo._id) === String(activePeriodoId),
  );
  const currentIndex = activeIndex >= 0 ? activeIndex : 0;
  const step = direction < 0 ? -1 : 1;
  const nextIndex = (currentIndex + step + sorted.length) % sorted.length;

  return sorted[nextIndex];
}

export function reorderItem(items = [], index, direction) {
  const newIndex = index + direction;

  if (newIndex < 0 || newIndex >= items.length) return items;

  const reordered = [...items];
  const [moved] = reordered.splice(index, 1);
  reordered.splice(newIndex, 0, moved);
  return reordered;
}

export function updatePeriodoTask(periodo, index, updater) {
  const normalized = normalizePeriodo(periodo);
  const tareas = normalized.tareas.map((task, taskIndex) =>
    taskIndex === index ? updater(task) : task,
  );

  return {
    ...normalized,
    tareas,
  };
}
