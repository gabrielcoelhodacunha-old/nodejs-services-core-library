import { UUID } from "mongodb";
import { isUUID } from "../functions";

describe("Unit Testing | mongodb | functions", () => {
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
