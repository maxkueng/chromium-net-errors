Changelog
=========

## Next

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
