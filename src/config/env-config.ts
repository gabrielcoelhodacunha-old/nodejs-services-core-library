import { env as ENV } from "node:process";
import "dotenv/config";
import { Env } from "../types";

export const env: Env = {
  APP_NAME: "nodejs-user-registration-service",
  PROTOCOL: ENV.APP_PROTOCOL || "http",
  HOST: ENV.APP_HOST || "localhost",
  PORT: Number.parseInt(ENV.APP_PORT || "3000"),
  BASE_URL: "",
  MONGO_USER: ENV.MONGO_USER || "username",
  MONGO_PASSWORD: ENV.MONGO_PASSWORD || "password",
  MONGO_HOST: ENV.MONGO_HOST || "localhost",
  MONGO_PORT: Number.parseInt(ENV.MONGO_PORT || "27017"),
  MONGO_DATABASE: ENV.MONGO_DATABASE || "nodejs_services",
  MONGO_URI: "",
};

env.BASE_URL = `${env.PROTOCOL}://${env.HOST}:${env.PORT}`;
env.MONGO_URI = `mongodb://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DATABASE}`;
