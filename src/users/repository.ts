import { Collection } from "mongodb";
import { mongoDatabase } from "../utils";
import { UserNotFoundError } from "./errors";
import { FindUserFilter, User } from "./types";
import { IUsersRepository, IUsersRepositoryOptions } from "./interfaces";

export class UsersRepository implements IUsersRepository {
  private readonly _entities: Collection<User>;

  constructor(
    { entities }: IUsersRepositoryOptions = {
      entities: mongoDatabase.collection<User>("users"),
    }
  ) {
    this._entities = entities;
  }

  async insert(newUser: User): Promise<void> {
    await this._entities.insertOne(newUser);
  }

  async find({id, ...rest}: FindUserFilter): Promise<User[]> {
    const user = await this._entities
      .find<User>({external_id: }, { projection: { _id: 0 } })
      .toArray();
    if (!user.length) throw new UserNotFoundError();
    return user;
  }

  async update(entity: any): Promise<any> {}
  async delete(entity: any): Promise<any> {}
}

export const usersRepository = new UsersRepository();
