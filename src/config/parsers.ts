import { z } from "zod";
import { numberParser } from "../utils";

export const envParser = z.object({
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
});
