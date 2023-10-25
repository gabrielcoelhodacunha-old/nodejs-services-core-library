import { Collection } from "mongodb";
import { database } from "../../database";
import { UserNotFoundError } from "../errors";
import { FindUserFilter, IUsersRepositoryOptions, User } from "../types";
import { IUsersRepository } from "../interfaces";

export class UsersMongoRepository implements IUsersRepository {
  private readonly _entities: Collection<User>;

  constructor(
    { entities }: IUsersRepositoryOptions = {
      entities: database.collection<User>("users"),
    }
  ) {
    this._entities = entities;
  }

  async insert(newUser: User): Promise<void> {
    await this._entities.insertOne(newUser);
  }

  async find(findUserFilter: FindUserFilter): Promise<User[]> {
    const user = await this._entities
      .find<User>(findUserFilter, {
        projection: { _id: 0 },
      })
      .toArray();
    if (!user.length) throw new UserNotFoundError();
    return user;
  }

  async update(entity: any): Promise<any> {}
  async delete(entity: any): Promise<any> {}
}

export const usersMongoRepository = new UsersMongoRepository();
