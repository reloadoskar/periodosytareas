import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildMongoUri } from "../utils/connection.js";

describe("Mongo connection utils", () => {
  it("connects tenant databases with admin authSource for Railway MongoDB", () => {
    assert.equal(
      buildMongoUri(
        "PYT_USRS",
        "mongodb://mongo:secret@mongodb.railway.internal:27017",
      ),
      "mongodb://mongo:secret@mongodb.railway.internal:27017/PYT_USRS?authSource=admin",
    );
  });

  it("preserves existing query params and authSource", () => {
    assert.equal(
      buildMongoUri(
        "PYT_DB_user",
        "mongodb://mongo:secret@host:27017?retryWrites=true&authSource=admin",
      ),
      "mongodb://mongo:secret@host:27017/PYT_DB_user?retryWrites=true&authSource=admin",
    );
  });
});
