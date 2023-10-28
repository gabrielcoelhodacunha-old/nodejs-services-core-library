import * as functions from "../../../utils/functions";
import {
  InsertUserRequest,
  transformInsertUserRequest,
} from "../InsertUserRequest";

describe("Unit Testing | InsertUserRequest", () => {
  describe("transformInsertUserRequest", () => {
    const spies = {} as { utils: { hashString: jest.SpyInstance } };

    beforeAll(() => {
      spies.utils = {
        hashString: jest.spyOn(functions, "hashString").mockImplementation(),
      };
    });

    it(`given input is valid
        when I try to transform it
        then I should return the transformed data`, async () => {
      let input: { email: string; password: string };
      let hashedPassword: string;
      let expected: InsertUserRequest;
      async function arrange() {
        input = { email: "test@email.com", password: "password" };
        hashedPassword = `${input.password}.hashedSalt`;
        expected = {
          ...input,
          password: hashedPassword,
        };
        spies.utils.hashString.mockResolvedValueOnce(hashedPassword);
      }
      async function act() {
        try {
          return transformInsertUserRequest(input);
        } catch (error) {
          return error;
        }
      }
      async function assert(actResult: unknown) {
        expect(actResult).toStrictEqual<InsertUserRequest>(expected);
      }

      await arrange().then(act).then(assert);
    });
  });
});
