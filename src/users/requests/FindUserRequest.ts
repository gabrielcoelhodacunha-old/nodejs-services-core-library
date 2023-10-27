import { z } from "zod";
import { UserModel, userModelParser } from "../model";

export function transformFindUserRequest({
  external_id: id,
  ...rest
}: Partial<Pick<UserModel, "external_id" | "email">>) {
  const filter = { id: id?.toHexString(), ...rest };
  return filter as Partial<typeof filter>;
}

export const findUserRequestParser = userModelParser
  .pick({ external_id: true, email: true })
  .partial()
  .transform(transformFindUserRequest);

export type FindUserRequest = z.infer<typeof findUserRequestParser>;
