import {
  CreateUserRequest,
  FindUserFilter,
  IUsersRepository,
  IUsersService,
  IUsersServiceOptions,
  User,
  UserExistsError,
  UserNotFoundError,
  UserResponse,
  userParser,
  userResponseParser,
} from "../types";
import { usersRepository } from "./repository";

export class UsersService implements IUsersService {
  private readonly _repository: IUsersRepository;

  constructor(
    { repository }: IUsersServiceOptions = { repository: usersRepository }
  ) {
    this._repository = repository;
  }

  async create({ email, ...rest }: CreateUserRequest): Promise<UserResponse> {
    await this._find({ email }).then((user) => {
      if (user) throw new UserExistsError(email);
    });
    await userParser
      .parseAsync({ email, ...rest })
      .then(async (user) => await this._repository.create(user));
    return this._find({ email }).then(userResponseParser.parseAsync);
  }

  private async _find(filter: FindUserFilter): Promise<User | null> {
    try {
      return await this._repository.find(filter);
    } catch (error) {
      if (!(error instanceof UserNotFoundError)) throw error;
      return null;
    }
  }
}

export const usersService = new UsersService();
