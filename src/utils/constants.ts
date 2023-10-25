import "dotenv/config";
import { envParser } from "./parsers";

export const env = envParser.parse(process.env);
