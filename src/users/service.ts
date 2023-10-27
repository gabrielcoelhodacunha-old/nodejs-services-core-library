import type {
  IUserParser,
  IUserResponseParser,
  IUsersRepository,
  IUsersService,
  IUsersServiceOptions,
} from "./interfaces";
import type { InsertUserRequest, FindUserFilter, UserResponse } from "./types";
import { UserExistsError, UserNotFoundError } from "./errors";
import { userParser, userResponseParser } from "./parsers";
import { usersRepository } from "./repository";

export class UsersService implements IUsersService {
  private readonly _repository: IUsersRepository;
  private readonly _userParser: IUserParser;
  private readonly _userResponseParser: IUserResponseParser;

  constructor(
    { repository, entityParser, entityResponseParser }: IUsersServiceOptions = {
      repository: usersRepository,
      entityParser: userParser,
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

  async find(filter: FindUserFilter): Promise<UserResponse[]> {
    const users = await this._find(filter);
    if (!users) throw new UserNotFoundError();
    return users;
  }

  private async _find(filter: FindUserFilter): Promise<UserResponse[] | null> {
    try {
      return await this._repository
        .find(filter)
        .then((users) =>
          Promise.all(
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

  async update(): Promise<any> {}
  async delete(): Promise<any> {}
}

export const usersService = new UsersService();
