import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getDefaultPeriodos } from "../utils/defaultPeriodos.js";

describe("periodos iniciales", () => {
  it("crea mañana, tarde, noche y sueño normalizados", () => {
    const periodos = getDefaultPeriodos();

    assert.deepEqual(
      periodos.map((periodo) => periodo.nombre),
      ["Mañana", "Tarde", "Noche", "Sueño"],
    );
    assert.deepEqual(
      periodos.map((periodo) => [periodo.horaInicio, periodo.horaFin]),
      [
        ["06:00", "12:00"],
        ["12:00", "18:00"],
        ["18:00", "22:00"],
        ["22:00", "06:00"],
      ],
    );
    assert.equal(periodos[3].horas, 8);
  });

  it("devuelve copias para no compartir mutaciones", () => {
    const first = getDefaultPeriodos();
    first[0].nombre = "Mutado";

    assert.equal(getDefaultPeriodos()[0].nombre, "Mañana");
  });
});
