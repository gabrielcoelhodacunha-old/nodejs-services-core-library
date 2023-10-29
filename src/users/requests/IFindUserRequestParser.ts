import type { IParser } from "../../utils";
import type { FindUserRequest } from "./FindUserRequest";

type IFindUserRequestParserTypes = {
  parseAsync: (data: any) => Promise<FindUserRequest>;
};

export interface IFindUserRequestParser
  extends IParser<IFindUserRequestParserTypes> {}
