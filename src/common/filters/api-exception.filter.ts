import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiException } from '../exceptions/api.exception';
import { ApiResponse } from '../dto/api-response.dto';
import { ERROR_CODES, ErrorCode } from '../constants/error-codes';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let apiResponse: ApiResponse;

    if (exception instanceof ApiException) {
      // Custom API exception
      status = exception.getStatus();
      apiResponse = ApiResponse.error(exception.errCode, exception.errMsg);
    } else if (exception instanceof HttpException) {
      // Standard HTTP exception
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Request failed';

      // Map common HTTP exceptions to error codes
      let errCode: ErrorCode = ERROR_CODES.SERVER_ERROR;
      if (status === HttpStatus.BAD_REQUEST) {
        errCode = ERROR_CODES.INVALID_PARAMETER_FORMAT;
      } else if (status === HttpStatus.NOT_FOUND) {
        errCode = ERROR_CODES.RECORD_NOT_FOUND;
      } else if (status === HttpStatus.CONFLICT) {
        errCode = ERROR_CODES.DUPLICATE_RECORD;
      } else if (status === HttpStatus.UNAUTHORIZED) {
        errCode = ERROR_CODES.UNAUTHORIZED;
      }

      const errMsg = Array.isArray(message) ? message.join(', ') : message;
      apiResponse = ApiResponse.error(errCode, errMsg);
    } else {
      // Unknown error - check for database errors
      this.logger.error('Unhandled exception', exception);

      // Handle database connection errors
      const error = exception as any;
      if (
        error?.code === 'ECONNREFUSED' ||
        error?.code === 'PROTOCOL_CONNECTION_LOST' ||
        error?.errno === 'ETIMEDOUT' ||
        error?.message?.includes('Connection lost') ||
        error?.message?.includes("Can't connect")
      ) {
        apiResponse = ApiResponse.error(
          ERROR_CODES.SERVER_ERROR,
          'Database connection error. Please try again later.',
        );
        status = HttpStatus.SERVICE_UNAVAILABLE;
      } else {
        const errMsg =
          exception instanceof Error ? exception.message : 'Unknown error';
        apiResponse = ApiResponse.error(ERROR_CODES.SERVER_ERROR, errMsg);
      }
    }

    response.status(status).json(apiResponse);
  }
}
