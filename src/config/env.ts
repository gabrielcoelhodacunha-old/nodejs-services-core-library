import { env as ENV } from "node:process";
import "dotenv/config";
import { Env } from "./types";
import { envParser } from "./parsers";

export const env: Env = envParser
  .transform((env) => ({
    ...env,
    BASE_URL: `${env.PROTOCOL}://${env.HOST}:${env.PORT}`,
    MONGO_URI: `mongodb://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DATABASE}`,
  }))
  .parse(ENV);
