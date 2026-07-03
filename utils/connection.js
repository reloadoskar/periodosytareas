import mongoose from "mongoose";

const { MONGO_URL } = process.env;

const globalCache = globalThis.__mongooseConnections ?? {
  connections: new Map(),
};
globalThis.__mongooseConnections = globalCache;

export const buildMongoUri = (dbName, mongoUrl = MONGO_URL) => {
  if (!dbName) throw new Error("dbName is required.");
  if (!mongoUrl) throw new Error("MONGO_URL is not defined.");

  const [baseUrl, queryString = ""] = mongoUrl.split("?");
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const params = new URLSearchParams(queryString);

  if (!params.has("authSource")) {
    params.set("authSource", "admin");
  }

  return `${normalizedBaseUrl}/${encodeURIComponent(dbName)}?${params.toString()}`;
};

export const dbConnect = async (dbName) => {
  if (!dbName) throw new Error("dbName is required.");
  if (!MONGO_URL) throw new Error("MONGO_URL is not defined.");

  if (globalCache.connections.has(dbName)) {
    return globalCache.connections.get(dbName);
  }

  const connection = await mongoose
    .createConnection(buildMongoUri(dbName))
    .asPromise();
  globalCache.connections.set(dbName, connection);

  return connection;
};

export const getUsersConnection = () => dbConnect("PYT_USRS");
