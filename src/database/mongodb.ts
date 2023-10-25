import { MongoClient } from "mongodb";
import { env } from "../config";

export const mongoClient = new MongoClient(env.MONGO_URI, {
  appName: env.APP_NAME,
  authSource: "admin",
});

export const database = mongoClient.db();
