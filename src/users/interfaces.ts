import type {
  IParser,
  IRepository,
  IRepositoryOptions,
  IService,
  IServiceOptions,
} from "../utils";
import type {
  IUserParserTypes,
  IUserResponseParserTypes,
  IUsersRepositoryTypes,
  IUsersRepositoryOptionsTypes,
  IUsersServiceTypes,
  IUsersServiceOptionsTypes,
} from "./types";

export interface IUserParser extends IParser<IUserParserTypes> {}
export interface IUserResponseParser
  extends IParser<IUserResponseParserTypes> {}

export interface IUsersRepository extends IRepository<IUsersRepositoryTypes> {}
export interface IUsersRepositoryOptions
  extends IRepositoryOptions<IUsersRepositoryOptionsTypes> {}

export interface IUsersService extends IService<IUsersServiceTypes> {}
export interface IUsersServiceOptions
  extends IServiceOptions<IUsersServiceOptionsTypes> {}
