import { z } from "zod";
import {
  userParser,
  userResponseParser,
  createUserRequestParser,
  findUserFilterParser,
} from "./parsers";

export type User = z.infer<typeof userParser>;
export type UserResponse = z.infer<typeof userResponseParser>;
export type CreateUserRequest = z.infer<typeof createUserRequestParser>;
export type FindUserFilter = z.infer<typeof findUserFilterParser>;
