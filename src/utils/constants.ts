import "dotenv/config";
import { envParser } from "./parsers";
import { transformEnv } from "./functions";

export const env = envParser.transform(transformEnv).parse(process.env);
