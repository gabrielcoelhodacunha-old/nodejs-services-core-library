import type { Collection } from "mongodb";
import type { IRepository, IRepositoryOptions } from "../../utils";
import type { UserModel } from "../model";
import type { FindUserRequest } from "../requests";

type IUsersRepositoryOptionsTypes = {
  entities: Collection<UserModel>;
};

export interface IUsersRepositoryOptions
  extends IRepositoryOptions<IUsersRepositoryOptionsTypes> {}

type IUsersRepositoryTypes = {
  insert: (newUser: UserModel) => Promise<void>;
  find: (filter: FindUserRequest) => Promise<UserModel[]>;
  update: () => Promise<void>;
  delete: () => Promise<void>;
};

export interface IUsersRepository extends IRepository<IUsersRepositoryTypes> {}
