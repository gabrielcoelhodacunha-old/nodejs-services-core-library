import { genSalt, hash } from "bcrypt";
import { Env } from "./types";

export async function hashString(str: string): Promise<string> {
  const salt = await genSalt();
  return await hash(str, salt);
}

export function transformEnv(env: Env): Env {
  return {
    ...env,
    BASE_URL: `${env.PROTOCOL}://${env.HOST}:${env.PORT}`,
  };
}
