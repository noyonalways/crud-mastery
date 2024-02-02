export class ErrorResponse {
  constructor(
    private success: boolean,
    private message: string,
    private error: {
      code: number;
      description: string;
    }
  ) {}
}

export interface CustomError {
  success?: boolean;
  message?: string;
  error?: {
    code?: number;
    description?: string;
  };
}
