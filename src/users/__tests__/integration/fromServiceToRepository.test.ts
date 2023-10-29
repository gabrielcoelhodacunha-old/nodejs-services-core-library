import { randomUUID } from "node:crypto";
import { AbstractCursor, Collection, UUID } from "mongodb";
import {
  FindUserRequest,
  InsertUserRequest,
  UserExistsError,
  UserModel,
  UserNotFoundError,
  UserResponse,
  UsersRepository,
  UsersService,
  userModelParser,
  userResponseParser,
} from "../..";

describe("Integration Testing | users | from service to repository", () => {
  const spies = {} as {
    abstractCursor: jest.MockedObject<AbstractCursor<UserModel>>;
    entities: jest.MockedObject<Collection<UserModel>>;
  };
  const sut = {} as { repository: UsersRepository; service: UsersService };

  beforeAll(() => {
    spies.abstractCursor = {
      toArray: jest.fn(),
    } as jest.MockedObject<AbstractCursor<UserModel>>;
    spies.entities = {
      insertOne: jest.fn(),
      find: jest.fn().mockImplementation(() => spies.abstractCursor),
    } as jest.MockedObject<Collection<UserModel>>;
    sut.repository = new UsersRepository({ entities: spies.entities });
    sut.service = new UsersService({
      repository: sut.repository,
      entityParser: userModelParser,
      entityResponseParser: userResponseParser,
    });
  });

  describe(`feature: insert user`, () => {
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
          spies.abstractCursor.toArray
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([user]);
        }
        async function act() {
          try {
            return await sut.service.insert(newUser);
          } catch (error) {
            return error;
          }
        }
        async function assert(actResult: unknown) {
          expect(actResult).toMatchObject<
            Pick<UserModel, "email" | "password">
          >(expected);
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
          spies.abstractCursor.toArray.mockResolvedValueOnce([user]);
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

  describe(`feature: find users`, () => {
    const id = randomUUID();
    const email = "test@test.com";
    const user: UserModel = {
      external_id: new UUID(id),
      email,
      password: "password",
      created_at: new Date(),
    };
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

      const users = [[user, user, user], [user], [user], [user]];
      const expected: UserResponse[][] = [];
      users.forEach((array) =>
        expected.push(
          array.map(
            ({ created_at: createdAt, external_id: _id, ...rest }: UserModel) =>
              ({ ...rest, id, createdAt } as UserResponse)
          )
        )
      );

      const cases = filters.map((_filter, idx) => ({
        description: getTestDescription(_filter),
        filter: requests[idx],
        users: users[idx],
        expected: expected[idx],
      }));

      it.each(cases)(
        "$description",
        async ({ filter, users, expected }: (typeof cases)[0]) => {
          async function arrange() {
            spies.abstractCursor.toArray.mockResolvedValueOnce(users);
          }
          async function act() {
            try {
              return await sut.service.find(filter);
            } catch (error) {
              return error;
            }
          }
          async function assert(actResult: unknown) {
            expect(actResult).toStrictEqual<UserResponse[]>(expected);
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
          spies.abstractCursor.toArray.mockResolvedValueOnce([]);
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
    });
  });
});
