import { genSalt, hash } from "bcrypt";

export async function hashString(str: string): Promise<string> {
  const salt = await genSalt();
  return await hash(str, salt);
}
