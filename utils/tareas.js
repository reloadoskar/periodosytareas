export function getDateKey(date = new Date()) {
  const value = date instanceof Date ? date : new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function normalizeTask(task = {}, options = {}) {
  const fecha = task.fecha ?? options.dateKey ?? options.fecha ?? getDateKey();
  const order = Number.isInteger(task.order)
    ? task.order
    : (options.order ?? 0);

  return {
    ...task,
    nombre: typeof task.nombre === "string" ? task.nombre.trim() : "",
    periodoId: task.periodoId ?? options.periodoId,
    fecha,
    completed: Boolean(task.completed),
    completedTime: task.completedTime ?? null,
    repeat: task.repeat ?? "ninguno",
    order,
  };
}

export function filterTasksByPeriodAndDate(
  tasks = [],
  periodoId,
  dateKey = getDateKey(),
) {
  return tasks.filter(
    (task) =>
      String(task.periodoId) === String(periodoId) && task.fecha === dateKey,
  );
}

export function groupTasksByDate(tasks = [], todayKey = getDateKey()) {
  const groups = new Map();

  tasks
    .filter((task) => task.fecha && task.fecha !== todayKey)
    .forEach((task) => {
      if (!groups.has(task.fecha)) groups.set(task.fecha, []);
      groups.get(task.fecha).push(task);
    });

  return [...groups.entries()]
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
    .map(([fecha, tareas]) => ({ fecha, tareas }));
}

export function filterHistoryByCompleted(historial = [], showCompleted = true) {
  if (showCompleted) return historial;

  return historial
    .map((grupo) => ({
      ...grupo,
      tareas: grupo.tareas.filter((tarea) => !tarea.completed),
    }))
    .filter((grupo) => grupo.tareas.length > 0);
}

export function reorderTasks(tasks = [], taskId, direction) {
  const index = tasks.findIndex((task) => String(task._id) === String(taskId));
  const newIndex = index + direction;

  if (index < 0 || newIndex < 0 || newIndex >= tasks.length) return tasks;

  const reordered = [...tasks];
  const [moved] = reordered.splice(index, 1);
  reordered.splice(newIndex, 0, moved);

  return reordered.map((task, order) => ({ ...task, order }));
}

export function updateTaskName(task, name) {
  return {
    ...task,
    nombre: typeof name === "string" ? name.trim() : "",
  };
}
