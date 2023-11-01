import { z } from "zod";
import { mongoEnvParser } from "./parsers";

export type MongoEnv = z.infer<typeof mongoEnvParser>;
