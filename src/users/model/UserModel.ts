import { z } from "zod";
import { dateParser, emailParser, mongoUuidParser } from "../../utils";

export const userModelParser = z
  .object({
    external_id: mongoUuidParser,
    email: emailParser,
    password: z.string().min(8),
    created_at: dateParser,
  })
  .strict();

export type UserModel = z.infer<typeof userModelParser>;
