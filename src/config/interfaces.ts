import { RequestHandler } from "express";
import { Collection, Document } from "mongodb";

export interface IRepository {
  find: (filter: any) => Promise<any>;
  create: (newEntity: any) => Promise<any>;
}

export interface IRepositoryOptions<ENTITY extends Document> {
  collection: Collection<ENTITY>;
}

export interface IService {
  create: (newEntity: any) => Promise<any>;
}

export interface IServiceOptions<I_REPOSITORY extends IRepository> {
  repository: I_REPOSITORY;
}

export interface IController {
  create: RequestHandler;
}

export interface IControllerOptions<I_SERVICE extends IService> {
  service: I_SERVICE;
}
