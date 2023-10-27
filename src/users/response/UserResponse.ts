import { z } from "zod";
import { UserModel, userModelParser } from "../model";

export function transformUserResponse({
  external_id: id,
  created_at: createdAt,
  ...rest
}: UserModel) {
  return { id: id.toHexString(), ...rest, createdAt };
}

export const userResponseParser = userModelParser.transform(
  transformUserResponse
);

export type UserResponse = z.infer<typeof userResponseParser>;
