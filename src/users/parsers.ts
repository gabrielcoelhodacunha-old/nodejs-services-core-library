import { z } from "zod";
import { hashString, dateParser, emailParser, mongoUuidParser } from "../utils";

export const userParser = z
  .object({
    external_id: mongoUuidParser,
    email: emailParser,
    password: z.string().min(8),
    created_at: dateParser,
  })
  .strict();

export const userResponseParser = userParser.transform(
  ({ external_id: id, created_at: createdAt, ...rest }) => ({
    id: id.toHexString(),
    ...rest,
    createdAt,
  })
);

export const insertUserRequestParser = userParser
  .pick({
    email: true,
    password: true,
  })
  .transform(async ({ password, ...rest }) => ({
    password: await hashString(password),
    ...rest,
  }));

export const findUserFilterParser = userParser
  .pick({ external_id: true, email: true })
  .partial()
  .transform(
    ({ external_id: id, ...rest }) =>
      ({ id: id?.toHexString(), ...rest } as Partial<
        { id: string } & typeof rest
      >)
  );
