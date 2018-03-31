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
const errorDescriptionMap = {};
errors.forEach((error) => {
  errorCodeMap[error.code] = generatedErrors[error.name];
  errorDescriptionMap[error.description] = generatedErrors[error.name];
});

export function getErrors() {
  return [...errors];
}

export function getErrorByCode(code) {
  const Err = errorCodeMap[code];
  if (!Err) { return UnknownError; }

  return Err;
}

export function getErrorByDescription(description) {
  const Err = errorDescriptionMap[description];
  if (!Err) { return UnknownError; }

  return Err;
}

