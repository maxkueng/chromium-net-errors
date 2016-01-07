var inherits = require('util').inherits;
var errors = require('./errors.json');

var errorCodeMap = {};

function ChromiumNetError (message) {
	Error.captureStackTrace(this, this.constructor);
	this.name = 'ChromiumNetError';
	this.type = 'unknown';
	this.message = message || '';
}

inherits(ChromiumNetError, Error);

ChromiumNetError.prototype.isSystemError = function () {
	return this.type === 'system';
};

ChromiumNetError.prototype.isConnectionError = function () {
	return this.type === 'connection';
};

ChromiumNetError.prototype.isCertificateError = function () {
	return this.type === 'certificate';
};

ChromiumNetError.prototype.isHttpError = function () {
	return this.type === 'http';
};

ChromiumNetError.prototype.isCacheError = function () {
	return this.type === 'cache';
};

ChromiumNetError.prototype.isUnknownError = function () {
	return this.type === 'unknown';
};

ChromiumNetError.prototype.isFtpError = function () {
	return this.type === 'ftp';
};

ChromiumNetError.prototype.isCertificateManagerError = function () {
	return this.type === 'certificate-manager';
};

ChromiumNetError.prototype.isDnsError = function () {
	return this.type === 'dns';
};

exports.ChromiumNetError = ChromiumNetError;

errors.forEach(function (error) {
	function CustomError (message) {
		Error.captureStackTrace(this, this.constructor);
		this.name = error.name;
		this.code = error.code;
		this.type = error.type;
		this.message = message || error.message;
	}

	inherits(CustomError, ChromiumNetError);

	errorCodeMap[error.code] = CustomError;
	exports[error.name] = CustomError;
});

exports.createByCode = function (code) {
	var Err = errorCodeMap[code];
	if (!Err) { return new ChromiumNetError(); }

	return new Err;
};
