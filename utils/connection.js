import mongoose from "mongoose";

const { MONGO_URL, MONGOUSER, MONGOPASSWORD } = process.env;



const globalCache = globalThis.__mongooseConnections ?? {
  connections: new Map(),
};
globalThis.__mongooseConnections = globalCache;
//agregar user como MONGOUSER y password como MONGOPASSWORD a la url de mongo si es necesario
const buildMongoUri = (dbName) => {
  if (MONGOUSER && MONGOPASSWORD) {
    return `${MONGO_URL}/${dbName}?user=${MONGOUSER}&pass=${MONGOPASSWORD}`;
  }
  return `${MONGO_URL}/${dbName}`;
};

export const dbConnect = async (dbName) => {
  if (!dbName) throw new Error("dbName is required.");
  if (!MONGO_URL) throw new Error("MONGO_URL is not defined.");
  if (!MONGOUSER || !MONGOPASSWORD) throw new Error("MONGOUSER and MONGOPASSWORD are not defined.");

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
