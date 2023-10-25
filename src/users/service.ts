import { UserExistsError, UserNotFoundError } from "./errors";
import {
  IUserParser,
  IUserResponseParser,
  IUsersRepository,
  IUsersService,
  IUsersServiceOptions,
} from "./interfaces";
import { userParser, userResponseParser } from "./parsers";
import { usersRepository } from "./repository";
import { InsertUserRequest, FindUserFilter, User, UserResponse } from "./types";

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
    await this.find({ email }).then((users) => {
      if (users) throw new UserExistsError(email);
    });
    await this._userParser
      .parseAsync({ email, ...rest })
      .then(async (user) => await this._repository.insert(user));
    return await this.find({ email }).then(
      async (users) => await this._userResponseParser.parseAsync(users?.[0])
    );
  }

  async find(filter: FindUserFilter): Promise<User[] | null> {
    try {
      return await this._repository.find(filter);
    } catch (error) {
      if (!(error instanceof UserNotFoundError)) throw error;
      return null;
    }
  }

  async update(entity: any): Promise<any> {}
  async delete(entity: any): Promise<any> {}
}

export const usersService = new UsersService();
