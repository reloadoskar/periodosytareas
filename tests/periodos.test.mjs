import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getAdjacentPeriodo,
  getCurrentPeriodo,
  normalizePeriodo,
  reorderItem,
  sortPeriodosByStart,
  updatePeriodoTask,
} from "../utils/periodos.js";

describe("periodos utils", () => {
  it("normalizes legacy inicio/final fields to horaInicio/horaFin", () => {
    assert.deepEqual(
      normalizePeriodo({ nombre: "Mañana", inicio: "08:00", final: "12:30" }),
      {
        nombre: "Mañana",
        horaInicio: "08:00",
        horaFin: "12:30",
        color: "#3d3d3d",
        tareas: [],
        horas: 4.5,
      },
    );
  });

  it("detects a current periodo that crosses midnight", () => {
    const periodos = [
      normalizePeriodo({
        nombre: "Noche",
        horaInicio: "22:00",
        horaFin: "02:00",
        color: "#111111",
      }),
    ];

    assert.equal(getCurrentPeriodo(periodos, "23:30")?.nombre, "Noche");
    assert.equal(getCurrentPeriodo(periodos, "01:30")?.nombre, "Noche");
    assert.equal(getCurrentPeriodo(periodos, "03:00"), null);
  });

  it("updates tasks immutably inside a periodo", () => {
    const periodo = normalizePeriodo({
      nombre: "Trabajo",
      horaInicio: "09:00",
      horaFin: "10:00",
      tareas: [{ nombre: "A", completed: false }],
    });

    const updated = updatePeriodoTask(periodo, 0, (task) => ({
      ...task,
      completed: !task.completed,
    }));

    assert.equal(periodo.tareas[0].completed, false);
    assert.equal(updated.tareas[0].completed, true);
  });

  it("reorders an item and leaves invalid moves unchanged", () => {
    assert.deepEqual(reorderItem(["a", "b", "c"], 1, -1), ["b", "a", "c"]);
    assert.deepEqual(reorderItem(["a", "b", "c"], 0, -1), ["a", "b", "c"]);
  });

  it("orders periods by start time and moves to previous or next period", () => {
    const periodos = [
      { _id: "noche", nombre: "Noche", horaInicio: "18:00", horaFin: "22:00" },
      {
        _id: "manana",
        nombre: "Mañana",
        horaInicio: "06:00",
        horaFin: "12:00",
      },
      { _id: "tarde", nombre: "Tarde", horaInicio: "12:00", horaFin: "18:00" },
    ];

    assert.deepEqual(
      sortPeriodosByStart(periodos).map((periodo) => periodo._id),
      ["manana", "tarde", "noche"],
    );
    assert.equal(getAdjacentPeriodo(periodos, "tarde", -1)?._id, "manana");
    assert.equal(getAdjacentPeriodo(periodos, "tarde", 1)?._id, "noche");
    assert.equal(getAdjacentPeriodo(periodos, "manana", -1)?._id, "noche");
  });
});
