export class ApiError extends Error {
  public statusCode: number;

  public errorCode: string;

  constructor(statusCode: number, message: string, errorCode = "API_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}
