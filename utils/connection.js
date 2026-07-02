import mongoose from "mongoose";

const { MONGO_URL } = process.env;



const globalCache = globalThis.__mongooseConnections ?? {
  connections: new Map(),
};
globalThis.__mongooseConnections = globalCache;

const buildMongoUri = (dbName) => `${MONGO_URL}/${dbName}`;

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
