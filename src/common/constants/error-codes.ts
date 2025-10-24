// Error codes as per API specification
export const ERROR_CODES = {
  // Success
  SUCCESS: '0000',

  // Validation errors (01xx)
  MISSING_REQUIRED_FIELD: '0101',
  NO_UPDATABLE_FIELDS: '0102',
  INVALID_PARAMETER_FORMAT: '0103',
  INVALID_TIME_FORMAT: '0104',
  INVALID_LANG_VALUE: '0105',
  INVALID_NUMERIC_VALUE: '0106',

  // Not Found (02xx)
  RECORD_NOT_FOUND: '0201',

  // Conflict (03xx)
  DUPLICATE_RECORD: '0301',

  // Server Error (04xx)
  SERVER_ERROR: '0401',

  // Auth (05xx)
  UNAUTHORIZED: '0501',
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.SUCCESS]: 'No error',
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: 'Missing required field(s)',
  [ERROR_CODES.NO_UPDATABLE_FIELDS]: 'No updatable fields provided in PUT',
  [ERROR_CODES.INVALID_PARAMETER_FORMAT]:
    'Invalid parameter format or limit exceeded',
  [ERROR_CODES.INVALID_TIME_FORMAT]: 'Invalid time format (expect HH:MM)',
  [ERROR_CODES.INVALID_LANG_VALUE]: 'Invalid lang value (not en|tc|sc|all)',
  [ERROR_CODES.INVALID_NUMERIC_VALUE]: 'Invalid numeric value or out of range',
  [ERROR_CODES.RECORD_NOT_FOUND]: 'Record not found',
  [ERROR_CODES.DUPLICATE_RECORD]: 'Duplicate / unique constraint violation',
  [ERROR_CODES.SERVER_ERROR]: 'Database or internal server error',
  [ERROR_CODES.UNAUTHORIZED]: 'Unauthorized',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
