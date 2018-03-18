import * as errorTypes from './errorTypes';

export default class ChromiumNetError extends Error {
  constructor(message, ...restArgs) {
    super(...[message, ...restArgs]);
    Error.captureStackTrace(this, ChromiumNetError);
    this.name = 'ChromiumNetError';
    this.type = 'unknown';
    this.message = message || '';
  }

  isSystemError() {
    return this.type === errorTypes.ERROR_TYPE_SYSTEM;
  }

  isConnectionError() {
    return this.type === errorTypes.ERROR_TYPE_CONNECTION;
  }

  isCertificateError() {
    return this.type === errorTypes.ERROR_TYPE_CERTIFICATE;
  }

  isHttpError() {
    return this.type === errorTypes.ERROR_TYPE_HTTP;
  }

  isCacheError() {
    return this.type === errorTypes.ERROR_TYPE_CACHE;
  }

  isUnknownError() {
    return this.type === errorTypes.ERROR_TYPE_UNKNOWN;
  }

  isFtpError() {
    return this.type === errorTypes.ERROR_TYPE_FTP;
  }

  isCertificateManagerError() {
    return this.type === errorTypes.ERROR_TYPE_CERTIFICATE_MANAGER;
  }

  isDnsError() {
    return this.type === errorTypes.ERROR_TYPE_DNS;
  }
}
