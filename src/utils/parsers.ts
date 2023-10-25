import { randomUUID } from "node:crypto";
import { z } from "zod";
import { UUID } from "mongodb";

export const numberParser = z.number({ coerce: true });
export const uuidParser = z.string().uuid().default(randomUUID);
export const emailParser = z.string().email();
export const dateParser = z.date().default(new Date());

export const mongoUuidParser = z
  .custom<UUID>(
    (data): data is UUID => (data as UUID).toHexString !== undefined
  )
  .default(() => new UUID());

export const envParser = z
  .object({
    APP_NAME: z.string().default(""),
    PROTOCOL: z.string().default("http"),
    HOST: z.string().default("localhost"),
    PORT: numberParser.default(3000),
    BASE_URL: z.string().default(""),
    MONGO_USER: z.string().default("username"),
    MONGO_PASSWORD: z.string().default("password"),
    MONGO_HOST: z.string().default("localhost"),
    MONGO_PORT: numberParser.default(27017),
    MONGO_DATABASE: z.string().default("nodejs_services"),
    MONGO_URI: z.string().default(""),
  })
  .transform((env) => ({
    ...env,
    BASE_URL: `${env.PROTOCOL}://${env.HOST}:${env.PORT}`,
    MONGO_URI: `mongodb://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DATABASE}`,
  }));
