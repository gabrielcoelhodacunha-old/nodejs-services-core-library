import type { IParser } from "../utils";
import type {
  FindUserFilter,
  InsertUserRequest,
  User,
  UserResponse,
} from "./types";
import {
  findUserFilterParser,
  insertUserRequestParser,
  userParser,
  userResponseParser,
} from "./parsers";

type UsersParserMap = {
  FindUserFilter: typeof findUserFilterParser;
  InsertUserRequest: typeof insertUserRequestParser;
  User: typeof userParser;
  UserResponse: typeof userResponseParser;
};

type UsersParserOptions = {
  parsers: UsersParserMap;
};

type UsersParserReturns =
  | FindUserFilter
  | InsertUserRequest
  | User
  | UserResponse;

interface IUsersParser
  extends IParser<{
    parseAsync: (
      data: unknown,
      type?: keyof UsersParserMap
    ) => Promise<UsersParserReturns>;
  }> {}

export class UsersParser implements IUsersParser {
  private readonly _parsers: UsersParserMap;

  constructor(
    { parsers }: UsersParserOptions = {
      parsers: {
        FindUserFilter: findUserFilterParser,
        InsertUserRequest: insertUserRequestParser,
        User: userParser,
        UserResponse: userResponseParser,
      },
    }
  ) {
    this._parsers = parsers;
  }

  async parseAsync(
    data: unknown,
    type: keyof UsersParserMap = "User"
  ): Promise<UsersParserReturns> {
    return this._parsers[type].parseAsync(data);
  }
}

export const usersParser = new UsersParser();
