import * as generatedErrors from '../generated-errors/index';
import ChromiumNetError from './ChromiumNetError';

export class UnknownError extends ChromiumNetError {
  constructor(...args) {
    super(...args);

    this.name = 'UnknownError';
    this.message = 'Unknown error';
    Error.captureStackTrace(this, UnknownError);
  }
}

const errors = 'ERRORS';

const errorCodeMap = {};
errors.forEach((error) => {
  errorCodeMap[error.code] = generatedErrors[error.name];
});

export function getErrors() {
  return [...errors];
}

export function getErrorByCode(code) {
  const Err = errorCodeMap[code];
  if (!Err) { return UnknownError; }

  return Err;
}
