import { Collection } from "mongodb";
import { database } from "../database";
import {
  IUsersRepository,
  IUsersRepositoryOptions,
  User,
  FindUserFilter,
  UserNotFoundError,
} from "../types";

export class UsersRepository implements IUsersRepository {
  private readonly _collection: Collection<User>;

  constructor(
    { collection }: IUsersRepositoryOptions = {
      collection: database.collection<User>("users"),
    }
  ) {
    this._collection = collection;
  }

  async create(newUser: User): Promise<void> {
    await this._collection.insertOne(newUser);
  }

  async find(findUserFilter: FindUserFilter): Promise<User> {
    const user = await this._collection.findOne<User>(findUserFilter, {
      projection: { _id: 0 },
    });
    if (!user) throw new UserNotFoundError();
    return user;
  }
}

export const usersRepository = new UsersRepository();
