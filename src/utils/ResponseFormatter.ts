// src/utils/ResponseFormatter.ts
export class ResponseFormatter {
  static formatResponse(data: any, status: number, message: string, error: any = null): object {
    return {
      status,
      error,
      message,
      data,
    };
  }
}
