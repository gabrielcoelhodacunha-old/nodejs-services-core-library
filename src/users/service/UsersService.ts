import { UserExistsError, UserNotFoundError } from "../errors";
import { IUserModelParser, userModelParser } from "../model";
import { IUsersRepository, usersRepository } from "../repository";
import type { FindUserRequest, InsertUserRequest } from "../requests";
import {
  IUserResponseParser,
  UserResponse,
  userResponseParser,
} from "../response";
import type { IUsersService, IUsersServiceOptions } from "./IUsersService";

export class UsersService implements IUsersService {
  private readonly _repository: IUsersRepository;
  private readonly _userParser: IUserModelParser;
  private readonly _userResponseParser: IUserResponseParser;

  constructor(
    { repository, entityParser, entityResponseParser }: IUsersServiceOptions = {
      repository: usersRepository,
      entityParser: userModelParser,
      entityResponseParser: userResponseParser,
    }
  ) {
    this._repository = repository;
    this._userParser = entityParser;
    this._userResponseParser = entityResponseParser;
  }

  async insert({ email, ...rest }: InsertUserRequest): Promise<UserResponse> {
    await this._find({ email }).then((users) => {
      if (users) throw new UserExistsError(email);
    });
    await this._userParser
      .parseAsync({ email, ...rest })
      .then(async (user) => await this._repository.insert(user));
    return (await this.find({ email }))[0];
  }

  async find(filter: FindUserRequest): Promise<UserResponse[]> {
    const users = await this._find(filter);
    if (!users) throw new UserNotFoundError();
    return users;
  }

  private async _find(filter: FindUserRequest): Promise<UserResponse[] | null> {
    try {
      return await this._repository
        .find(filter)
        .then(
          async (users) =>
            await Promise.all(
              users.map(
                async (user) => await this._userResponseParser.parseAsync(user)
              )
            )
        );
    } catch (error) {
      if (!(error instanceof UserNotFoundError)) throw error;
      return null;
    }
  }

  /* istanbul ignore next */
  async update(): Promise<any> {}
  /* istanbul ignore next */
  async delete(): Promise<any> {}
}

export const usersService = new UsersService();
