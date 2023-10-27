import { StatusCodes } from "http-status-codes";
import { ApplicationError } from "@gccunha015/express-errors-handler";

export class UserNotFoundError extends ApplicationError {
  constructor(origin?: unknown) {
    super(origin, "User not found", StatusCodes.NOT_FOUND);
  }
}
