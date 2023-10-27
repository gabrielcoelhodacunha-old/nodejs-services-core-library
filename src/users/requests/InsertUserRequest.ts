import { z } from "zod";
import { hashString } from "../../utils";
import { UserModel, userModelParser } from "../model";

export async function transformInsertUserRequest({
  password,
  ...rest
}: Pick<UserModel, "email" | "password">) {
  return {
    password: await hashString(password),
    ...rest,
  };
}

export const insertUserRequestParser = userModelParser
  .pick({ email: true, password: true })
  .transform(transformInsertUserRequest);

export type InsertUserRequest = z.infer<typeof insertUserRequestParser>;
