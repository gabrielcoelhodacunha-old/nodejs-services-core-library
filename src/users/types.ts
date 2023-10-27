import { z } from "zod";
import type { Collection } from "mongodb";
import {
  userParser,
  userResponseParser,
  insertUserRequestParser,
  findUserFilterParser,
} from "./parsers";
import type {
  IUserParser,
  IUserResponseParser,
  IUsersRepository,
} from "./interfaces";

export type User = z.infer<typeof userParser>;
export type UserResponse = z.infer<typeof userResponseParser>;
export type InsertUserRequest = z.infer<typeof insertUserRequestParser>;
export type FindUserFilter = z.infer<typeof findUserFilterParser>;

export type IUserParserTypes = {
  parseAsync: (data: any) => Promise<User>;
};
export type IUserResponseParserTypes = {
  parseAsync: (data: any) => Promise<UserResponse>;
};
export type IUsersRepositoryTypes = {
  insert: (newUser: User) => Promise<void>;
  find: (filter: FindUserFilter) => Promise<User[]>;
  update: () => Promise<void>;
  delete: () => Promise<void>;
};
export type IUsersRepositoryOptionsTypes = {
  entities: Collection<User>;
};
export type IUsersServiceTypes = {
  insert: (newUser: InsertUserRequest) => Promise<UserResponse>;
  find: (filter: FindUserFilter) => Promise<UserResponse[]>;
  update: () => Promise<void>;
  delete: () => Promise<void>;
};
export type IUsersServiceOptionsTypes = {
  repository: IUsersRepository;
  entityParser: IUserParser;
  entityResponseParser: IUserResponseParser;
};
