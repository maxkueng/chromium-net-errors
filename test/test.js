var expect = require('chai').expect;
var errors = require('../errors.json');
var chromiumErrors = require('../index');

describe('create', function () {

	it('should create a new error', function () {

		errors.forEach(function (error) {
			var ChromiumError = chromiumErrors[error.name];
			var err = new ChromiumError;
			var fn = function () { throw err; }

			expect(fn).to.throw(ChromiumError);
			expect(err).to.be.an.instanceof(Error);
			expect(err).to.be.an.instanceof(chromiumErrors.ChromiumNetError);
			expect(err).to.be.an.instanceof(ChromiumError);
		});

	});

	it('should create an error by code', function () {

		var err = chromiumErrors.createByCode(-324);
		expect(err).to.be.an.instanceof(chromiumErrors.EmptyResponseError);
		expect(err.code).to.equal(-324);

	});

	it('should return error with message and code if error was not found', function() {
		
		var err = chromiumErrors.createByCode(-999, 'Default Error', 123456);
		expect(err).to.be.an.instanceof(chromiumErrors.ChromiumNetError);
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal('Default Error');
		expect(err.code).to.equal(123456);

	});

	it('should have the correct type', function () {

		var systemErr = new chromiumErrors.AbortedError();
		var connectionErr = new chromiumErrors.ConnectionRefusedError();
		var certificateErr = new chromiumErrors.CertDateInvalidError();
		var httpErr = new chromiumErrors.TooManyRedirectsError();
		var cacheErr = new chromiumErrors.CacheMissError();
		var ftpErr = new chromiumErrors.FtpTransferAbortedError();
		var certificateManagerErr = new chromiumErrors.KeyGenerationFailedError();
		var dnsErr = new chromiumErrors.DnsServerFailedError();

		expect(systemErr).to.have.property('type', 'system');
		expect(systemErr.isSystemError()).to.be.true;
		expect(systemErr.isConnectionError()).to.be.false;

		expect(connectionErr).to.have.property('type', 'connection');
		expect(connectionErr.isConnectionError()).to.be.true;
		expect(connectionErr.isSystemError()).to.be.false;

		expect(certificateErr).to.have.property('type', 'certificate');
		expect(certificateErr.isCertificateError()).to.be.true;
		expect(certificateErr.isSystemError()).to.be.false;

		expect(httpErr).to.have.property('type', 'http');
		expect(httpErr.isHttpError()).to.be.true;
		expect(httpErr.isSystemError()).to.be.false;

		expect(cacheErr).to.have.property('type', 'cache');
		expect(cacheErr.isCacheError()).to.be.true;
		expect(cacheErr.isSystemError()).to.be.false;

		expect(ftpErr).to.have.property('type', 'ftp');
		expect(ftpErr.isFtpError()).to.be.true;
		expect(ftpErr.isSystemError()).to.be.false;

		expect(certificateManagerErr).to.have.property('type', 'certificate-manager');
		expect(certificateManagerErr.isCertificateManagerError()).to.be.true;
		expect(certificateManagerErr.isSystemError()).to.be.false;

		expect(dnsErr).to.have.property('type', 'dns');
		expect(dnsErr.isDnsError()).to.be.true;
		expect(dnsErr.isSystemError()).to.be.false;

	});

});
