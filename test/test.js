import test from 'ava';
import errors from '../errors.json';
import * as chromiumNetErrors from '../build';

test('create new error', (t) => {
  errors.forEach((error) => {
    const ChromiumError = chromiumNetErrors[error.name];
    const thrower = () => { throw new ChromiumError(); };
    t.throws(() => thrower(), ChromiumError);
  });
});

test('create error by code', (t) => {
  errors.forEach((error) => {
    const thrower = () => {
      const Err = chromiumNetErrors.getErrorByCode(error.code);
      throw new Err();
    };
    t.throws(() => thrower(), chromiumNetErrors[error.name]);
  });
});

test('error type', (t) => {
  errors.forEach((error) => {
    const ChromiumError = chromiumNetErrors[error.name];
    const err = new ChromiumError();
    t.log(err.name, err.type, error.name, error.type);

    t.is(err.code, error.code);
    t.is(err.type, error.type);
    t.is(err.message, error.message);

    t.is(err.isSystemError(), error.type === 'system');
    t.is(err.isConnectionError(), error.type === 'connection');
    t.is(err.isCertificateError(), error.type === 'certificate');
    t.is(err.isHttpError(), error.type === 'http');
    t.is(err.isCacheError(), error.type === 'cache');
    t.is(err.isUnknownError(), error.type === 'unknown');
    t.is(err.isFtpError(), error.type === 'ftp');
    t.is(err.isCertificateManagerError(), error.type === 'certificate-manager');
    t.is(err.isDnsError(), error.type === 'dns');
  });
});

test('getErrors', (t) => {
  t.is(chromiumNetErrors.getErrors().length, errors.length);
});

test('unknown error', (t) => {
  const thrower = () => {
    const Err = chromiumNetErrors.getErrorByCode(9999);
    throw new Err();
  };
  t.throws(() => thrower(), chromiumNetErrors.UnknownError);
});
