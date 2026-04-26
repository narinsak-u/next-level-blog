export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotionAPIError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, "NOTION_API_ERROR", statusCode);
    this.name = "NotionAPIError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, "AUTHENTICATION_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

export const handleError = (error: unknown, context?: string): AppError => {
  if (error instanceof AppError) {
    console.error(`[${context ?? "App"}] ${error.name}:`, error.message);
    return error;
  }

  if (error instanceof Error) {
    console.error(`[${context ?? "Unknown"}] Error:`, error.message);
    return new AppError(error.message, "UNKNOWN_ERROR", 500);
  }

  console.error(`[${context ?? "Unknown"}] Unknown error:`, error);
  return new AppError("An unexpected error occurred", "UNKNOWN_ERROR", 500);
};
