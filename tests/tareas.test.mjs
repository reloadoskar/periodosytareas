import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  filterTasksByPeriodAndDate,
  getDateKey,
  groupTasksByDate,
  normalizeTask,
} from "../utils/tareas.js";

describe("tareas utils", () => {
  it("normaliza tareas con periodoId y fecha local", () => {
    assert.deepEqual(
      normalizeTask(
        { nombre: " Preparar café ", periodoId: "p1" },
        { dateKey: "2026-07-03", order: 2 },
      ),
      {
        nombre: "Preparar café",
        periodoId: "p1",
        fecha: "2026-07-03",
        completed: false,
        completedTime: null,
        repeat: "ninguno",
        order: 2,
      },
    );
  });

  it("filtra por periodo y día actual", () => {
    const tasks = [
      { nombre: "Hoy", periodoId: "p1", fecha: "2026-07-03" },
      { nombre: "Otro periodo", periodoId: "p2", fecha: "2026-07-03" },
      { nombre: "Ayer", periodoId: "p1", fecha: "2026-07-02" },
    ];

    assert.deepEqual(filterTasksByPeriodAndDate(tasks, "p1", "2026-07-03"), [
      { nombre: "Hoy", periodoId: "p1", fecha: "2026-07-03" },
    ]);
  });

  it("agrupa historial por fecha descendente sin incluir hoy", () => {
    const grouped = groupTasksByDate(
      [
        { nombre: "Hoy", fecha: "2026-07-03" },
        { nombre: "Ayer", fecha: "2026-07-02" },
        { nombre: "Antes", fecha: "2026-07-01" },
      ],
      "2026-07-03",
    );

    assert.deepEqual(grouped, [
      {
        fecha: "2026-07-02",
        tareas: [{ nombre: "Ayer", fecha: "2026-07-02" }],
      },
      {
        fecha: "2026-07-01",
        tareas: [{ nombre: "Antes", fecha: "2026-07-01" }],
      },
    ]);
  });

  it("convierte Date a llave YYYY-MM-DD local", () => {
    assert.equal(getDateKey(new Date(2026, 6, 3, 23, 59)), "2026-07-03");
  });
});
