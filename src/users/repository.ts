import { Collection, UUID } from "mongodb";
import { mongoDatabase } from "../utils";
import type { FindUserFilter, User } from "./types";
import type { IUsersRepository, IUsersRepositoryOptions } from "./interfaces";
import { UserNotFoundError } from "./errors";

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

  async find({ id, ...rest }: FindUserFilter): Promise<User[]> {
    const user = await this._entities
      .find<User>(
        { external_id: id ? new UUID(id) : undefined, ...rest },
        { projection: { _id: 0 } }
      )
      .toArray();
    if (!user.length) throw new UserNotFoundError();
    return user;
  }

  async update(): Promise<void> {}
  async delete(): Promise<void> {}
}

export const usersRepository = new UsersRepository();
