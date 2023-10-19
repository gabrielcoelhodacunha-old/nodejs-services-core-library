import { StatusCodes } from "http-status-codes";
import { ApplicationError } from "@gccunha015/express-errors-handler";

export class UserNotFoundError extends ApplicationError {
  constructor(origin?: unknown) {
    super(origin, "User not found", StatusCodes.NOT_FOUND);
  }
}

export class UserExistsError extends ApplicationError {
  constructor(email: string, origin?: unknown) {
    super(
      origin,
      `User with email '${email}' already exists`,
      StatusCodes.CONFLICT
    );
  }
}
