import bcrypt from "bcrypt";
import type { Env } from "../types";
import { hashString, transformEnv } from "../functions";

describe("Unit Testing | utils | functions", () => {
  describe("hashString", () => {
    const spies = {} as {
      bcrypt: { genSalt: jest.SpyInstance; hash: jest.SpyInstance };
    };

    beforeAll(() => {
      spies.bcrypt = {
        genSalt: jest.spyOn(bcrypt, "genSalt").mockImplementation(),
        hash: jest.spyOn(bcrypt, "hash").mockImplementation(),
      };
    });

    it(`given input is valid
        when I try to hash it
        then I should return the hashed input`, async () => {
      let input: string;
      let salt: string;
      let expected: string;
      async function arrange() {
        input = "my-test-input";
        salt = "my-test-salt";
        expected = "my-hashed-test-input";
        spies.bcrypt.genSalt.mockResolvedValueOnce(salt);
        spies.bcrypt.hash.mockResolvedValueOnce(expected);
      }
      async function act() {
        try {
          return hashString(input);
        } catch (error) {
          return error;
        }
      }
      async function assert(actResult: unknown) {
        expect(actResult).toBe<string>(expected);
      }

      await arrange().then(act).then(assert);
    });
  });

  describe("transformEnv", () => {
    it(`given input is valid
        when I try to transform it
        then I should transform it`, async () => {
      let input: Env;
      let expected: Env;
      async function arrange() {
        input = {
          APP_NAME: "test",
          PROTOCOL: "http",
          HOST: "localhost",
          PORT: 3000,
          BASE_URL: "",
          MONGO_USER: "username",
          MONGO_PASSWORD: "password",
          MONGO_HOST: "localhost",
          MONGO_PORT: 27017,
          MONGO_DATABASE: "nodejs_services",
          MONGO_URI: "",
        };
        expected = {
          ...input,
          BASE_URL: `${input.PROTOCOL}://${input.HOST}:${input.PORT}`,
          MONGO_URI: `mongodb://${input.MONGO_USER}:${input.MONGO_PASSWORD}@${input.MONGO_HOST}:${input.MONGO_PORT}/${input.MONGO_DATABASE}`,
        };
      }
      async function act() {
        try {
          return transformEnv(input);
        } catch (error) {
          return error;
        }
      }
      async function assert(actResult: unknown) {
        expect(actResult).toStrictEqual<Env>(expected);
      }

      await arrange().then(act).then(assert);
    });
  });
});
