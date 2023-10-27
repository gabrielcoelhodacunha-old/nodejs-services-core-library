import { hashString } from "../../utils";
import type { User } from "../types";

export function transformUserResponse({
  external_id: id,
  created_at: createdAt,
  ...rest
}: User) {
  return { id: id.toHexString(), ...rest, createdAt };
}

export async function transformInsertUserRequest({
  password,
  ...rest
}: Pick<User, "email" | "password">) {
  return {
    password: await hashString(password),
    ...rest,
  };
}

export function transformFindUserFilter({
  external_id: id,
  ...rest
}: Partial<Pick<User, "external_id" | "email">>) {
  const filter = { id: id?.toHexString(), ...rest };
  return filter as Partial<typeof filter>;
}
