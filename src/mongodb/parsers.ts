import { z } from "zod";
import { UUID } from "mongodb";
import { isUUID } from "./functions";

export const mongoUuidParser = z.custom<UUID>(isUUID).default(
  /* istanbul ignore next */
  () => new UUID()
);
