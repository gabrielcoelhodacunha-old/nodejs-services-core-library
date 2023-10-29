import { MongoClient } from "mongodb";
import { env } from "../utils";

export const mongoClient = new MongoClient(env.MONGO_URI, {
  appName: env.APP_NAME,
  authSource: "admin",
});

export const mongoDatabase = mongoClient.db();

export const uuidBsonType = {
  bsonType: "binData",
  properties: {
    subType: {
      enum: ["04"],
    },
  },
};
