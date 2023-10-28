import { UUID } from "mongodb";
import { FindUserRequest, transformFindUserRequest } from "../FindUserRequest";

describe("Unit Testing | FindUserRequest", () => {
  describe("transformFindUserRequest", () => {
    function getTestDescription(filter: string) {
      let description = "given ";
      description += filter ? `${filter}` : "no filter is provided";
      description += `
        when I try to transform it
        then I should return the transformed input`;
      return description;
    }
    const filters = ["", "external id", "email", "external id and email"];
    const inputs = [
      {},
      { external_id: new UUID() },
      { email: "test@test.com" },
      { external_id: new UUID(), email: "test@test.com" },
    ];
    const expected: FindUserRequest[] = [
      {},
      { id: inputs[1].external_id?.toHexString() },
      { email: inputs[2].email },
      { id: inputs[3].external_id?.toHexString(), email: inputs[3].email },
    ];
    const cases = filters.map((filter, idx) => ({
      description: getTestDescription(filter),
      input: inputs[idx],
      expected: expected[idx],
    }));

    it.each(cases)(
      "$description",
      async ({ input, expected }: (typeof cases)[0]) => {
        async function arrange() {}
        async function act() {
          try {
            return transformFindUserRequest(input);
          } catch (error) {
            return error;
          }
        }
        async function assert(actResult: unknown) {
          expect(actResult).toStrictEqual<FindUserRequest>(expected);
        }

        await arrange().then(act).then(assert);
      }
    );
  });
});
