import { randomUUID } from "node:crypto";
import { z } from "zod";

export const stringParser = z.string();
export const numberParser = z.number({ coerce: true });
export const uuidParser = stringParser.uuid().default(randomUUID);
export const emailParser = stringParser.email();
export const dateParser = z.date().default(new Date());

export const envParser = z.object({
  APP_NAME: stringParser.default(""),
  PROTOCOL: stringParser.default("http"),
  HOST: stringParser.default("localhost"),
  PORT: numberParser.default(3000),
  BASE_URL: stringParser.default(""),
});
