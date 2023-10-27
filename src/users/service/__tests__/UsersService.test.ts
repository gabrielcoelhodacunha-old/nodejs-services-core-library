import { randomUUID } from "node:crypto";
import {
  FindUserRequest,
  IUserModelParser,
  IUserResponseParser,
  IUsersRepository,
  InsertUserRequest,
  UserExistsError,
  UserModel,
  UserNotFoundError,
  UserResponse,
} from "../..";
import { UsersService } from "../UsersService";

describe("Unit Testing | UsersService", () => {
  const spies = {} as {
    userParser: jest.MockedObject<IUserModelParser>;
    userResponseParser: jest.MockedObject<IUserResponseParser>;
    repository: jest.MockedObject<IUsersRepository>;
  };
  const sut = {} as { service: UsersService };

  beforeAll(() => {
    spies.userParser = {
      parseAsync: jest.fn(),
    } as jest.MockedObject<IUserModelParser>;
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
        let user: UserModel;
        let expected: UserResponse;
        async function arrange() {
          newUser = {
            email: "test@test.com",
            password: "password",
          };
          user = newUser as UserModel;
          expected = newUser as UserResponse;
          spies.repository.find.mockRejectedValueOnce(new UserNotFoundError());
          spies.userParser.parseAsync.mockResolvedValueOnce(user);
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
        let user: UserModel;
        async function arrange() {
          newUser = {
            email: "test@test.com",
            password: "password",
          };
          user = newUser as UserModel;
          spies.repository.find.mockResolvedValueOnce([user]);
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

      it(`given unexpected error occurs in _find
          when I try to insert the user
          then the unexpected error should be thrown`, async () => {
        let newUser: InsertUserRequest;
        let expected: Error;
        async function arrange() {
          newUser = {
            email: "test@test.com",
            password: "password",
          };
          expected = new Error("unexpected error");
          spies.repository.find.mockRejectedValueOnce(expected);
        }
        async function act() {
          try {
            return await sut.service.insert(newUser);
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

  describe(`feature: find users`, () => {
    const id = randomUUID();
    const email = "test@test.com";
    const filters = ["", "external id", "email", "external id and email"];
    const requests: FindUserRequest[] = [{}, { id }, { email }, { id, email }];

    describe("scenario: find is sucessful", () => {
      function getTestDescription(filter: string): string {
        let description = "given ";
        description += filter
          ? `${filter} matches users`
          : "no filter is provided";
        description += `
          when I try to find users
          then I should find `;
        description += filter ? "them" : "all users";
        return description;
      }

      const users = [
        [requests[1], requests[2], requests[3]],
        [requests[1]],
        [requests[2]],
        [requests[3]],
      ];

      const cases = filters.map((_filter, idx) => ({
        description: getTestDescription(_filter),
        filter: requests[idx],
        users: users[idx] as UserModel[],
        expected: users[idx] as UserResponse[],
      }));

      it.each(cases)(
        "$description",
        async ({ filter, users, expected }: (typeof cases)[0]) => {
          async function arrange() {
            spies.repository.find.mockResolvedValueOnce(users);
            expected.forEach((userResponse) =>
              spies.userResponseParser.parseAsync.mockResolvedValueOnce(
                userResponse
              )
            );
          }
          async function act() {
            try {
              return await sut.service.find(filter);
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
            and there are no users`;
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
          spies.repository.find.mockRejectedValueOnce(new UserNotFoundError());
        }
        async function act() {
          try {
            return await sut.service.find(filter);
          } catch (error) {
            return error;
          }
        }
        async function assert(actResult: unknown) {
          expect(actResult).toBeInstanceOf(UserNotFoundError);
        }

        await arrange().then(act).then(assert);
      });

      it(`given unexpected error occurs in _find
          when I try to find users
          then the unexpected error should be thrown`, async () => {
        let expected: Error;
        async function arrange() {
          expected = new Error("unexpected error");
          spies.repository.find.mockRejectedValueOnce(expected);
        }
        async function act() {
          try {
            return await sut.service.find({});
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
