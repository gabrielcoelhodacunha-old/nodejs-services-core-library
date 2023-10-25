import { z } from "zod";
import { IRepositoryOptions, IServiceOptions } from "../utils";
import { IUsersRepository } from "./interfaces";
import {
  userParser,
  userResponseParser,
  createUserRequestParser,
  findUserFilterParser,
} from "./parsers";

export type IUsersRepositoryOptions = IRepositoryOptions;
export type IUsersServiceOptions = IServiceOptions<IUsersRepository>;

export type User = z.infer<typeof userParser>;
export type UserResponse = z.infer<typeof userResponseParser>;
export type CreateUserRequest = z.infer<typeof createUserRequestParser>;
export type FindUserFilter = z.infer<typeof findUserFilterParser>;
