import {
  ERROR_CODES,
  ERROR_MESSAGES,
  ErrorCode,
} from '../constants/error-codes';

export class ApiResponseHeader {
  success: boolean;
  message?: string;
  err_code?: ErrorCode;
  err_msg?: string;

  constructor(
    success: boolean,
    message?: string,
    errCode?: ErrorCode,
    errMsg?: string,
  ) {
    this.success = success;

    if (success) {
      // Success: only show message
      this.message = message || 'Operation successful';
      // Don't set err_code and err_msg - they won't appear in JSON
    } else {
      // Error: only show err_code and err_msg
      this.err_code = errCode || ERROR_CODES.SERVER_ERROR;
      this.err_msg =
        errMsg ||
        ERROR_MESSAGES[errCode || ERROR_CODES.SERVER_ERROR] ||
        'Unknown error';
      // Don't set message - it won't appear in JSON
    }
  }

  static success(message: string): ApiResponseHeader {
    return new ApiResponseHeader(true, message);
  }

  static error(errCode: ErrorCode, errMsg?: string): ApiResponseHeader {
    return new ApiResponseHeader(false, undefined, errCode, errMsg);
  }
}

export class ApiResponse<T = any> {
  header: ApiResponseHeader;
  meta?: any;
  result: T;

  constructor(header: ApiResponseHeader, result: T, meta?: any) {
    this.header = header;
    this.result = result;
    this.meta = meta;
  }

  static success<T>(message: string, result: T, meta?: any): ApiResponse<T> {
    return new ApiResponse(ApiResponseHeader.success(message), result, meta);
  }

  static error<T = null>(
    errCode: ErrorCode,
    errMsg?: string,
    result: T = null as T,
  ): ApiResponse<T> {
    return new ApiResponse(ApiResponseHeader.error(errCode, errMsg), result);
  }
}
