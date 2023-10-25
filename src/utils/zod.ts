import { randomUUID } from "node:crypto";
import { UUID } from "mongodb";
import { z } from "zod";

export const numberParser = z.number({ coerce: true });
export const uuidParser = z.string().uuid().default(randomUUID);
export const mongoUuidParser = z
  .custom<UUID>(
    (data): data is UUID => (data as UUID).toHexString !== undefined
  )
  .default(() => new UUID(randomUUID()));
export const emailParser = z.string().email();
export const dateParser = z.date().default(new Date());
