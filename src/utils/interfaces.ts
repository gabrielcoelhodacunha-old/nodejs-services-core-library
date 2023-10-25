interface IRead {
  find: (filter: any) => Promise<any>;
}

interface IWrite {
  insert: (newEntity: any) => Promise<any>;
  update: (entity: any) => Promise<any>;
  delete: (filter: any) => Promise<any>;
}

export interface IParser {
  parseAsync: (data: any) => Promise<any>;
}

export interface IRepository extends IRead, IWrite {}
export interface IRepositoryOptions {
  entities: any;
}

export interface IService extends IRead, IWrite {}
export interface IServiceOptions {
  repository: IRepository;
  entityParser: IParser;
  entityResponseParser: IParser;
}
