import type { IParser } from "../../utils";
import type { UserModel } from "./UserModel";

type IUserModelParserTypes = {
  parseAsync: (data: any) => Promise<UserModel>;
};

export interface IUserModelParser extends IParser<IUserModelParserTypes> {}
