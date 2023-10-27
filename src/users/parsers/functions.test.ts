import { UUID } from "mongodb";
import type { User, UserResponse } from "../types";
import { transformUserResponse } from "./functions";

describe("Unit Testing | ", () => {
  describe("transformUserResponse", () => {
    it(`given input is valid
      when I try to transform it
      then I should return the transformed data`, async () => {
      let input: User;
      let expected: UserResponse;
      async function arrange() {
        input = {
          external_id: new UUID(),
          email: "test@test.com",
          password: "password",
          created_at: new Date(),
        };
        expected = {
          id: input.external_id.toHexString(),
          email: input.email,
          password: input.password,
          createdAt: input.created_at,
        };
      }
      async function act() {
        try {
          return transformUserResponse(input);
        } catch (error) {
          return error;
        }
      }
      async function assert(actResult: unknown) {
        expect(actResult).toStrictEqual(expected);
      }

      await arrange().then(act).then(assert);
    });
  });
});
