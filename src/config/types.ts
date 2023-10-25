import { z } from "zod";
import { envParser } from "./parsers";

export type Env = z.infer<typeof envParser>;
