/* global ERRORS */

import * as generatedErrors from '../generated-errors/index';
import ChromiumNetError from './ChromiumNetError';

const errors = ERRORS;

const errorCodeMap = {};
errors.forEach((error) => {
  errorCodeMap[error.code] = generatedErrors[error.name];
});

export function getErrors() {
  return [...errors];
}

export function createByCode(code) {
  const Err = errorCodeMap[code];
  if (!Err) { return new ChromiumNetError(); }

  return new Err();
}
