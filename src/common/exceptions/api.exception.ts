import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-codes';

export class ApiException extends HttpException {
  constructor(
    public readonly errCode: ErrorCode,
    public readonly errMsg: string,
    public readonly message: string,
    public readonly httpStatus: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ errCode, errMsg, message }, httpStatus);
  }
}
