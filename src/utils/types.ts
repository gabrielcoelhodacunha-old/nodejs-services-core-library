import { IRepository } from "./interfaces";

export type IRepositoryOptions = {
  entities: any;
};

export type IServiceOptions<I_REPOSITORY extends IRepository> = {
  repository: I_REPOSITORY;
};
