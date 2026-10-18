export type ApiErrorCode = "USERNAME_TAKEN" | "INVALID_USERNAME" | "INVALID_TITLE" | "USER_NOT_FOUND" | "ASSIGNEE_NOT_FOUND" | "INJECTED_FAILURE" | "TODO_NOT_FOUND" | "INVALID_STATUS";

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
