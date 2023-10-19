import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  cache: true,
  verbose: false,
  automock: false,
  bail: 1,
  rootDir: ".",
  roots: ["src"],
  haste: { forceNodeFilesystemAPI: true, throwOnModuleCollision: true },
  coveragePathIgnorePatterns: ["config", "database", "types", "utils"],
  clearMocks: true,
};

export default config;
