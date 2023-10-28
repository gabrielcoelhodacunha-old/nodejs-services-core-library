import { genSalt, hash } from "bcrypt";
import { UUID } from "mongodb";
import { Env } from "./types";

export async function hashString(str: string): Promise<string> {
  const salt = await genSalt();
  return await hash(str, salt);
}

export function isUUID(data: unknown): data is UUID {
  return (data as UUID).toHexString !== undefined;
}

export function transformEnv(env: Env): Env {
  return {
    ...env,
    BASE_URL: `${env.PROTOCOL}://${env.HOST}:${env.PORT}`,
    MONGO_URI: `mongodb://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DATABASE}`,
  };
}