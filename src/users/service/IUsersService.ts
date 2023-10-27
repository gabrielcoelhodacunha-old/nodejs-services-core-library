import type { IService, IServiceOptions } from "../../utils";
import type { IUserModelParser } from "../model";
import type { IUsersRepository } from "../repository";
import type { FindUserRequest, InsertUserRequest } from "../requests";
import type { IUserResponseParser, UserResponse } from "../response";

type IUsersServiceOptionsTypes = {
  repository: IUsersRepository;
  entityParser: IUserModelParser;
  entityResponseParser: IUserResponseParser;
};

export interface IUsersServiceOptions
  extends IServiceOptions<IUsersServiceOptionsTypes> {}

type IUsersServiceTypes = {
  insert: (newUser: InsertUserRequest) => Promise<UserResponse>;
  find: (filter: FindUserRequest) => Promise<UserResponse[]>;
  update: () => Promise<void>;
  delete: () => Promise<void>;
};

export interface IUsersService extends IService<IUsersServiceTypes> {}
