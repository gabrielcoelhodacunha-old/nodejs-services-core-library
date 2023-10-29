import { UUID } from "mongodb";

export function isUUID(data: unknown): data is UUID {
  return (data as UUID).toHexString !== undefined;
}
