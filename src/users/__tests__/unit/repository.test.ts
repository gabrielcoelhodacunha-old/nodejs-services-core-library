import { Collection, UUID } from "mongodb";
import { User, FindUserFilter, UserNotFoundError } from "../../types";
import { UsersRepository } from "../../users/repository";

describe("Unit Testing | UsersRepository", () => {
  const spies = {} as {
    collection: jest.MockedObject<Collection<User>>;
  };
  const sut = {} as { repository: UsersRepository };

  beforeAll(() => {
    spies.collection = {
      insertOne: jest.fn(),
      findOne: jest.fn(),
    } as jest.MockedObject<Collection<User>>;
    sut.repository = new UsersRepository({ collection: spies.collection });
  });

  describe(`feature: save new user to database`, () => {
    describe("scenario: save is sucessful", () => {
      it(`given new user has external id of valid UUID
            and email of "test@test.com"
            and password of "password"
            and created at of valid date
          when i try to save the user to the database
          then i should save it`, async () => {
        let newUser: User;
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
            return await sut.repository.create(newUser);
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

  describe(`feature: find user`, () => {
    const external_id = new UUID();
    const email = "test@test.com";

    describe.each`
      filter                     | findUserFilter            | expected
      ${"external id"}           | ${{ external_id }}        | ${{ external_id }}
      ${"email"}                 | ${{ email }}              | ${{ email }}
      ${"external id and email"} | ${{ external_id, email }} | ${{ external_id, email }}
    `(
      "scenario: find by it's $filter is sucessful",
      ({
        filter,
        findUserFilter,
        expected,
      }: {
        filter: string;
        findUserFilter: FindUserFilter;
        expected: User;
      }) => {
        it(`given ${filter} belongs to user in database
          when i try to find the user
          then i should find it`, async () => {
          async function arrange() {
            spies.collection.findOne.mockResolvedValueOnce(expected);
          }
          async function act() {
            try {
              return await sut.repository.find(findUserFilter);
            } catch (error) {
              return error;
            }
          }
          async function assert(actResult: unknown) {
            expect(actResult).toStrictEqual(expected);
          }

          await arrange().then(act).then(assert);
        });
      }
    );

    describe.each`
      filter                     | findUserFilter
      ${"external id"}           | ${{ external_id }}
      ${"email"}                 | ${{ email }}
      ${"external id and email"} | ${{ external_id, email }}
    `(
      "scenario: finding by it's $filter results in error",
      ({
        filter,
        findUserFilter,
      }: {
        filter: string;
        findUserFilter: FindUserFilter;
      }) => {
        it(`given ${filter} doesn't belong to user in database
          when i try to find the user
          then the UserNotFoundError should be thrown`, async () => {
          async function arrange() {
            spies.collection.findOne.mockResolvedValueOnce(null);
          }
          async function act() {
            try {
              return await sut.repository.find(findUserFilter);
            } catch (error) {
              return error;
            }
          }
          async function assert(actResult: unknown) {
            expect(actResult).toBeInstanceOf(UserNotFoundError);
          }

          await arrange().then(act).then(assert);
        });
      }
    );
  });
});
