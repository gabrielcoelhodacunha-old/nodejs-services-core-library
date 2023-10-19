import {
  IController,
  IControllerOptions,
  IRepository,
  IRepositoryOptions,
  IService,
  IServiceOptions,
} from "../types/config";
import { CreateUserRequest, User, UserResponse, FindUserFilter } from "./types";

export interface IUsersRepository extends IRepository {
  create: (newUser: User) => Promise<void>;
  find: (findUserFilter: FindUserFilter) => Promise<User>;
}
export interface IUsersRepositoryOptions extends IRepositoryOptions<User> {}
export interface IUsersService extends IService {
  create: (createUserRequest: CreateUserRequest) => Promise<UserResponse>;
}
export interface IUsersServiceOptions
  extends IServiceOptions<IUsersRepository> {}
export interface IUsersController extends IController {}
export interface IUsersControllerOptions
  extends IControllerOptions<IUsersService> {}
