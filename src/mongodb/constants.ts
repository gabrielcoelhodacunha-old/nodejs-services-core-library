import { MongoClient } from "mongodb";
import { mongoEnvParser } from "./parsers";
import { transformMongoEnv } from "./functions";

export const mongoEnv = mongoEnvParser
  .transform(transformMongoEnv)
  .parse(process.env);

export const mongoClient = new MongoClient(mongoEnv.MONGO_URI, {
  appName: mongoEnv.APP_NAME,
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
