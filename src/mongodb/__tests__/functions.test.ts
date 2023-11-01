import { UUID } from "mongodb";
import { isUUID, transformMongoEnv } from "../functions";
import { MongoEnv } from "../types";

describe("Unit Testing | mongodb | functions", () => {
  describe("transformMongoEnv", () => {
    it(`given input is valid
        when I try to transform it
        then I should transform it`, async () => {
      let input: MongoEnv;
      let expected: MongoEnv;
      async function arrange() {
        input = {
          APP_NAME: "test",
          MONGO_USER: "username",
          MONGO_PASSWORD: "password",
          MONGO_HOST: "localhost",
          MONGO_PORT: 27017,
          MONGO_DATABASE: "nodejs_services",
          MONGO_URI: "",
        };
        expected = {
          ...input,
          MONGO_URI: `mongodb://${input.MONGO_USER}:${input.MONGO_PASSWORD}@${input.MONGO_HOST}:${input.MONGO_PORT}/${input.MONGO_DATABASE}`,
        };
      }
      async function act() {
        try {
          return transformMongoEnv(input);
        } catch (error) {
          return error;
        }
      }
      async function assert(actResult: unknown) {
        expect(actResult).toStrictEqual<MongoEnv>(expected);
      }

      await arrange().then(act).then(assert);
    });
  });

  describe("isUUID", () => {
    function getDescription(expected: boolean) {
      let description = "given input is ";
      description += expected ? "" : "not ";
      description += "an UUID";
      description += `
        when I check if it is 
        then I should return ${expected}`;
      return description;
    }
    const input = [new UUID(), {}];
    const expected = [true, false];
    const cases = expected.map((expected, idx) => ({
      description: getDescription(expected),
      input: input[idx],
      expected,
    }));
    it.each(cases)(
      "$description",
      async ({ input, expected }: (typeof cases)[0]) => {
        async function arrange() {}
        async function act() {
          try {
            return isUUID(input);
          } catch (error) {
            return error;
          }
        }
        async function assert(actResult: unknown) {
          expect(actResult).toBe<boolean>(expected);
        }

        await arrange().then(act).then(assert);
      }
    );
  });
});
