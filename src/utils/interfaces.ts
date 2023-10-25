interface IRead {
  find: (filter: any) => Promise<any>;
}

interface IWrite {
  insert: (newEntity: any) => Promise<any>;
  update: (entity: any) => Promise<any>;
  delete: (filter: any) => Promise<any>;
}

export interface IRepository extends IRead, IWrite {}
export interface IService extends IRead, IWrite {}
