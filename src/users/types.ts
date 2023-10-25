import { z } from "zod";
import {
  userParser,
  userResponseParser,
  insertUserRequestParser,
  findUserFilterParser,
} from "./parsers";

export type User = z.infer<typeof userParser>;
export type UserResponse = z.infer<typeof userResponseParser>;
export type InsertUserRequest = z.infer<typeof insertUserRequestParser>;
export type FindUserFilter = z.infer<typeof findUserFilterParser>;
