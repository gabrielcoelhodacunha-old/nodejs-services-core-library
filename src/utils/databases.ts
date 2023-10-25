import { MongoClient } from "mongodb";
import { env } from "./constants";

export const mongoClient = new MongoClient(env.MONGO_URI, {
  appName: env.APP_NAME,
  authSource: "admin",
});

export const mongoDatabase = mongoClient.db();
