const errors = require('./errors.json');

exports.ERROR_TYPE_SYSTEM = 'system';
exports.ERROR_TYPE_CONNECTION = 'connection';
exports.ERROR_TYPE_CERTIFICATE = 'certificate';
exports.ERROR_TYPE_HTTP = 'http';
exports.ERROR_TYPE_CACHE = 'cache';
exports.ERROR_TYPE_UNKNOWN = 'unknown';
exports.ERROR_TYPE_FTP = 'ftp';
exports.ERROR_TYPE_CERTIFICATE_MANAGER = 'certificate-manager';
exports.ERROR_TYPE_DNS = 'dns';

class ChromiumNetError extends Error {
  constructor(message, ...restArgs) {
    super(...[message, ...restArgs]);
    Error.captureStackTrace(this, ChromiumNetError);
    this.name = 'ChromiumNetError';
    this.type = 'unknown';
    this.message = message || '';
  }

  isSystemError() {
    return this.type === exports.ERROR_TYPE_SYSTEM;
  }

  isConnectionError() {
    return this.type === exports.ERROR_TYPE_CONNECTION;
  }

  isCertificateError() {
    return this.type === exports.ERROR_TYPE_CERTIFICATE;
  }

  isHttpError() {
    return this.type === exports.ERROR_TYPE_HTTP;
  }

  isCacheError() {
    return this.type === exports.ERROR_TYPE_CACHE;
  }

  isUnknownError() {
    return this.type === exports.ERROR_TYPE_UNKNOWN;
  }

  isFtpError() {
    return this.type === exports.ERROR_TYPE_FTP;
  }

  isCertificateManagerError() {
    return this.type === exports.ERROR_TYPE_CERTIFICATE_MANAGER;
  }

  isDnsError() {
    return this.type === exports.ERROR_TYPE_DNS;
  }
}

exports.ChromiumNetError = ChromiumNetError;

const errorCodeMap = {};

errors.forEach((error) => {
  class CustomError extends ChromiumNetError {
    constructor(message, ...restArgs) {
      super(...[message, ...restArgs]);

      this.name = error.name;
      this.code = error.code;
      this.type = error.type;
      this.message = message || error.message;
    }
  }

  errorCodeMap[error.code] = CustomError;
  exports[error.name] = CustomError;
});

exports.createByCode = function createByCode(code) {
  const Err = errorCodeMap[code];
  if (!Err) { return new ChromiumNetError(); }

  return new Err();
};
