import { z } from "zod";
import { envParser } from "./parsers";
import type { IParser, IRepository } from "./interfaces";

export type Env = z.infer<typeof envParser>;

export type IReadTypes = {
  find: (filter: any) => Promise<any>;
};

export type IWriteTypes = {
  insert: (newEntity: any) => Promise<any>;
  update: (entity: any) => Promise<any>;
  delete: (filter: any) => Promise<any>;
};

export type IParserTypes = {
  parseAsync: (data: any) => Promise<any>;
};

export type IRepositoryTypes = IReadTypes & IWriteTypes;

export type IRepositoryOptionsTypes = {
  entities: any;
};

export type IServiceTypes = IRepositoryTypes;

export type IServiceOptionsTypes = {
  repository: IRepository<any>;
  entityParser: IParser<any>;
  entityResponseParser: IParser<any>;
};
