import type { UUID } from "mongodb";
import type { MongoEnv } from "./types";

export function transformMongoEnv(env: MongoEnv): MongoEnv {
  return {
    ...env,
    MONGO_URI: `mongodb://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DATABASE}`,
  };
}

export function isUUID(data: unknown): data is UUID {
  return (data as UUID).toHexString !== undefined;
}
