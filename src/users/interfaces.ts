import {
  IParser,
  IRepository,
  IRepositoryOptions,
  IService,
  IServiceOptions,
} from "../utils";
import { InsertUserRequest, User, UserResponse, FindUserFilter } from "./types";

export interface IUserParser extends IParser {
  parseAsync: (data: any) => Promise<User>;
}
export interface IUserResponseParser extends IParser {
  parseAsync: (data: any) => Promise<UserResponse>;
}

export interface IUsersRepository extends IRepository {
  insert: (newUser: User) => Promise<void>;
  find: (filter: FindUserFilter) => Promise<User[]>;
}
export interface IUsersRepositoryOptions extends IRepositoryOptions {}

export interface IUsersService extends IService {
  insert: (newUser: InsertUserRequest) => Promise<UserResponse>;
  find: (filter: FindUserFilter) => Promise<User[] | null>;
}
export interface IUsersServiceOptions extends IServiceOptions {
  repository: IUsersRepository;
  entityParser: IUserParser;
  entityResponseParser: IUserResponseParser;
}
