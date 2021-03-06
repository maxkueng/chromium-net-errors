Changelog
=========

## Version 13.0.0

 - Add `QuicGoawayRequestCanBeRetriedError` (-381)

### Breaking Changes

 - `TrustTokenOperationCacheHit` (-507) name changed to `TrustTokenOperationSuccessWithoutSendingRequestError`

## Version 12.3.0

 - Add H2OrQuicRequiredError (-31)

## Version 12.2.0

 - Add BlockedByCspError (-30)

## Version 12.1.0

 - Add TrustTokenOperationCacheHitError (-507)
 - Add TrustTokenOperationFailedError (-506)

## Version 12.0.0

 - Add SslObsoleteVersionError (-218)

### Breaking Changes

 - Change CertEndError error code from -218 to -219

## Version 11.0.0

### Potentially Breaking Changes

 - The oldest tested Node.js version is now v10, and v8 and v9 are no longer
   officially supported as their lifetime has ended.

### Testing

 - Remove Node.js versions 8 and 9 from tests

## Version 10.0.0

 - Add DnsSecureResolverHostnameResolutionFailedError (-808)
 - Add InvalidWebBundleError (-505)
 - Add QuicCertRootNotKnownError (-380)
 - Add HttpResponseCodeFailureError (-379)
 - Add CertKnownInterceptionBlockedError (-217)
 - Update DnsCacheMissError (-804) documentation
 - Update BlockedByAdministratorError (-22) documentation

### Breaking Changes

 - Remove DnsHttpFailedError (-807)
 - Remove PacStatusNotOkError (-326)
 - Remove SslWeakServerEphemeralDhKeyError (-129)
 - Remove BlockedByXssAuditorError (-28)
 - Change CertEndError (-216) error code to -218

## Version 9.0.0

### Breaking Changes

 - Rename `SpdyProtocolError` (-337) to `Http2ProtocolError`
 - Rename `IncompleteSpdyHeadersError (-347)` to `IncompleteHttp2HeadersError`
 - Rename `SpdyServerRefusedStreamError` (-351) to `Http2ServerRefusedStreamError`
 - Rename `Spdy2PingFailedError` (-352) to `Http2PingFailedError`
 - Rename `SpdyInadequateTransportSecurityError` (-360) to `Http2InadequateTransportSecurityError`
 - Rename `SpdyFlowControlError` (-361) to `Http2FlowControlError`
 - Rename `SpdyFrameSizeError` (-362) to `Http2FrameSizeError`
 - Rename `SpdyCompressionError` (-363) to `Http2CompressionError`
 - Rename `SpdyRstStreamNoErrorReceivedError` (-372) to `Http2RstStreamNoErrorReceivedError`
 - Rename `SpdyPushedStreamNotAvailableError` (-373) to `Http2PushedStreamNotAvailableError`
 - Rename `SpdyClaimedPushedStreamResetByServerError` (-374) to `Http2ClaimedPushedStreamResetByServerError`
 - Rename `SpdyStreamClosedError` (-376) to `Http2StreamClosedError`
 - Rename `SpdyClientRefusedStreamError` (-377) to `Http2ClientRefusedStreamError`
 - Rename `SpdyPushedResponseDoesNotMatchError` (-378) to `Http2PushedResponseDoesNotMatchError`

## Version 8.0.0

### Breaking Changes

 - Remove `OriginBoundCertGenerationTypeMismatchError` (-152)

## Version 7.0.0

 - Update dev dependencies

### Breaking Changes

 - Remove `SpdySessionAlreadyExistsError` error type (-143)

## Version 6.0.0

### Breaking Changes

 - Remove `SslVersionInterferenceError` error type (-175)

## Version 5.1.0

 - Add `SslKeyUsageIncompatibleError` error type (-181)

## Version 5.0.0

 - Add `CacheOpenOrCreateFailureError` error type (-413)

### Breaking Changes

 - Rename `HttpsProxyTunnelResponseError` (-140) to `HttpsProxyTunnelResponseRedirectError`


## Version 4.1.0

 - Add `CacheDoomFailureError` error type

## Version 4.0.1

 - Retro-update change log

## Version 4.0.0

### Breaking Changes

 - Drop support for node.js < 8.0.0

## Version 3.6.1

 - Fix ES build not being includes in the npm package
 - Update `BlockedByResponseError` error description
 - Upgrade dev dependencies

## Version 3.6.0

 - Add `Tls13DowngradeDetectedError` error type
 - Fix detecting errors with numbers in the name

## Version 3.5.0

 - Update `WrongVersionOnEarlyDataError` error description

## Version 3.4.0

 - Add `EarlyDataRejectedError` error type
 - Add `WrongVersionOnEarlyDataError` error type

## Version 3.3.0

 - Add `InvalidSignedExchangeError` error type
 - Update dev dependencies

## Version 3.2.0

 - Add `SpdyPushedResponseDoesNotMatchError` error type

## Version 3.1.0

 - Add `SpdyStreamClosedError` and `SpdyClientRefusedStreamError` error types

## Version 3.0.0

 - Fix examples in Readme
 - Add more examples in Readme

### Breaking Changes

 - Change error code of `SslClientAuthNoCommonAlgorithmsError` from -1478 to -177

## Version 2.2.0

 - Add `description` property to errors that contains the unmodified error name
   and corresponds to the `errorDescription` returned by Electron.
   ```js
   const err = new chromiumNetErrors.NameNotResolvedError();
   console.log(err.description);
   // "NAME_NOT_RESOLVED"
   ```

 - Add `getErrorByDescription(description)` that returns the error class that
   corresponds to the description in the same way that `getErrorByCode(code)`
   an error class by its error code.
   ```js
   const Err = chromiumNetErrors.getErrorByDescription('NAME_NOT_RESOLVED');
   const err = new Err();
   console.log(err.code);
   // -105
   ```

 - Add a generated list of all error classes to the README.

## Version 2.1.0

 - Add `TooManyRetriesError` (code -375)

## Version 2.0.1

 - Fix Electron example in docs

## Version 2.0.0

 - Fixed error stacks
 - Switch to ES6 class syntax
 - Bundled code in a single file (no longer requires reading `errors.json`)
 - Provide an ES6 build with `import` `export` for bundlers like Rollup
 - Switch test suite from mocha to ava
 - 100% test coverage
 - Code quality monitoring
 - Daily integration tests to check for updates in net_error_list.h

### Breaking Changes

 - `errors.json` is no longer part of the package. To get a list of all errors
   use `getErrors()` instead.

 - `createByCode()` has been removed. Use `getErrorByCode()` instead and
   instanciate it yourself.
   ```js
   // Old way
   throw chromiumNetErrors.createByCode(-1);

   // New way
   throw new chromiumNetErrors.getErrorByCode(-1);
   ```
