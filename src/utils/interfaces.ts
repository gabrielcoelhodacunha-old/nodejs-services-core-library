import type {
  IParserTypes,
  IReadTypes,
  IRepositoryOptionsTypes,
  IRepositoryTypes,
  IServiceOptionsTypes,
  IServiceTypes,
  IWriteTypes,
} from "./types";

export interface IRead<TYPES extends IReadTypes> {
  find: TYPES["find"];
}

interface IWrite<TYPES extends IWriteTypes> {
  insert: TYPES["insert"];
  update: TYPES["update"];
  delete: TYPES["delete"];
}

export interface IParser<TYPES extends IParserTypes> {
  parseAsync: TYPES["parseAsync"];
}

export interface IRepository<TYPES extends IRepositoryTypes>
  extends IRead<TYPES>,
    IWrite<TYPES> {}

export interface IRepositoryOptions<TYPES extends IRepositoryOptionsTypes> {
  entities: TYPES["entities"];
}

export interface IService<TYPES extends IServiceTypes>
  extends IRepository<TYPES> {}

export interface IServiceOptions<TYPES extends IServiceOptionsTypes> {
  repository: TYPES["repository"];
  entityParser: TYPES["entityParser"];
  entityResponseParser: TYPES["entityResponseParser"];
}
