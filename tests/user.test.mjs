import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getUserDisplayName, sanitizeUserUpdate } from "../utils/user.js";

describe("user utils", () => {
  it("uses full name when available for display", () => {
    assert.equal(
      getUserDisplayName({
        nombre: "Oscar",
        apellido1: "Rios",
        email: "oscar@example.com",
      }),
      "Oscar Rios",
    );
  });

  it("falls back to email prefix when name is empty", () => {
    assert.equal(getUserDisplayName({ email: "oscar@example.com" }), "oscar");
  });

  it("only allows editable profile fields", () => {
    assert.deepEqual(
      sanitizeUserUpdate({
        nombre: " Oscar ",
        apellido1: " Rios ",
        apellido2: " Dev ",
        telefono: " 123 ",
        email: "bad@example.com",
        level: 99,
        database: "hacked",
        password: "secret",
      }),
      {
        nombre: "Oscar",
        apellido1: "Rios",
        apellido2: "Dev",
        telefono: "123",
      },
    );
  });
});
