import {
  InsertUserRequest,
  FindUserFilter,
  User,
  UserResponse,
} from "../../types";
import {
  IUserParser,
  IUserResponseParser,
  IUsersRepository,
} from "../../interfaces";
import { UserExistsError, UserNotFoundError } from "../../errors";
import { UsersService } from "../../service";

describe("Unit Testing | UsersService", () => {
  const spies = {} as {
    userParser: jest.MockedObject<IUserParser>;
    userResponseParser: jest.MockedObject<IUserResponseParser>;
    repository: jest.MockedObject<IUsersRepository>;
  };
  const sut = {} as { service: UsersService };

  beforeAll(() => {
    spies.userParser = {
      parseAsync: jest.fn(),
    } as jest.MockedObject<IUserParser>;
    spies.userResponseParser = {
      parseAsync: jest.fn(),
    } as jest.MockedObject<IUserResponseParser>;
    spies.repository = {
      insert: jest.fn(),
      find: jest.fn(),
    } as jest.MockedObject<IUsersRepository>;
    sut.service = new UsersService({
      repository: spies.repository,
      entityParser: spies.userParser,
      entityResponseParser: spies.userResponseParser,
    });
  });

  /*
  describe(`feature: insert user`, () => {
    const featureSpies = {} as {
      service: { find: jest.SpyInstance };
    };

    beforeAll(() => {
      featureSpies.service = {
        find: jest.spyOn(sut.service, "find").mockImplementation(),
      };
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    describe("scenario: insert is sucessful", () => {
      it(`given new user is valid
          when I try to insert the user
          then I should insert it`, async () => {
        let newUser: InsertUserRequest;
        let user: User;
        let expected: UserResponse;
        async function arrange() {
          newUser = {
            email: "test@test.com",
            password: "password",
          };
          user = newUser as User;
          expected = newUser as UserResponse;
          featureSpies.service.find.mockResolvedValueOnce(null);
          spies.userParser.parseAsync.mockResolvedValueOnce(user);
          featureSpies.service.find.mockResolvedValueOnce([user]);
          spies.userResponseParser.parseAsync.mockResolvedValueOnce(expected);
        }
        async function act() {
          try {
            return await sut.service.insert(newUser);
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

    describe("scenario: insert results in error", () => {
      it(`given email belongs to an existing user
          when I try to insert the user
          then the UserExistsError should be thrown`, async () => {
        let newUser: InsertUserRequest;
        let user: User;
        async function arrange() {
          newUser = {
            email: "test@test.com",
            password: "password",
          };
          user = newUser as User;
          featureSpies.service.find.mockResolvedValueOnce([user]);
        }
        async function act() {
          try {
            return await sut.service.insert(newUser);
          } catch (error) {
            return error;
          }
        }
        async function assert(actResult: unknown) {
          expect(actResult).toBeInstanceOf(UserExistsError);
        }

        await arrange().then(act).then(assert);
      });
    });
  });
  */

  describe(`feature: find users`, () => {
    const external_id = new UUID();
    const email = "test@test.com";
    const filters = ["", "external id", "email", "external id and email"];
    const findUserFilter: FindUserFilter[] = [
      {},
      { external_id },
      { email },
      { external_id, email },
    ];

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
        [findUserFilter[1], findUserFilter[2], findUserFilter[3]],
        [findUserFilter[1]],
        [findUserFilter[2]],
        [findUserFilter[3]],
      ];

      const cases = filters.map((_filter, idx) => ({
        description: getTestDescription(_filter),
        filter: findUserFilter[idx],
        expected: expected[idx] as User[],
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
        filter: findUserFilter[idx],
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

  describe("feature: find users", () => {
    describe("scenario: find results in error", () => {
      it(`given an unexpected error occurs
          when I try to find users
          then the unexpected error should be thrown`, async () => {
        let filter: FindUserFilter;
        let expected: Error;
        async function arrange() {
          filter = { email: "test@test.com" };
          expected = new Error("Unexpected error");
          spies.repository.find.mockRejectedValueOnce(expected);
        }
        async function act() {
          try {
            return await sut.service.find(filter);
          } catch (error) {
            return error;
          }
        }
        async function assert(actResult: unknown) {
          expect(actResult).toBe(expected);
        }

        await arrange().then(act).then(assert);
      });
    });
  });
});
