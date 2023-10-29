import type { IParser } from "../../utils";
import type { InsertUserRequest } from "./InsertUserRequest";

type IInsertUserRequestParserTypes = {
  parseAsync: (data: any) => Promise<InsertUserRequest>;
};

export interface IInsertUserRequestParser
  extends IParser<IInsertUserRequestParserTypes> {}
