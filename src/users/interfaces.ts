import { IRepository, IService } from "../utils";
import { CreateUserRequest, User, UserResponse, FindUserFilter } from "./types";

export interface IUsersRepository extends IRepository {
  insert: (newUser: User) => Promise<void>;
  find: (findUserFilter: FindUserFilter) => Promise<User[]>;
}
export interface IUsersService extends IService {
  insert: (createUserRequest: CreateUserRequest) => Promise<UserResponse>;
}
