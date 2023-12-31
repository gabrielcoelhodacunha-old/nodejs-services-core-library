import { AbstractCursor, Collection, UUID } from "mongodb";
import { FindUserRequest, UserModel, UserNotFoundError } from "../..";
import { UsersRepository } from "../UsersRepository";

describe("Unit Testing | UsersRepository", () => {
  const spies = {} as {
    abstractCursor: jest.MockedObject<AbstractCursor<UserModel>>;
    entities: jest.MockedObject<Collection<UserModel>>;
  };
  const sut = {} as { repository: UsersRepository };

  beforeAll(() => {
    spies.abstractCursor = {
      toArray: jest.fn(),
    } as jest.MockedObject<AbstractCursor<UserModel>>;
    spies.entities = {
      insertOne: jest.fn(),
      find: jest.fn().mockImplementation(() => spies.abstractCursor),
    } as jest.MockedObject<Collection<UserModel>>;
    sut.repository = new UsersRepository({ entities: spies.entities });
  });

  describe(`feature: insert user`, () => {
    describe("scenario: insert is sucessful", () => {
      it(`given new user is valid
          when I try to insert the user to the database
          then I should insert it`, async () => {
        let newUser: UserModel;
        async function arrange() {
          newUser = {
            external_id: new UUID(),
            email: "test@test.com",
            password: "password",
            created_at: new Date(),
          };
        }
        async function act() {
          try {
            return await sut.repository.insert(newUser);
          } catch (error) {
            return error;
          }
        }
        async function assert(actResult: unknown) {
          expect(actResult).toBeUndefined();
        }

        await arrange().then(act).then(assert);
      });
    });
  });

  describe(`feature: find users`, () => {
    const uuid = new UUID();
    const id = uuid.toHexString();
    const email = "test@test.com";
    const filters = ["", "external id", "email", "external id and email"];
    const requests: FindUserRequest[] = [{}, { id }, { email }, { id, email }];

    describe("scenario: find is sucessful", () => {
      function getTestDescription(filter: string): string {
        let description = "given ";
        description += filter
          ? `${filter} matches users in database`
          : "no filter is provided";
        description += `
          when I try to find users
          then I should find `;
        description += filter ? "them" : "all users";
        return description;
      }

      const expected = [
        [requests[1], requests[2], requests[3]],
        [requests[1]],
        [requests[2]],
        [requests[3]],
      ];

      const cases = filters.map((_filter, idx) => ({
        description: getTestDescription(_filter),
        filter: requests[idx],
        expected: expected[idx] as UserModel[],
      }));

      it.each(cases)(
        "$description",
        async ({ filter, expected }: (typeof cases)[0]) => {
          async function arrange() {
            spies.abstractCursor.toArray.mockResolvedValueOnce(expected);
          }
          async function act() {
            try {
              return await sut.repository.find(filter);
            } catch (error) {
              return error;
            }
          }
          async function assert(actResult: unknown) {
            expect(actResult).toStrictEqual(expected);
          }

          await arrange().then(act).then(assert);
        }
      );
    });

    describe("scenario: find results in error", () => {
      function getTestDescription(filter: string) {
        let description = "given ";
        description += filter
          ? `${filter} doesn't belong to user in database`
          : `no filter is provided
            and there are no users in the database`;
        description += `
          when I try to find users
          then the UserNotFoundError should be thrown`;
        return description;
      }

      const cases = filters.map((_filter, idx) => ({
        description: getTestDescription(_filter),
        filter: requests[idx],
      }));

      it.each(cases)("$description", async ({ filter }: (typeof cases)[0]) => {
        async function arrange() {
          spies.abstractCursor.toArray.mockResolvedValueOnce([]);
        }
        async function act() {
          try {
            return await sut.repository.find(filter);
          } catch (error) {
            return error;
          }
        }
        async function assert(actResult: unknown) {
          expect(actResult).toBeInstanceOf(UserNotFoundError);
        }

        await arrange().then(act).then(assert);
      });
    });
  });
});
