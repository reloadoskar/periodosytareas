import mongoose from "mongoose";

const { MONGODB_URI } = process.env;



const globalCache = globalThis.__mongooseConnections ?? {
  connections: new Map(),
};
globalThis.__mongooseConnections = globalCache;

const buildMongoUri = (dbName) => `${MONGODB_URI}${dbName}`;

export const dbConnect = async (dbName) => {
  if (!dbName) throw new Error("dbName is required.");
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined.");

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
