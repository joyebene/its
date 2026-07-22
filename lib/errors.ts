export class UnauthorizedError extends Error {
  statusCode = 401;

  constructor(message = "Unauthorized") {
    super(message);
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;

  constructor(message = "Forbidden") {
    super(message);
  }
}