import { z } from "zod";
import { dateParser, emailParser, mongoUuidParser } from "../../utils";
import {
  transformFindUserFilter,
  transformInsertUserRequest,
  transformUserResponse,
} from "./functions";

export const userParser = z
  .object({
    external_id: mongoUuidParser,
    email: emailParser,
    password: z.string().min(8),
    created_at: dateParser,
  })
  .strict();

export const userResponseParser = userParser.transform(transformUserResponse);

export const insertUserRequestParser = userParser
  .pick({ email: true, password: true })
  .transform(transformInsertUserRequest);

export const findUserFilterParser = userParser
  .pick({ external_id: true, email: true })
  .partial()
  .transform(transformFindUserFilter);
