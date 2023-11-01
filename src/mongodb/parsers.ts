import { z } from "zod";
import { UUID } from "mongodb";
import { envParser, numberParser, stringParser } from "../utils";
import { isUUID } from "./functions";

export const mongoEnvParser = envParser.pick({ APP_NAME: true }).extend({
  MONGO_USER: stringParser.default("username"),
  MONGO_PASSWORD: stringParser.default("password"),
  MONGO_HOST: stringParser.default("localhost"),
  MONGO_PORT: numberParser.default(27017),
  MONGO_DATABASE: stringParser.default("nodejs_services"),
  MONGO_URI: stringParser.default(""),
});

export const mongoUuidParser = z.custom<UUID>(isUUID).default(
  /* istanbul ignore next */
  () => new UUID()
);
