import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  filterHistoryByCompleted,
  filterTasksByPeriodAndDate,
  getDateKey,
  groupTasksByDate,
  normalizeTask,
  updateTaskName,
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

  it("filtra tareas completadas del historial y oculta grupos vacíos", () => {
    const historial = [
      {
        fecha: "2026-07-02",
        tareas: [
          { _id: "t1", nombre: "Pendiente", completed: false },
          { _id: "t2", nombre: "Terminada", completed: true },
        ],
      },
      {
        fecha: "2026-07-01",
        tareas: [{ _id: "t3", nombre: "Terminada vieja", completed: true }],
      },
    ];

    assert.deepEqual(filterHistoryByCompleted(historial, false), [
      {
        fecha: "2026-07-02",
        tareas: [{ _id: "t1", nombre: "Pendiente", completed: false }],
      },
    ]);
    assert.equal(filterHistoryByCompleted(historial, true), historial);
  });

  it("edita el nombre de una tarea sin perder sus datos", () => {
    assert.deepEqual(
      updateTaskName(
        { _id: "t1", nombre: "Vieja", periodoId: "p1", fecha: "2026-07-03" },
        " Nueva tarea ",
      ),
      {
        _id: "t1",
        nombre: "Nueva tarea",
        periodoId: "p1",
        fecha: "2026-07-03",
      },
    );
  });
});
