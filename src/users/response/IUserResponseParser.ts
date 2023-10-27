import type { IParser } from "../../utils";
import type { UserResponse } from "./UserResponse";

type IUserResponseParserTypes = {
  parseAsync: (data: any) => Promise<UserResponse>;
};

export interface IUserResponseParser
  extends IParser<IUserResponseParserTypes> {}
