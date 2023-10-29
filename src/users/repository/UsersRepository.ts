import { Collection, UUID } from "mongodb";
import { mongoDatabase } from "../../mongodb";
import { UserNotFoundError } from "../errors";
import type { UserModel } from "../model";
import type { FindUserRequest } from "../requests";
import type {
  IUsersRepository,
  IUsersRepositoryOptions,
} from "./IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private readonly _entities: Collection<UserModel>;

  constructor(
    { entities }: IUsersRepositoryOptions = {
      entities: mongoDatabase.collection<UserModel>("users"),
    }
  ) {
    this._entities = entities;
  }

  async insert(newUser: UserModel): Promise<void> {
    await this._entities.insertOne(newUser);
  }

  async find({ id, ...rest }: FindUserRequest): Promise<UserModel[]> {
    const users = await this._entities
      .find<UserModel>(
        { external_id: id ? new UUID(id) : undefined, ...rest },
        { projection: { _id: 0 } }
      )
      .toArray();
    if (!users.length) throw new UserNotFoundError();
    return users;
  }

  /* istanbul ignore next */
  async update(): Promise<void> {}
  /* istanbul ignore next */
  async delete(): Promise<void> {}
}

export const usersRepository = new UsersRepository();
