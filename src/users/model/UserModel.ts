import { z } from "zod";
import { mongoUuidParser } from "../../mongodb";
import { dateParser, emailParser, stringParser } from "../../utils";

export const userModelParser = z
  .object({
    external_id: mongoUuidParser,
    email: emailParser,
    password: stringParser.min(8),
    created_at: dateParser,
  })
  .strict();

export type UserModel = z.infer<typeof userModelParser>;
