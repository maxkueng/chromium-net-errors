Chromium Network Errors
=======================

[![Build Status](https://secure.travis-ci.org/maxkueng/chromium-net-errors.png?branch=master)](http://travis-ci.org/maxkueng/chromium-net-errors)
[![codebeat badge](https://codebeat.co/badges/b022cc1d-3ec0-4f9d-bc7d-45168ec12e08)](https://codebeat.co/projects/github-com-maxkueng-chromium-net-errors-master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/bdec0faf360447f39cdcc70d9d0750d3)](https://www.codacy.com/app/maxkueng/chromium-net-errors?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=maxkueng/chromium-net-errors&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/df86c1d3fa5b248aaaa6/maintainability)](https://codeclimate.com/github/maxkueng/chromium-net-errors/maintainability)
[![Coverage Status](https://coveralls.io/repos/maxkueng/chromium-net-errors/badge.svg?branch=master&service=github)](https://coveralls.io/github/maxkueng/chromium-net-errors?branch=master)

[![NPM](https://nodei.co/npm/chromium-net-errors.png)](https://nodei.co/npm/chromium-net-errors/)

Provides Chromium network errors found in
[net_error_list.h](https://cs.chromium.org/codesearch/f/chromium/src/net/base/net_error_list.h)
as custom error classes that can be conveniently used in Node.js, Electron apps and browsers.

The errors correspond to the error codes that are provided in Electron's
`did-fail-load` events of the [WebContents](https://github.com/electron/electron/blob/master/docs/api/web-contents.md#event-did-fail-load) class
and the [webview tag](https://github.com/electron/electron/blob/master/docs/api/webview-tag.md#event-did-fail-load).

[Features](#features) |
[Installation](#installation) |
[Electron Example](#example-use-in-electron) |
[Usage](#usage) |
[List of Errors](#list-of-errors) |
[License](#license)

## Features

 - No dependencies.
 - 100% test coverage.
 - ES6 build with `import` and `export`, and a CommonJS build. Your bundler can
   use the ES6 modules if it supports the `"module"` or `"jsnext:main"`
   directives in the package.json.
 - Daily cron-triggered checks for updates on net_error_list.h on 
   [Travis CI](https://travis-ci.org/maxkueng/chromium-net-errors)
   to always get the most up-to-date list of errors.

## Installation

```sh
npm install chromium-net-errors --save
```

```js
import * as chromiumNetErrors from 'chromium-net-errors';
// or
const chromiumNetErrors = require('chromium-net-errors');
```

## Example Use in Electron

```js
import { app, BrowserWindow } from 'electron';
import * as chromiumNetErrors from 'chromium-net-errors';

app.on('ready', () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.webContents.on('did-fail-load', (event) => {
    try {
      const Err = chromiumNetErrors.getErrorByCode(event.errorCode);
      throw new Err();
    } catch (err) {
      if (err instanceof chromiumNetErrors.NameNotResolvedError) {
        console.error(`The name '${event.validatedURL}' could not be resolved:\n  ${err.message}`);
      } else {
        console.error(`Something went wrong while loading ${event.validatedURL}`);
      }
    }
  });

  win.loadURL('http://blablanotexist.com');
});
```

## Usage

```js
import * as chromiumNetErrors from 'chromium-net-errors';
```

### Create New Errors

```js
const err = new chromiumNetErrors.ConnectionTimedOutError();

console.log(err instanceof Error);
// true
console.log(err instanceof chromiumNetErrors.ChromiumNetError);
// true
console.log(err instanceof chromiumNetErrors.ConnectionTimedOutError);
// true
```

```js
function thrower() {
  throw new chromiumNetErrors.ConnectionTimedOutError();
}

try {
  thrower();
} catch (err) {
  console.log(err instanceof Error);
  // true
  console.log(err instanceof chromiumNetErrors.ChromiumNetError);
  // true
  console.log(err instanceof chromiumNetErrors.ConnectionTimedOutError);
  // true
}
```

### Get Error by errorCode

Get the class of an error by its `errorCode`.

```js
const Err = chromiumNetErrors.getErrorByCode(-201);
const err = new Err();

console.log(err instanceof chromiumNetErrors.CertDateInvalidError);
// true

console.log(err.isCertificateError());
// true

console.log(err.type); 
// 'certificate'

console.log(err.message);
// The server responded with a certificate that, by our clock, appears to
// either not yet be valid or to have expired. This could mean:
// 
// 1. An attacker is presenting an old certificate for which they have
// managed to obtain the private key.
// 
// 2. The server is misconfigured and is not presenting a valid cert.
// 
// 3. Our clock is wrong.
```

### Get Error by errorDescription

Get the class of an error by its `errorDescription`.

```js
const Err = chromiumNetErrors.getErrorByDescription('CERT_DATE_INVALID');
const err = new Err();

console.log(err instanceof chromiumNetErrors.CertDateInvalidError);
// true

console.log(err.isCertificateError());
// true

console.log(err.type); 
// 'certificate'

console.log(err.message);
// The server responded with a certificate that, by our clock, appears to
// either not yet be valid or to have expired. This could mean:
// 
// 1. An attacker is presenting an old certificate for which they have
// managed to obtain the private key.
// 
// 2. The server is misconfigured and is not presenting a valid cert.
// 
// 3. Our clock is wrong.
```

### Get All Errors

Get an array of all possible errors.

```js
console.log(chromiumNetErrors.getErrors());

// [ { name: 'IoPendingError',
//     code: -1,
//     description: 'IO_PENDING',
//     type: 'system',
//     message: 'An asynchronous IO operation is not yet complete.  This usually does not\nindicate a fatal error.  Typically this error will be generated as a\nnotification to wait for some external notification that the IO operation\nfinally completed.' },
//   { name: 'FailedError',
//     code: -2,
//     description: 'FAILED',
//     type: 'system',
//     message: 'A generic failure occurred.' },
//   { name: 'AbortedError',
//     code: -3,
//     description: 'ABORTED',
//     type: 'system',
//     message: 'An operation was aborted (due to user action).' },
//   { name: 'InvalidArgumentError',
//     code: -4,
//     description: 'INVALID_ARGUMENT',
//     type: 'system',
//     message: 'An argument to the function is incorrect.' },
//   { name: 'InvalidHandleError',
//     code: -5,
//     description: 'INVALID_HANDLE',
//     type: 'system',
//     message: 'The handle or file descriptor is invalid.' },
//   ...
// ]
```

## List of Errors

<!--START_ERROR_LIST-->
### IoPendingError

> An asynchronous IO operation is not yet complete. This usually does not
> indicate a fatal error. Typically this error will be generated as a
> notification to wait for some external notification that the IO operation
> finally completed.

 - Name: `IoPendingError`
 - Code: `-1`
 - Description: `IO_PENDING`
 - Type: system

```js
const err = new chromiumNetErrors.IoPendingError();
// or
const Err = chromiumNetErrors.getErrorByCode(-1);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('IO_PENDING');
const err = new Err();
```

### FailedError

> A generic failure occurred.

 - Name: `FailedError`
 - Code: `-2`
 - Description: `FAILED`
 - Type: system

```js
const err = new chromiumNetErrors.FailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-2);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('FAILED');
const err = new Err();
```

### AbortedError

> An operation was aborted (due to user action).

 - Name: `AbortedError`
 - Code: `-3`
 - Description: `ABORTED`
 - Type: system

```js
const err = new chromiumNetErrors.AbortedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-3);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('ABORTED');
const err = new Err();
```

### InvalidArgumentError

> An argument to the function is incorrect.

 - Name: `InvalidArgumentError`
 - Code: `-4`
 - Description: `INVALID_ARGUMENT`
 - Type: system

```js
const err = new chromiumNetErrors.InvalidArgumentError();
// or
const Err = chromiumNetErrors.getErrorByCode(-4);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('INVALID_ARGUMENT');
const err = new Err();
```

### InvalidHandleError

> The handle or file descriptor is invalid.

 - Name: `InvalidHandleError`
 - Code: `-5`
 - Description: `INVALID_HANDLE`
 - Type: system

```js
const err = new chromiumNetErrors.InvalidHandleError();
// or
const Err = chromiumNetErrors.getErrorByCode(-5);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('INVALID_HANDLE');
const err = new Err();
```

### FileNotFoundError

> The file or directory cannot be found.

 - Name: `FileNotFoundError`
 - Code: `-6`
 - Description: `FILE_NOT_FOUND`
 - Type: system

```js
const err = new chromiumNetErrors.FileNotFoundError();
// or
const Err = chromiumNetErrors.getErrorByCode(-6);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('FILE_NOT_FOUND');
const err = new Err();
```

### TimedOutError

> An operation timed out.

 - Name: `TimedOutError`
 - Code: `-7`
 - Description: `TIMED_OUT`
 - Type: system

```js
const err = new chromiumNetErrors.TimedOutError();
// or
const Err = chromiumNetErrors.getErrorByCode(-7);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('TIMED_OUT');
const err = new Err();
```

### FileTooBigError

> The file is too large.

 - Name: `FileTooBigError`
 - Code: `-8`
 - Description: `FILE_TOO_BIG`
 - Type: system

```js
const err = new chromiumNetErrors.FileTooBigError();
// or
const Err = chromiumNetErrors.getErrorByCode(-8);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('FILE_TOO_BIG');
const err = new Err();
```

### UnexpectedError

> An unexpected error. This may be caused by a programming mistake or an
> invalid assumption.

 - Name: `UnexpectedError`
 - Code: `-9`
 - Description: `UNEXPECTED`
 - Type: system

```js
const err = new chromiumNetErrors.UnexpectedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-9);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('UNEXPECTED');
const err = new Err();
```

### AccessDeniedError

> Permission to access a resource, other than the network, was denied.

 - Name: `AccessDeniedError`
 - Code: `-10`
 - Description: `ACCESS_DENIED`
 - Type: system

```js
const err = new chromiumNetErrors.AccessDeniedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-10);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('ACCESS_DENIED');
const err = new Err();
```

### NotImplementedError

> The operation failed because of unimplemented functionality.

 - Name: `NotImplementedError`
 - Code: `-11`
 - Description: `NOT_IMPLEMENTED`
 - Type: system

```js
const err = new chromiumNetErrors.NotImplementedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-11);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('NOT_IMPLEMENTED');
const err = new Err();
```

### InsufficientResourcesError

> There were not enough resources to complete the operation.

 - Name: `InsufficientResourcesError`
 - Code: `-12`
 - Description: `INSUFFICIENT_RESOURCES`
 - Type: system

```js
const err = new chromiumNetErrors.InsufficientResourcesError();
// or
const Err = chromiumNetErrors.getErrorByCode(-12);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('INSUFFICIENT_RESOURCES');
const err = new Err();
```

### OutOfMemoryError

> Memory allocation failed.

 - Name: `OutOfMemoryError`
 - Code: `-13`
 - Description: `OUT_OF_MEMORY`
 - Type: system

```js
const err = new chromiumNetErrors.OutOfMemoryError();
// or
const Err = chromiumNetErrors.getErrorByCode(-13);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('OUT_OF_MEMORY');
const err = new Err();
```

### UploadFileChangedError

> The file upload failed because the file's modification time was different
> from the expectation.

 - Name: `UploadFileChangedError`
 - Code: `-14`
 - Description: `UPLOAD_FILE_CHANGED`
 - Type: system

```js
const err = new chromiumNetErrors.UploadFileChangedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-14);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('UPLOAD_FILE_CHANGED');
const err = new Err();
```

### SocketNotConnectedError

> The socket is not connected.

 - Name: `SocketNotConnectedError`
 - Code: `-15`
 - Description: `SOCKET_NOT_CONNECTED`
 - Type: system

```js
const err = new chromiumNetErrors.SocketNotConnectedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-15);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SOCKET_NOT_CONNECTED');
const err = new Err();
```

### FileExistsError

> The file already exists.

 - Name: `FileExistsError`
 - Code: `-16`
 - Description: `FILE_EXISTS`
 - Type: system

```js
const err = new chromiumNetErrors.FileExistsError();
// or
const Err = chromiumNetErrors.getErrorByCode(-16);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('FILE_EXISTS');
const err = new Err();
```

### FilePathTooLongError

> The path or file name is too long.

 - Name: `FilePathTooLongError`
 - Code: `-17`
 - Description: `FILE_PATH_TOO_LONG`
 - Type: system

```js
const err = new chromiumNetErrors.FilePathTooLongError();
// or
const Err = chromiumNetErrors.getErrorByCode(-17);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('FILE_PATH_TOO_LONG');
const err = new Err();
```

### FileNoSpaceError

> Not enough room left on the disk.

 - Name: `FileNoSpaceError`
 - Code: `-18`
 - Description: `FILE_NO_SPACE`
 - Type: system

```js
const err = new chromiumNetErrors.FileNoSpaceError();
// or
const Err = chromiumNetErrors.getErrorByCode(-18);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('FILE_NO_SPACE');
const err = new Err();
```

### FileVirusInfectedError

> The file has a virus.

 - Name: `FileVirusInfectedError`
 - Code: `-19`
 - Description: `FILE_VIRUS_INFECTED`
 - Type: system

```js
const err = new chromiumNetErrors.FileVirusInfectedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-19);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('FILE_VIRUS_INFECTED');
const err = new Err();
```

### BlockedByClientError

> The client chose to block the request.

 - Name: `BlockedByClientError`
 - Code: `-20`
 - Description: `BLOCKED_BY_CLIENT`
 - Type: system

```js
const err = new chromiumNetErrors.BlockedByClientError();
// or
const Err = chromiumNetErrors.getErrorByCode(-20);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('BLOCKED_BY_CLIENT');
const err = new Err();
```

### NetworkChangedError

> The network changed.

 - Name: `NetworkChangedError`
 - Code: `-21`
 - Description: `NETWORK_CHANGED`
 - Type: system

```js
const err = new chromiumNetErrors.NetworkChangedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-21);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('NETWORK_CHANGED');
const err = new Err();
```

### BlockedByAdministratorError

> The request was blocked by the URL block list configured by the domain
> administrator.

 - Name: `BlockedByAdministratorError`
 - Code: `-22`
 - Description: `BLOCKED_BY_ADMINISTRATOR`
 - Type: system

```js
const err = new chromiumNetErrors.BlockedByAdministratorError();
// or
const Err = chromiumNetErrors.getErrorByCode(-22);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('BLOCKED_BY_ADMINISTRATOR');
const err = new Err();
```

### SocketIsConnectedError

> The socket is already connected.

 - Name: `SocketIsConnectedError`
 - Code: `-23`
 - Description: `SOCKET_IS_CONNECTED`
 - Type: system

```js
const err = new chromiumNetErrors.SocketIsConnectedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-23);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SOCKET_IS_CONNECTED');
const err = new Err();
```

### BlockedEnrollmentCheckPendingError

> The request was blocked because the forced reenrollment check is still
> pending. This error can only occur on ChromeOS.
> The error can be emitted by code in chrome/browser/policy/policy_helpers.cc.

 - Name: `BlockedEnrollmentCheckPendingError`
 - Code: `-24`
 - Description: `BLOCKED_ENROLLMENT_CHECK_PENDING`
 - Type: system

```js
const err = new chromiumNetErrors.BlockedEnrollmentCheckPendingError();
// or
const Err = chromiumNetErrors.getErrorByCode(-24);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('BLOCKED_ENROLLMENT_CHECK_PENDING');
const err = new Err();
```

### UploadStreamRewindNotSupportedError

> The upload failed because the upload stream needed to be re-read, due to a
> retry or a redirect, but the upload stream doesn't support that operation.

 - Name: `UploadStreamRewindNotSupportedError`
 - Code: `-25`
 - Description: `UPLOAD_STREAM_REWIND_NOT_SUPPORTED`
 - Type: system

```js
const err = new chromiumNetErrors.UploadStreamRewindNotSupportedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-25);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('UPLOAD_STREAM_REWIND_NOT_SUPPORTED');
const err = new Err();
```

### ContextShutDownError

> The request failed because the URLRequestContext is shutting down, or has
> been shut down.

 - Name: `ContextShutDownError`
 - Code: `-26`
 - Description: `CONTEXT_SHUT_DOWN`
 - Type: system

```js
const err = new chromiumNetErrors.ContextShutDownError();
// or
const Err = chromiumNetErrors.getErrorByCode(-26);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CONTEXT_SHUT_DOWN');
const err = new Err();
```

### BlockedByResponseError

> The request failed because the response was delivered along with requirements
> which are not met ('X-Frame-Options' and 'Content-Security-Policy' ancestor
> checks and 'Cross-Origin-Resource-Policy', for instance).

 - Name: `BlockedByResponseError`
 - Code: `-27`
 - Description: `BLOCKED_BY_RESPONSE`
 - Type: system

```js
const err = new chromiumNetErrors.BlockedByResponseError();
// or
const Err = chromiumNetErrors.getErrorByCode(-27);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('BLOCKED_BY_RESPONSE');
const err = new Err();
```

### CleartextNotPermittedError

> The request was blocked by system policy disallowing some or all cleartext
> requests. Used for NetworkSecurityPolicy on Android.

 - Name: `CleartextNotPermittedError`
 - Code: `-29`
 - Description: `CLEARTEXT_NOT_PERMITTED`
 - Type: system

```js
const err = new chromiumNetErrors.CleartextNotPermittedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-29);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CLEARTEXT_NOT_PERMITTED');
const err = new Err();
```

### ConnectionClosedError

> A connection was closed (corresponding to a TCP FIN).

 - Name: `ConnectionClosedError`
 - Code: `-100`
 - Description: `CONNECTION_CLOSED`
 - Type: connection

```js
const err = new chromiumNetErrors.ConnectionClosedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-100);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CONNECTION_CLOSED');
const err = new Err();
```

### ConnectionResetError

> A connection was reset (corresponding to a TCP RST).

 - Name: `ConnectionResetError`
 - Code: `-101`
 - Description: `CONNECTION_RESET`
 - Type: connection

```js
const err = new chromiumNetErrors.ConnectionResetError();
// or
const Err = chromiumNetErrors.getErrorByCode(-101);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CONNECTION_RESET');
const err = new Err();
```

### ConnectionRefusedError

> A connection attempt was refused.

 - Name: `ConnectionRefusedError`
 - Code: `-102`
 - Description: `CONNECTION_REFUSED`
 - Type: connection

```js
const err = new chromiumNetErrors.ConnectionRefusedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-102);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CONNECTION_REFUSED');
const err = new Err();
```

### ConnectionAbortedError

> A connection timed out as a result of not receiving an ACK for data sent.
> This can include a FIN packet that did not get ACK'd.

 - Name: `ConnectionAbortedError`
 - Code: `-103`
 - Description: `CONNECTION_ABORTED`
 - Type: connection

```js
const err = new chromiumNetErrors.ConnectionAbortedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-103);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CONNECTION_ABORTED');
const err = new Err();
```

### ConnectionFailedError

> A connection attempt failed.

 - Name: `ConnectionFailedError`
 - Code: `-104`
 - Description: `CONNECTION_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.ConnectionFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-104);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CONNECTION_FAILED');
const err = new Err();
```

### NameNotResolvedError

> The host name could not be resolved.

 - Name: `NameNotResolvedError`
 - Code: `-105`
 - Description: `NAME_NOT_RESOLVED`
 - Type: connection

```js
const err = new chromiumNetErrors.NameNotResolvedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-105);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('NAME_NOT_RESOLVED');
const err = new Err();
```

### InternetDisconnectedError

> The Internet connection has been lost.

 - Name: `InternetDisconnectedError`
 - Code: `-106`
 - Description: `INTERNET_DISCONNECTED`
 - Type: connection

```js
const err = new chromiumNetErrors.InternetDisconnectedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-106);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('INTERNET_DISCONNECTED');
const err = new Err();
```

### SslProtocolError

> An SSL protocol error occurred.

 - Name: `SslProtocolError`
 - Code: `-107`
 - Description: `SSL_PROTOCOL_ERROR`
 - Type: connection

```js
const err = new chromiumNetErrors.SslProtocolError();
// or
const Err = chromiumNetErrors.getErrorByCode(-107);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_PROTOCOL_ERROR');
const err = new Err();
```

### AddressInvalidError

> The IP address or port number is invalid (e.g., cannot connect to the IP
> address 0 or the port 0).

 - Name: `AddressInvalidError`
 - Code: `-108`
 - Description: `ADDRESS_INVALID`
 - Type: connection

```js
const err = new chromiumNetErrors.AddressInvalidError();
// or
const Err = chromiumNetErrors.getErrorByCode(-108);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('ADDRESS_INVALID');
const err = new Err();
```

### AddressUnreachableError

> The IP address is unreachable. This usually means that there is no route to
> the specified host or network.

 - Name: `AddressUnreachableError`
 - Code: `-109`
 - Description: `ADDRESS_UNREACHABLE`
 - Type: connection

```js
const err = new chromiumNetErrors.AddressUnreachableError();
// or
const Err = chromiumNetErrors.getErrorByCode(-109);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('ADDRESS_UNREACHABLE');
const err = new Err();
```

### SslClientAuthCertNeededError

> The server requested a client certificate for SSL client authentication.

 - Name: `SslClientAuthCertNeededError`
 - Code: `-110`
 - Description: `SSL_CLIENT_AUTH_CERT_NEEDED`
 - Type: connection

```js
const err = new chromiumNetErrors.SslClientAuthCertNeededError();
// or
const Err = chromiumNetErrors.getErrorByCode(-110);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_CLIENT_AUTH_CERT_NEEDED');
const err = new Err();
```

### TunnelConnectionFailedError

> A tunnel connection through the proxy could not be established.

 - Name: `TunnelConnectionFailedError`
 - Code: `-111`
 - Description: `TUNNEL_CONNECTION_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.TunnelConnectionFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-111);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('TUNNEL_CONNECTION_FAILED');
const err = new Err();
```

### NoSslVersionsEnabledError

> No SSL protocol versions are enabled.

 - Name: `NoSslVersionsEnabledError`
 - Code: `-112`
 - Description: `NO_SSL_VERSIONS_ENABLED`
 - Type: connection

```js
const err = new chromiumNetErrors.NoSslVersionsEnabledError();
// or
const Err = chromiumNetErrors.getErrorByCode(-112);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('NO_SSL_VERSIONS_ENABLED');
const err = new Err();
```

### SslVersionOrCipherMismatchError

> The client and server don't support a common SSL protocol version or
> cipher suite.

 - Name: `SslVersionOrCipherMismatchError`
 - Code: `-113`
 - Description: `SSL_VERSION_OR_CIPHER_MISMATCH`
 - Type: connection

```js
const err = new chromiumNetErrors.SslVersionOrCipherMismatchError();
// or
const Err = chromiumNetErrors.getErrorByCode(-113);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_VERSION_OR_CIPHER_MISMATCH');
const err = new Err();
```

### SslRenegotiationRequestedError

> The server requested a renegotiation (rehandshake).

 - Name: `SslRenegotiationRequestedError`
 - Code: `-114`
 - Description: `SSL_RENEGOTIATION_REQUESTED`
 - Type: connection

```js
const err = new chromiumNetErrors.SslRenegotiationRequestedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-114);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_RENEGOTIATION_REQUESTED');
const err = new Err();
```

### ProxyAuthUnsupportedError

> The proxy requested authentication (for tunnel establishment) with an
> unsupported method.

 - Name: `ProxyAuthUnsupportedError`
 - Code: `-115`
 - Description: `PROXY_AUTH_UNSUPPORTED`
 - Type: connection

```js
const err = new chromiumNetErrors.ProxyAuthUnsupportedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-115);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PROXY_AUTH_UNSUPPORTED');
const err = new Err();
```

### CertErrorInSslRenegotiationError

> During SSL renegotiation (rehandshake), the server sent a certificate with
> an error.
> 
> Note: this error is not in the -2xx range so that it won't be handled as a
> certificate error.

 - Name: `CertErrorInSslRenegotiationError`
 - Code: `-116`
 - Description: `CERT_ERROR_IN_SSL_RENEGOTIATION`
 - Type: connection

```js
const err = new chromiumNetErrors.CertErrorInSslRenegotiationError();
// or
const Err = chromiumNetErrors.getErrorByCode(-116);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_ERROR_IN_SSL_RENEGOTIATION');
const err = new Err();
```

### BadSslClientAuthCertError

> The SSL handshake failed because of a bad or missing client certificate.

 - Name: `BadSslClientAuthCertError`
 - Code: `-117`
 - Description: `BAD_SSL_CLIENT_AUTH_CERT`
 - Type: connection

```js
const err = new chromiumNetErrors.BadSslClientAuthCertError();
// or
const Err = chromiumNetErrors.getErrorByCode(-117);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('BAD_SSL_CLIENT_AUTH_CERT');
const err = new Err();
```

### ConnectionTimedOutError

> A connection attempt timed out.

 - Name: `ConnectionTimedOutError`
 - Code: `-118`
 - Description: `CONNECTION_TIMED_OUT`
 - Type: connection

```js
const err = new chromiumNetErrors.ConnectionTimedOutError();
// or
const Err = chromiumNetErrors.getErrorByCode(-118);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CONNECTION_TIMED_OUT');
const err = new Err();
```

### HostResolverQueueTooLargeError

> There are too many pending DNS resolves, so a request in the queue was
> aborted.

 - Name: `HostResolverQueueTooLargeError`
 - Code: `-119`
 - Description: `HOST_RESOLVER_QUEUE_TOO_LARGE`
 - Type: connection

```js
const err = new chromiumNetErrors.HostResolverQueueTooLargeError();
// or
const Err = chromiumNetErrors.getErrorByCode(-119);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HOST_RESOLVER_QUEUE_TOO_LARGE');
const err = new Err();
```

### SocksConnectionFailedError

> Failed establishing a connection to the SOCKS proxy server for a target host.

 - Name: `SocksConnectionFailedError`
 - Code: `-120`
 - Description: `SOCKS_CONNECTION_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.SocksConnectionFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-120);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SOCKS_CONNECTION_FAILED');
const err = new Err();
```

### SocksConnectionHostUnreachableError

> The SOCKS proxy server failed establishing connection to the target host
> because that host is unreachable.

 - Name: `SocksConnectionHostUnreachableError`
 - Code: `-121`
 - Description: `SOCKS_CONNECTION_HOST_UNREACHABLE`
 - Type: connection

```js
const err = new chromiumNetErrors.SocksConnectionHostUnreachableError();
// or
const Err = chromiumNetErrors.getErrorByCode(-121);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SOCKS_CONNECTION_HOST_UNREACHABLE');
const err = new Err();
```

### AlpnNegotiationFailedError

> The request to negotiate an alternate protocol failed.

 - Name: `AlpnNegotiationFailedError`
 - Code: `-122`
 - Description: `ALPN_NEGOTIATION_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.AlpnNegotiationFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-122);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('ALPN_NEGOTIATION_FAILED');
const err = new Err();
```

### SslNoRenegotiationError

> The peer sent an SSL no_renegotiation alert message.

 - Name: `SslNoRenegotiationError`
 - Code: `-123`
 - Description: `SSL_NO_RENEGOTIATION`
 - Type: connection

```js
const err = new chromiumNetErrors.SslNoRenegotiationError();
// or
const Err = chromiumNetErrors.getErrorByCode(-123);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_NO_RENEGOTIATION');
const err = new Err();
```

### WinsockUnexpectedWrittenBytesError

> Winsock sometimes reports more data written than passed. This is probably
> due to a broken LSP.

 - Name: `WinsockUnexpectedWrittenBytesError`
 - Code: `-124`
 - Description: `WINSOCK_UNEXPECTED_WRITTEN_BYTES`
 - Type: connection

```js
const err = new chromiumNetErrors.WinsockUnexpectedWrittenBytesError();
// or
const Err = chromiumNetErrors.getErrorByCode(-124);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('WINSOCK_UNEXPECTED_WRITTEN_BYTES');
const err = new Err();
```

### SslDecompressionFailureAlertError

> An SSL peer sent us a fatal decompression_failure alert. This typically
> occurs when a peer selects DEFLATE compression in the mistaken belief that
> it supports it.

 - Name: `SslDecompressionFailureAlertError`
 - Code: `-125`
 - Description: `SSL_DECOMPRESSION_FAILURE_ALERT`
 - Type: connection

```js
const err = new chromiumNetErrors.SslDecompressionFailureAlertError();
// or
const Err = chromiumNetErrors.getErrorByCode(-125);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_DECOMPRESSION_FAILURE_ALERT');
const err = new Err();
```

### SslBadRecordMacAlertError

> An SSL peer sent us a fatal bad_record_mac alert. This has been observed
> from servers with buggy DEFLATE support.

 - Name: `SslBadRecordMacAlertError`
 - Code: `-126`
 - Description: `SSL_BAD_RECORD_MAC_ALERT`
 - Type: connection

```js
const err = new chromiumNetErrors.SslBadRecordMacAlertError();
// or
const Err = chromiumNetErrors.getErrorByCode(-126);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_BAD_RECORD_MAC_ALERT');
const err = new Err();
```

### ProxyAuthRequestedError

> The proxy requested authentication (for tunnel establishment).

 - Name: `ProxyAuthRequestedError`
 - Code: `-127`
 - Description: `PROXY_AUTH_REQUESTED`
 - Type: connection

```js
const err = new chromiumNetErrors.ProxyAuthRequestedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-127);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PROXY_AUTH_REQUESTED');
const err = new Err();
```

### ProxyConnectionFailedError

> Could not create a connection to the proxy server. An error occurred
> either in resolving its name, or in connecting a socket to it.
> Note that this does NOT include failures during the actual "CONNECT" method
> of an HTTP proxy.

 - Name: `ProxyConnectionFailedError`
 - Code: `-130`
 - Description: `PROXY_CONNECTION_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.ProxyConnectionFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-130);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PROXY_CONNECTION_FAILED');
const err = new Err();
```

### MandatoryProxyConfigurationFailedError

> A mandatory proxy configuration could not be used. Currently this means
> that a mandatory PAC script could not be fetched, parsed or executed.

 - Name: `MandatoryProxyConfigurationFailedError`
 - Code: `-131`
 - Description: `MANDATORY_PROXY_CONFIGURATION_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.MandatoryProxyConfigurationFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-131);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('MANDATORY_PROXY_CONFIGURATION_FAILED');
const err = new Err();
```

### PreconnectMaxSocketLimitError

> We've hit the max socket limit for the socket pool while preconnecting. We
> don't bother trying to preconnect more sockets.

 - Name: `PreconnectMaxSocketLimitError`
 - Code: `-133`
 - Description: `PRECONNECT_MAX_SOCKET_LIMIT`
 - Type: connection

```js
const err = new chromiumNetErrors.PreconnectMaxSocketLimitError();
// or
const Err = chromiumNetErrors.getErrorByCode(-133);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PRECONNECT_MAX_SOCKET_LIMIT');
const err = new Err();
```

### SslClientAuthPrivateKeyAccessDeniedError

> The permission to use the SSL client certificate's private key was denied.

 - Name: `SslClientAuthPrivateKeyAccessDeniedError`
 - Code: `-134`
 - Description: `SSL_CLIENT_AUTH_PRIVATE_KEY_ACCESS_DENIED`
 - Type: connection

```js
const err = new chromiumNetErrors.SslClientAuthPrivateKeyAccessDeniedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-134);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_CLIENT_AUTH_PRIVATE_KEY_ACCESS_DENIED');
const err = new Err();
```

### SslClientAuthCertNoPrivateKeyError

> The SSL client certificate has no private key.

 - Name: `SslClientAuthCertNoPrivateKeyError`
 - Code: `-135`
 - Description: `SSL_CLIENT_AUTH_CERT_NO_PRIVATE_KEY`
 - Type: connection

```js
const err = new chromiumNetErrors.SslClientAuthCertNoPrivateKeyError();
// or
const Err = chromiumNetErrors.getErrorByCode(-135);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_CLIENT_AUTH_CERT_NO_PRIVATE_KEY');
const err = new Err();
```

### ProxyCertificateInvalidError

> The certificate presented by the HTTPS Proxy was invalid.

 - Name: `ProxyCertificateInvalidError`
 - Code: `-136`
 - Description: `PROXY_CERTIFICATE_INVALID`
 - Type: connection

```js
const err = new chromiumNetErrors.ProxyCertificateInvalidError();
// or
const Err = chromiumNetErrors.getErrorByCode(-136);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PROXY_CERTIFICATE_INVALID');
const err = new Err();
```

### NameResolutionFailedError

> An error occurred when trying to do a name resolution (DNS).

 - Name: `NameResolutionFailedError`
 - Code: `-137`
 - Description: `NAME_RESOLUTION_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.NameResolutionFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-137);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('NAME_RESOLUTION_FAILED');
const err = new Err();
```

### NetworkAccessDeniedError

> Permission to access the network was denied. This is used to distinguish
> errors that were most likely caused by a firewall from other access denied
> errors. See also ERR_ACCESS_DENIED.

 - Name: `NetworkAccessDeniedError`
 - Code: `-138`
 - Description: `NETWORK_ACCESS_DENIED`
 - Type: connection

```js
const err = new chromiumNetErrors.NetworkAccessDeniedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-138);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('NETWORK_ACCESS_DENIED');
const err = new Err();
```

### TemporarilyThrottledError

> The request throttler module cancelled this request to avoid DDOS.

 - Name: `TemporarilyThrottledError`
 - Code: `-139`
 - Description: `TEMPORARILY_THROTTLED`
 - Type: connection

```js
const err = new chromiumNetErrors.TemporarilyThrottledError();
// or
const Err = chromiumNetErrors.getErrorByCode(-139);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('TEMPORARILY_THROTTLED');
const err = new Err();
```

### HttpsProxyTunnelResponseRedirectError

> A request to create an SSL tunnel connection through the HTTPS proxy
> received a 302 (temporary redirect) response. The response body might
> include a description of why the request failed.
> 
> TODO(https://crbug.com/928551): This is deprecated and should not be used by
> new code.

 - Name: `HttpsProxyTunnelResponseRedirectError`
 - Code: `-140`
 - Description: `HTTPS_PROXY_TUNNEL_RESPONSE_REDIRECT`
 - Type: connection

```js
const err = new chromiumNetErrors.HttpsProxyTunnelResponseRedirectError();
// or
const Err = chromiumNetErrors.getErrorByCode(-140);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HTTPS_PROXY_TUNNEL_RESPONSE_REDIRECT');
const err = new Err();
```

### SslClientAuthSignatureFailedError

> We were unable to sign the CertificateVerify data of an SSL client auth
> handshake with the client certificate's private key.
> 
> Possible causes for this include the user implicitly or explicitly
> denying access to the private key, the private key may not be valid for
> signing, the key may be relying on a cached handle which is no longer
> valid, or the CSP won't allow arbitrary data to be signed.

 - Name: `SslClientAuthSignatureFailedError`
 - Code: `-141`
 - Description: `SSL_CLIENT_AUTH_SIGNATURE_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.SslClientAuthSignatureFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-141);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_CLIENT_AUTH_SIGNATURE_FAILED');
const err = new Err();
```

### MsgTooBigError

> The message was too large for the transport. (for example a UDP message
> which exceeds size threshold).

 - Name: `MsgTooBigError`
 - Code: `-142`
 - Description: `MSG_TOO_BIG`
 - Type: connection

```js
const err = new chromiumNetErrors.MsgTooBigError();
// or
const Err = chromiumNetErrors.getErrorByCode(-142);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('MSG_TOO_BIG');
const err = new Err();
```

### WsProtocolError

> Websocket protocol error. Indicates that we are terminating the connection
> due to a malformed frame or other protocol violation.

 - Name: `WsProtocolError`
 - Code: `-145`
 - Description: `WS_PROTOCOL_ERROR`
 - Type: connection

```js
const err = new chromiumNetErrors.WsProtocolError();
// or
const Err = chromiumNetErrors.getErrorByCode(-145);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('WS_PROTOCOL_ERROR');
const err = new Err();
```

### AddressInUseError

> Returned when attempting to bind an address that is already in use.

 - Name: `AddressInUseError`
 - Code: `-147`
 - Description: `ADDRESS_IN_USE`
 - Type: connection

```js
const err = new chromiumNetErrors.AddressInUseError();
// or
const Err = chromiumNetErrors.getErrorByCode(-147);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('ADDRESS_IN_USE');
const err = new Err();
```

### SslHandshakeNotCompletedError

> An operation failed because the SSL handshake has not completed.

 - Name: `SslHandshakeNotCompletedError`
 - Code: `-148`
 - Description: `SSL_HANDSHAKE_NOT_COMPLETED`
 - Type: connection

```js
const err = new chromiumNetErrors.SslHandshakeNotCompletedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-148);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_HANDSHAKE_NOT_COMPLETED');
const err = new Err();
```

### SslBadPeerPublicKeyError

> SSL peer's public key is invalid.

 - Name: `SslBadPeerPublicKeyError`
 - Code: `-149`
 - Description: `SSL_BAD_PEER_PUBLIC_KEY`
 - Type: connection

```js
const err = new chromiumNetErrors.SslBadPeerPublicKeyError();
// or
const Err = chromiumNetErrors.getErrorByCode(-149);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_BAD_PEER_PUBLIC_KEY');
const err = new Err();
```

### SslPinnedKeyNotInCertChainError

> The certificate didn't match the built-in public key pins for the host name.
> The pins are set in net/http/transport_security_state.cc and require that
> one of a set of public keys exist on the path from the leaf to the root.

 - Name: `SslPinnedKeyNotInCertChainError`
 - Code: `-150`
 - Description: `SSL_PINNED_KEY_NOT_IN_CERT_CHAIN`
 - Type: connection

```js
const err = new chromiumNetErrors.SslPinnedKeyNotInCertChainError();
// or
const Err = chromiumNetErrors.getErrorByCode(-150);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_PINNED_KEY_NOT_IN_CERT_CHAIN');
const err = new Err();
```

### ClientAuthCertTypeUnsupportedError

> Server request for client certificate did not contain any types we support.

 - Name: `ClientAuthCertTypeUnsupportedError`
 - Code: `-151`
 - Description: `CLIENT_AUTH_CERT_TYPE_UNSUPPORTED`
 - Type: connection

```js
const err = new chromiumNetErrors.ClientAuthCertTypeUnsupportedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-151);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CLIENT_AUTH_CERT_TYPE_UNSUPPORTED');
const err = new Err();
```

### SslDecryptErrorAlertError

> An SSL peer sent us a fatal decrypt_error alert. This typically occurs when
> a peer could not correctly verify a signature (in CertificateVerify or
> ServerKeyExchange) or validate a Finished message.

 - Name: `SslDecryptErrorAlertError`
 - Code: `-153`
 - Description: `SSL_DECRYPT_ERROR_ALERT`
 - Type: connection

```js
const err = new chromiumNetErrors.SslDecryptErrorAlertError();
// or
const Err = chromiumNetErrors.getErrorByCode(-153);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_DECRYPT_ERROR_ALERT');
const err = new Err();
```

### WsThrottleQueueTooLargeError

> There are too many pending WebSocketJob instances, so the new job was not
> pushed to the queue.

 - Name: `WsThrottleQueueTooLargeError`
 - Code: `-154`
 - Description: `WS_THROTTLE_QUEUE_TOO_LARGE`
 - Type: connection

```js
const err = new chromiumNetErrors.WsThrottleQueueTooLargeError();
// or
const Err = chromiumNetErrors.getErrorByCode(-154);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('WS_THROTTLE_QUEUE_TOO_LARGE');
const err = new Err();
```

### SslServerCertChangedError

> The SSL server certificate changed in a renegotiation.

 - Name: `SslServerCertChangedError`
 - Code: `-156`
 - Description: `SSL_SERVER_CERT_CHANGED`
 - Type: connection

```js
const err = new chromiumNetErrors.SslServerCertChangedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-156);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_SERVER_CERT_CHANGED');
const err = new Err();
```

### SslUnrecognizedNameAlertError

> The SSL server sent us a fatal unrecognized_name alert.

 - Name: `SslUnrecognizedNameAlertError`
 - Code: `-159`
 - Description: `SSL_UNRECOGNIZED_NAME_ALERT`
 - Type: connection

```js
const err = new chromiumNetErrors.SslUnrecognizedNameAlertError();
// or
const Err = chromiumNetErrors.getErrorByCode(-159);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_UNRECOGNIZED_NAME_ALERT');
const err = new Err();
```

### SocketSetReceiveBufferSizeError

> Failed to set the socket's receive buffer size as requested.

 - Name: `SocketSetReceiveBufferSizeError`
 - Code: `-160`
 - Description: `SOCKET_SET_RECEIVE_BUFFER_SIZE_ERROR`
 - Type: connection

```js
const err = new chromiumNetErrors.SocketSetReceiveBufferSizeError();
// or
const Err = chromiumNetErrors.getErrorByCode(-160);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SOCKET_SET_RECEIVE_BUFFER_SIZE_ERROR');
const err = new Err();
```

### SocketSetSendBufferSizeError

> Failed to set the socket's send buffer size as requested.

 - Name: `SocketSetSendBufferSizeError`
 - Code: `-161`
 - Description: `SOCKET_SET_SEND_BUFFER_SIZE_ERROR`
 - Type: connection

```js
const err = new chromiumNetErrors.SocketSetSendBufferSizeError();
// or
const Err = chromiumNetErrors.getErrorByCode(-161);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SOCKET_SET_SEND_BUFFER_SIZE_ERROR');
const err = new Err();
```

### SocketReceiveBufferSizeUnchangeableError

> Failed to set the socket's receive buffer size as requested, despite success
> return code from setsockopt.

 - Name: `SocketReceiveBufferSizeUnchangeableError`
 - Code: `-162`
 - Description: `SOCKET_RECEIVE_BUFFER_SIZE_UNCHANGEABLE`
 - Type: connection

```js
const err = new chromiumNetErrors.SocketReceiveBufferSizeUnchangeableError();
// or
const Err = chromiumNetErrors.getErrorByCode(-162);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SOCKET_RECEIVE_BUFFER_SIZE_UNCHANGEABLE');
const err = new Err();
```

### SocketSendBufferSizeUnchangeableError

> Failed to set the socket's send buffer size as requested, despite success
> return code from setsockopt.

 - Name: `SocketSendBufferSizeUnchangeableError`
 - Code: `-163`
 - Description: `SOCKET_SEND_BUFFER_SIZE_UNCHANGEABLE`
 - Type: connection

```js
const err = new chromiumNetErrors.SocketSendBufferSizeUnchangeableError();
// or
const Err = chromiumNetErrors.getErrorByCode(-163);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SOCKET_SEND_BUFFER_SIZE_UNCHANGEABLE');
const err = new Err();
```

### SslClientAuthCertBadFormatError

> Failed to import a client certificate from the platform store into the SSL
> library.

 - Name: `SslClientAuthCertBadFormatError`
 - Code: `-164`
 - Description: `SSL_CLIENT_AUTH_CERT_BAD_FORMAT`
 - Type: connection

```js
const err = new chromiumNetErrors.SslClientAuthCertBadFormatError();
// or
const Err = chromiumNetErrors.getErrorByCode(-164);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_CLIENT_AUTH_CERT_BAD_FORMAT');
const err = new Err();
```

### IcannNameCollisionError

> Resolving a hostname to an IP address list included the IPv4 address
> "127.0.53.53". This is a special IP address which ICANN has recommended to
> indicate there was a name collision, and alert admins to a potential
> problem.

 - Name: `IcannNameCollisionError`
 - Code: `-166`
 - Description: `ICANN_NAME_COLLISION`
 - Type: connection

```js
const err = new chromiumNetErrors.IcannNameCollisionError();
// or
const Err = chromiumNetErrors.getErrorByCode(-166);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('ICANN_NAME_COLLISION');
const err = new Err();
```

### SslServerCertBadFormatError

> The SSL server presented a certificate which could not be decoded. This is
> not a certificate error code as no X509Certificate object is available. This
> error is fatal.

 - Name: `SslServerCertBadFormatError`
 - Code: `-167`
 - Description: `SSL_SERVER_CERT_BAD_FORMAT`
 - Type: connection

```js
const err = new chromiumNetErrors.SslServerCertBadFormatError();
// or
const Err = chromiumNetErrors.getErrorByCode(-167);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_SERVER_CERT_BAD_FORMAT');
const err = new Err();
```

### CtSthParsingFailedError

> Certificate Transparency: Received a signed tree head that failed to parse.

 - Name: `CtSthParsingFailedError`
 - Code: `-168`
 - Description: `CT_STH_PARSING_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.CtSthParsingFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-168);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CT_STH_PARSING_FAILED');
const err = new Err();
```

### CtSthIncompleteError

> Certificate Transparency: Received a signed tree head whose JSON parsing was
> OK but was missing some of the fields.

 - Name: `CtSthIncompleteError`
 - Code: `-169`
 - Description: `CT_STH_INCOMPLETE`
 - Type: connection

```js
const err = new chromiumNetErrors.CtSthIncompleteError();
// or
const Err = chromiumNetErrors.getErrorByCode(-169);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CT_STH_INCOMPLETE');
const err = new Err();
```

### UnableToReuseConnectionForProxyAuthError

> The attempt to reuse a connection to send proxy auth credentials failed
> before the AuthController was used to generate credentials. The caller should
> reuse the controller with a new connection. This error is only used
> internally by the network stack.

 - Name: `UnableToReuseConnectionForProxyAuthError`
 - Code: `-170`
 - Description: `UNABLE_TO_REUSE_CONNECTION_FOR_PROXY_AUTH`
 - Type: connection

```js
const err = new chromiumNetErrors.UnableToReuseConnectionForProxyAuthError();
// or
const Err = chromiumNetErrors.getErrorByCode(-170);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('UNABLE_TO_REUSE_CONNECTION_FOR_PROXY_AUTH');
const err = new Err();
```

### CtConsistencyProofParsingFailedError

> Certificate Transparency: Failed to parse the received consistency proof.

 - Name: `CtConsistencyProofParsingFailedError`
 - Code: `-171`
 - Description: `CT_CONSISTENCY_PROOF_PARSING_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.CtConsistencyProofParsingFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-171);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CT_CONSISTENCY_PROOF_PARSING_FAILED');
const err = new Err();
```

### SslObsoleteCipherError

> The SSL server required an unsupported cipher suite that has since been
> removed. This error will temporarily be signaled on a fallback for one or two
> releases immediately following a cipher suite's removal, after which the
> fallback will be removed.

 - Name: `SslObsoleteCipherError`
 - Code: `-172`
 - Description: `SSL_OBSOLETE_CIPHER`
 - Type: connection

```js
const err = new chromiumNetErrors.SslObsoleteCipherError();
// or
const Err = chromiumNetErrors.getErrorByCode(-172);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_OBSOLETE_CIPHER');
const err = new Err();
```

### WsUpgradeError

> When a WebSocket handshake is done successfully and the connection has been
> upgraded, the URLRequest is cancelled with this error code.

 - Name: `WsUpgradeError`
 - Code: `-173`
 - Description: `WS_UPGRADE`
 - Type: connection

```js
const err = new chromiumNetErrors.WsUpgradeError();
// or
const Err = chromiumNetErrors.getErrorByCode(-173);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('WS_UPGRADE');
const err = new Err();
```

### ReadIfReadyNotImplementedError

> Socket ReadIfReady support is not implemented. This error should not be user
> visible, because the normal Read() method is used as a fallback.

 - Name: `ReadIfReadyNotImplementedError`
 - Code: `-174`
 - Description: `READ_IF_READY_NOT_IMPLEMENTED`
 - Type: connection

```js
const err = new chromiumNetErrors.ReadIfReadyNotImplementedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-174);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('READ_IF_READY_NOT_IMPLEMENTED');
const err = new Err();
```

### NoBufferSpaceError

> No socket buffer space is available.

 - Name: `NoBufferSpaceError`
 - Code: `-176`
 - Description: `NO_BUFFER_SPACE`
 - Type: connection

```js
const err = new chromiumNetErrors.NoBufferSpaceError();
// or
const Err = chromiumNetErrors.getErrorByCode(-176);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('NO_BUFFER_SPACE');
const err = new Err();
```

### SslClientAuthNoCommonAlgorithmsError

> There were no common signature algorithms between our client certificate
> private key and the server's preferences.

 - Name: `SslClientAuthNoCommonAlgorithmsError`
 - Code: `-177`
 - Description: `SSL_CLIENT_AUTH_NO_COMMON_ALGORITHMS`
 - Type: connection

```js
const err = new chromiumNetErrors.SslClientAuthNoCommonAlgorithmsError();
// or
const Err = chromiumNetErrors.getErrorByCode(-177);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_CLIENT_AUTH_NO_COMMON_ALGORITHMS');
const err = new Err();
```

### EarlyDataRejectedError

> TLS 1.3 early data was rejected by the server. This will be received before
> any data is returned from the socket. The request should be retried with
> early data disabled.

 - Name: `EarlyDataRejectedError`
 - Code: `-178`
 - Description: `EARLY_DATA_REJECTED`
 - Type: connection

```js
const err = new chromiumNetErrors.EarlyDataRejectedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-178);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('EARLY_DATA_REJECTED');
const err = new Err();
```

### WrongVersionOnEarlyDataError

> TLS 1.3 early data was offered, but the server responded with TLS 1.2 or
> earlier. This is an internal error code to account for a
> backwards-compatibility issue with early data and TLS 1.2. It will be
> received before any data is returned from the socket. The request should be
> retried with early data disabled.
> 
> See https://tools.ietf.org/html/rfc8446#appendix-D.3 for details.

 - Name: `WrongVersionOnEarlyDataError`
 - Code: `-179`
 - Description: `WRONG_VERSION_ON_EARLY_DATA`
 - Type: connection

```js
const err = new chromiumNetErrors.WrongVersionOnEarlyDataError();
// or
const Err = chromiumNetErrors.getErrorByCode(-179);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('WRONG_VERSION_ON_EARLY_DATA');
const err = new Err();
```

### Tls13DowngradeDetectedError

> TLS 1.3 was enabled, but a lower version was negotiated and the server
> returned a value indicating it supported TLS 1.3. This is part of a security
> check in TLS 1.3, but it may also indicate the user is behind a buggy
> TLS-terminating proxy which implemented TLS 1.2 incorrectly. (See
> https://crbug.com/boringssl/226.)

 - Name: `Tls13DowngradeDetectedError`
 - Code: `-180`
 - Description: `TLS13_DOWNGRADE_DETECTED`
 - Type: connection

```js
const err = new chromiumNetErrors.Tls13DowngradeDetectedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-180);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('TLS13_DOWNGRADE_DETECTED');
const err = new Err();
```

### SslKeyUsageIncompatibleError

> The server's certificate has a keyUsage extension incompatible with the
> negotiated TLS key exchange method.

 - Name: `SslKeyUsageIncompatibleError`
 - Code: `-181`
 - Description: `SSL_KEY_USAGE_INCOMPATIBLE`
 - Type: connection

```js
const err = new chromiumNetErrors.SslKeyUsageIncompatibleError();
// or
const Err = chromiumNetErrors.getErrorByCode(-181);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SSL_KEY_USAGE_INCOMPATIBLE');
const err = new Err();
```

### CertCommonNameInvalidError

> The server responded with a certificate whose common name did not match
> the host name. This could mean:
> 
> 1. An attacker has redirected our traffic to their server and is
> presenting a certificate for which they know the private key.
> 
> 2. The server is misconfigured and responding with the wrong cert.
> 
> 3. The user is on a wireless network and is being redirected to the
> network's login page.
> 
> 4. The OS has used a DNS search suffix and the server doesn't have
> a certificate for the abbreviated name in the address bar.
> 

 - Name: `CertCommonNameInvalidError`
 - Code: `-200`
 - Description: `CERT_COMMON_NAME_INVALID`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertCommonNameInvalidError();
// or
const Err = chromiumNetErrors.getErrorByCode(-200);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_COMMON_NAME_INVALID');
const err = new Err();
```

### CertDateInvalidError

> The server responded with a certificate that, by our clock, appears to
> either not yet be valid or to have expired. This could mean:
> 
> 1. An attacker is presenting an old certificate for which they have
> managed to obtain the private key.
> 
> 2. The server is misconfigured and is not presenting a valid cert.
> 
> 3. Our clock is wrong.
> 

 - Name: `CertDateInvalidError`
 - Code: `-201`
 - Description: `CERT_DATE_INVALID`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertDateInvalidError();
// or
const Err = chromiumNetErrors.getErrorByCode(-201);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_DATE_INVALID');
const err = new Err();
```

### CertAuthorityInvalidError

> The server responded with a certificate that is signed by an authority
> we don't trust. The could mean:
> 
> 1. An attacker has substituted the real certificate for a cert that
> contains their public key and is signed by their cousin.
> 
> 2. The server operator has a legitimate certificate from a CA we don't
> know about, but should trust.
> 
> 3. The server is presenting a self-signed certificate, providing no
> defense against active attackers (but foiling passive attackers).
> 

 - Name: `CertAuthorityInvalidError`
 - Code: `-202`
 - Description: `CERT_AUTHORITY_INVALID`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertAuthorityInvalidError();
// or
const Err = chromiumNetErrors.getErrorByCode(-202);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_AUTHORITY_INVALID');
const err = new Err();
```

### CertContainsErrorsError

> The server responded with a certificate that contains errors.
> This error is not recoverable.
> 
> MSDN describes this error as follows:
> "The SSL certificate contains errors."
> NOTE: It's unclear how this differs from ERR_CERT_INVALID. For consistency,
> use that code instead of this one from now on.
> 

 - Name: `CertContainsErrorsError`
 - Code: `-203`
 - Description: `CERT_CONTAINS_ERRORS`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertContainsErrorsError();
// or
const Err = chromiumNetErrors.getErrorByCode(-203);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_CONTAINS_ERRORS');
const err = new Err();
```

### CertNoRevocationMechanismError

> The certificate has no mechanism for determining if it is revoked. In
> effect, this certificate cannot be revoked.

 - Name: `CertNoRevocationMechanismError`
 - Code: `-204`
 - Description: `CERT_NO_REVOCATION_MECHANISM`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertNoRevocationMechanismError();
// or
const Err = chromiumNetErrors.getErrorByCode(-204);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_NO_REVOCATION_MECHANISM');
const err = new Err();
```

### CertUnableToCheckRevocationError

> Revocation information for the security certificate for this site is not
> available. This could mean:
> 
> 1. An attacker has compromised the private key in the certificate and is
> blocking our attempt to find out that the cert was revoked.
> 
> 2. The certificate is unrevoked, but the revocation server is busy or
> unavailable.
> 

 - Name: `CertUnableToCheckRevocationError`
 - Code: `-205`
 - Description: `CERT_UNABLE_TO_CHECK_REVOCATION`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertUnableToCheckRevocationError();
// or
const Err = chromiumNetErrors.getErrorByCode(-205);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_UNABLE_TO_CHECK_REVOCATION');
const err = new Err();
```

### CertRevokedError

> The server responded with a certificate has been revoked.
> We have the capability to ignore this error, but it is probably not the
> thing to do.

 - Name: `CertRevokedError`
 - Code: `-206`
 - Description: `CERT_REVOKED`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertRevokedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-206);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_REVOKED');
const err = new Err();
```

### CertInvalidError

> The server responded with a certificate that is invalid.
> This error is not recoverable.
> 
> MSDN describes this error as follows:
> "The SSL certificate is invalid."
> 

 - Name: `CertInvalidError`
 - Code: `-207`
 - Description: `CERT_INVALID`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertInvalidError();
// or
const Err = chromiumNetErrors.getErrorByCode(-207);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_INVALID');
const err = new Err();
```

### CertWeakSignatureAlgorithmError

> The server responded with a certificate that is signed using a weak
> signature algorithm.

 - Name: `CertWeakSignatureAlgorithmError`
 - Code: `-208`
 - Description: `CERT_WEAK_SIGNATURE_ALGORITHM`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertWeakSignatureAlgorithmError();
// or
const Err = chromiumNetErrors.getErrorByCode(-208);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_WEAK_SIGNATURE_ALGORITHM');
const err = new Err();
```

### CertNonUniqueNameError

> The host name specified in the certificate is not unique.

 - Name: `CertNonUniqueNameError`
 - Code: `-210`
 - Description: `CERT_NON_UNIQUE_NAME`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertNonUniqueNameError();
// or
const Err = chromiumNetErrors.getErrorByCode(-210);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_NON_UNIQUE_NAME');
const err = new Err();
```

### CertWeakKeyError

> The server responded with a certificate that contains a weak key (e.g.
> a too-small RSA key).

 - Name: `CertWeakKeyError`
 - Code: `-211`
 - Description: `CERT_WEAK_KEY`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertWeakKeyError();
// or
const Err = chromiumNetErrors.getErrorByCode(-211);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_WEAK_KEY');
const err = new Err();
```

### CertNameConstraintViolationError

> The certificate claimed DNS names that are in violation of name constraints.

 - Name: `CertNameConstraintViolationError`
 - Code: `-212`
 - Description: `CERT_NAME_CONSTRAINT_VIOLATION`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertNameConstraintViolationError();
// or
const Err = chromiumNetErrors.getErrorByCode(-212);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_NAME_CONSTRAINT_VIOLATION');
const err = new Err();
```

### CertValidityTooLongError

> The certificate's validity period is too long.

 - Name: `CertValidityTooLongError`
 - Code: `-213`
 - Description: `CERT_VALIDITY_TOO_LONG`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertValidityTooLongError();
// or
const Err = chromiumNetErrors.getErrorByCode(-213);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_VALIDITY_TOO_LONG');
const err = new Err();
```

### CertificateTransparencyRequiredError

> Certificate Transparency was required for this connection, but the server
> did not provide CT information that complied with the policy.

 - Name: `CertificateTransparencyRequiredError`
 - Code: `-214`
 - Description: `CERTIFICATE_TRANSPARENCY_REQUIRED`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertificateTransparencyRequiredError();
// or
const Err = chromiumNetErrors.getErrorByCode(-214);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERTIFICATE_TRANSPARENCY_REQUIRED');
const err = new Err();
```

### CertSymantecLegacyError

> The certificate chained to a legacy Symantec root that is no longer trusted.
> https://g.co/chrome/symantecpkicerts

 - Name: `CertSymantecLegacyError`
 - Code: `-215`
 - Description: `CERT_SYMANTEC_LEGACY`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertSymantecLegacyError();
// or
const Err = chromiumNetErrors.getErrorByCode(-215);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_SYMANTEC_LEGACY');
const err = new Err();
```

### CertEndError

> The value immediately past the last certificate error code.

 - Name: `CertEndError`
 - Code: `-218`
 - Description: `CERT_END`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertEndError();
// or
const Err = chromiumNetErrors.getErrorByCode(-218);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_END');
const err = new Err();
```

### InvalidUrlError

> The URL is invalid.

 - Name: `InvalidUrlError`
 - Code: `-300`
 - Description: `INVALID_URL`
 - Type: http

```js
const err = new chromiumNetErrors.InvalidUrlError();
// or
const Err = chromiumNetErrors.getErrorByCode(-300);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('INVALID_URL');
const err = new Err();
```

### DisallowedUrlSchemeError

> The scheme of the URL is disallowed.

 - Name: `DisallowedUrlSchemeError`
 - Code: `-301`
 - Description: `DISALLOWED_URL_SCHEME`
 - Type: http

```js
const err = new chromiumNetErrors.DisallowedUrlSchemeError();
// or
const Err = chromiumNetErrors.getErrorByCode(-301);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('DISALLOWED_URL_SCHEME');
const err = new Err();
```

### UnknownUrlSchemeError

> The scheme of the URL is unknown.

 - Name: `UnknownUrlSchemeError`
 - Code: `-302`
 - Description: `UNKNOWN_URL_SCHEME`
 - Type: http

```js
const err = new chromiumNetErrors.UnknownUrlSchemeError();
// or
const Err = chromiumNetErrors.getErrorByCode(-302);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('UNKNOWN_URL_SCHEME');
const err = new Err();
```

### InvalidRedirectError

> Attempting to load an URL resulted in a redirect to an invalid URL.

 - Name: `InvalidRedirectError`
 - Code: `-303`
 - Description: `INVALID_REDIRECT`
 - Type: http

```js
const err = new chromiumNetErrors.InvalidRedirectError();
// or
const Err = chromiumNetErrors.getErrorByCode(-303);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('INVALID_REDIRECT');
const err = new Err();
```

### TooManyRedirectsError

> Attempting to load an URL resulted in too many redirects.

 - Name: `TooManyRedirectsError`
 - Code: `-310`
 - Description: `TOO_MANY_REDIRECTS`
 - Type: http

```js
const err = new chromiumNetErrors.TooManyRedirectsError();
// or
const Err = chromiumNetErrors.getErrorByCode(-310);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('TOO_MANY_REDIRECTS');
const err = new Err();
```

### UnsafeRedirectError

> Attempting to load an URL resulted in an unsafe redirect (e.g., a redirect
> to file:// is considered unsafe).

 - Name: `UnsafeRedirectError`
 - Code: `-311`
 - Description: `UNSAFE_REDIRECT`
 - Type: http

```js
const err = new chromiumNetErrors.UnsafeRedirectError();
// or
const Err = chromiumNetErrors.getErrorByCode(-311);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('UNSAFE_REDIRECT');
const err = new Err();
```

### UnsafePortError

> Attempting to load an URL with an unsafe port number. These are port
> numbers that correspond to services, which are not robust to spurious input
> that may be constructed as a result of an allowed web construct (e.g., HTTP
> looks a lot like SMTP, so form submission to port 25 is denied).

 - Name: `UnsafePortError`
 - Code: `-312`
 - Description: `UNSAFE_PORT`
 - Type: http

```js
const err = new chromiumNetErrors.UnsafePortError();
// or
const Err = chromiumNetErrors.getErrorByCode(-312);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('UNSAFE_PORT');
const err = new Err();
```

### InvalidResponseError

> The server's response was invalid.

 - Name: `InvalidResponseError`
 - Code: `-320`
 - Description: `INVALID_RESPONSE`
 - Type: http

```js
const err = new chromiumNetErrors.InvalidResponseError();
// or
const Err = chromiumNetErrors.getErrorByCode(-320);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('INVALID_RESPONSE');
const err = new Err();
```

### InvalidChunkedEncodingError

> Error in chunked transfer encoding.

 - Name: `InvalidChunkedEncodingError`
 - Code: `-321`
 - Description: `INVALID_CHUNKED_ENCODING`
 - Type: http

```js
const err = new chromiumNetErrors.InvalidChunkedEncodingError();
// or
const Err = chromiumNetErrors.getErrorByCode(-321);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('INVALID_CHUNKED_ENCODING');
const err = new Err();
```

### MethodNotSupportedError

> The server did not support the request method.

 - Name: `MethodNotSupportedError`
 - Code: `-322`
 - Description: `METHOD_NOT_SUPPORTED`
 - Type: http

```js
const err = new chromiumNetErrors.MethodNotSupportedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-322);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('METHOD_NOT_SUPPORTED');
const err = new Err();
```

### UnexpectedProxyAuthError

> The response was 407 (Proxy Authentication Required), yet we did not send
> the request to a proxy.

 - Name: `UnexpectedProxyAuthError`
 - Code: `-323`
 - Description: `UNEXPECTED_PROXY_AUTH`
 - Type: http

```js
const err = new chromiumNetErrors.UnexpectedProxyAuthError();
// or
const Err = chromiumNetErrors.getErrorByCode(-323);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('UNEXPECTED_PROXY_AUTH');
const err = new Err();
```

### EmptyResponseError

> The server closed the connection without sending any data.

 - Name: `EmptyResponseError`
 - Code: `-324`
 - Description: `EMPTY_RESPONSE`
 - Type: http

```js
const err = new chromiumNetErrors.EmptyResponseError();
// or
const Err = chromiumNetErrors.getErrorByCode(-324);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('EMPTY_RESPONSE');
const err = new Err();
```

### ResponseHeadersTooBigError

> The headers section of the response is too large.

 - Name: `ResponseHeadersTooBigError`
 - Code: `-325`
 - Description: `RESPONSE_HEADERS_TOO_BIG`
 - Type: http

```js
const err = new chromiumNetErrors.ResponseHeadersTooBigError();
// or
const Err = chromiumNetErrors.getErrorByCode(-325);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('RESPONSE_HEADERS_TOO_BIG');
const err = new Err();
```

### PacScriptFailedError

> The evaluation of the PAC script failed.

 - Name: `PacScriptFailedError`
 - Code: `-327`
 - Description: `PAC_SCRIPT_FAILED`
 - Type: http

```js
const err = new chromiumNetErrors.PacScriptFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-327);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PAC_SCRIPT_FAILED');
const err = new Err();
```

### RequestRangeNotSatisfiableError

> The response was 416 (Requested range not satisfiable) and the server cannot
> satisfy the range requested.

 - Name: `RequestRangeNotSatisfiableError`
 - Code: `-328`
 - Description: `REQUEST_RANGE_NOT_SATISFIABLE`
 - Type: http

```js
const err = new chromiumNetErrors.RequestRangeNotSatisfiableError();
// or
const Err = chromiumNetErrors.getErrorByCode(-328);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('REQUEST_RANGE_NOT_SATISFIABLE');
const err = new Err();
```

### MalformedIdentityError

> The identity used for authentication is invalid.

 - Name: `MalformedIdentityError`
 - Code: `-329`
 - Description: `MALFORMED_IDENTITY`
 - Type: http

```js
const err = new chromiumNetErrors.MalformedIdentityError();
// or
const Err = chromiumNetErrors.getErrorByCode(-329);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('MALFORMED_IDENTITY');
const err = new Err();
```

### ContentDecodingFailedError

> Content decoding of the response body failed.

 - Name: `ContentDecodingFailedError`
 - Code: `-330`
 - Description: `CONTENT_DECODING_FAILED`
 - Type: http

```js
const err = new chromiumNetErrors.ContentDecodingFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-330);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CONTENT_DECODING_FAILED');
const err = new Err();
```

### NetworkIoSuspendedError

> An operation could not be completed because all network IO
> is suspended.

 - Name: `NetworkIoSuspendedError`
 - Code: `-331`
 - Description: `NETWORK_IO_SUSPENDED`
 - Type: http

```js
const err = new chromiumNetErrors.NetworkIoSuspendedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-331);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('NETWORK_IO_SUSPENDED');
const err = new Err();
```

### SynReplyNotReceivedError

> FLIP data received without receiving a SYN_REPLY on the stream.

 - Name: `SynReplyNotReceivedError`
 - Code: `-332`
 - Description: `SYN_REPLY_NOT_RECEIVED`
 - Type: http

```js
const err = new chromiumNetErrors.SynReplyNotReceivedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-332);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SYN_REPLY_NOT_RECEIVED');
const err = new Err();
```

### EncodingConversionFailedError

> Converting the response to target encoding failed.

 - Name: `EncodingConversionFailedError`
 - Code: `-333`
 - Description: `ENCODING_CONVERSION_FAILED`
 - Type: http

```js
const err = new chromiumNetErrors.EncodingConversionFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-333);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('ENCODING_CONVERSION_FAILED');
const err = new Err();
```

### UnrecognizedFtpDirectoryListingFormatError

> The server sent an FTP directory listing in a format we do not understand.

 - Name: `UnrecognizedFtpDirectoryListingFormatError`
 - Code: `-334`
 - Description: `UNRECOGNIZED_FTP_DIRECTORY_LISTING_FORMAT`
 - Type: http

```js
const err = new chromiumNetErrors.UnrecognizedFtpDirectoryListingFormatError();
// or
const Err = chromiumNetErrors.getErrorByCode(-334);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('UNRECOGNIZED_FTP_DIRECTORY_LISTING_FORMAT');
const err = new Err();
```

### NoSupportedProxiesError

> There are no supported proxies in the provided list.

 - Name: `NoSupportedProxiesError`
 - Code: `-336`
 - Description: `NO_SUPPORTED_PROXIES`
 - Type: http

```js
const err = new chromiumNetErrors.NoSupportedProxiesError();
// or
const Err = chromiumNetErrors.getErrorByCode(-336);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('NO_SUPPORTED_PROXIES');
const err = new Err();
```

### Http2ProtocolError

> There is an HTTP/2 protocol error.

 - Name: `Http2ProtocolError`
 - Code: `-337`
 - Description: `HTTP2_PROTOCOL_ERROR`
 - Type: http

```js
const err = new chromiumNetErrors.Http2ProtocolError();
// or
const Err = chromiumNetErrors.getErrorByCode(-337);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HTTP2_PROTOCOL_ERROR');
const err = new Err();
```

### InvalidAuthCredentialsError

> Credentials could not be established during HTTP Authentication.

 - Name: `InvalidAuthCredentialsError`
 - Code: `-338`
 - Description: `INVALID_AUTH_CREDENTIALS`
 - Type: http

```js
const err = new chromiumNetErrors.InvalidAuthCredentialsError();
// or
const Err = chromiumNetErrors.getErrorByCode(-338);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('INVALID_AUTH_CREDENTIALS');
const err = new Err();
```

### UnsupportedAuthSchemeError

> An HTTP Authentication scheme was tried which is not supported on this
> machine.

 - Name: `UnsupportedAuthSchemeError`
 - Code: `-339`
 - Description: `UNSUPPORTED_AUTH_SCHEME`
 - Type: http

```js
const err = new chromiumNetErrors.UnsupportedAuthSchemeError();
// or
const Err = chromiumNetErrors.getErrorByCode(-339);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('UNSUPPORTED_AUTH_SCHEME');
const err = new Err();
```

### EncodingDetectionFailedError

> Detecting the encoding of the response failed.

 - Name: `EncodingDetectionFailedError`
 - Code: `-340`
 - Description: `ENCODING_DETECTION_FAILED`
 - Type: http

```js
const err = new chromiumNetErrors.EncodingDetectionFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-340);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('ENCODING_DETECTION_FAILED');
const err = new Err();
```

### MissingAuthCredentialsError

> (GSSAPI) No Kerberos credentials were available during HTTP Authentication.

 - Name: `MissingAuthCredentialsError`
 - Code: `-341`
 - Description: `MISSING_AUTH_CREDENTIALS`
 - Type: http

```js
const err = new chromiumNetErrors.MissingAuthCredentialsError();
// or
const Err = chromiumNetErrors.getErrorByCode(-341);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('MISSING_AUTH_CREDENTIALS');
const err = new Err();
```

### UnexpectedSecurityLibraryStatusError

> An unexpected, but documented, SSPI or GSSAPI status code was returned.

 - Name: `UnexpectedSecurityLibraryStatusError`
 - Code: `-342`
 - Description: `UNEXPECTED_SECURITY_LIBRARY_STATUS`
 - Type: http

```js
const err = new chromiumNetErrors.UnexpectedSecurityLibraryStatusError();
// or
const Err = chromiumNetErrors.getErrorByCode(-342);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('UNEXPECTED_SECURITY_LIBRARY_STATUS');
const err = new Err();
```

### MisconfiguredAuthEnvironmentError

> The environment was not set up correctly for authentication (for
> example, no KDC could be found or the principal is unknown.

 - Name: `MisconfiguredAuthEnvironmentError`
 - Code: `-343`
 - Description: `MISCONFIGURED_AUTH_ENVIRONMENT`
 - Type: http

```js
const err = new chromiumNetErrors.MisconfiguredAuthEnvironmentError();
// or
const Err = chromiumNetErrors.getErrorByCode(-343);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('MISCONFIGURED_AUTH_ENVIRONMENT');
const err = new Err();
```

### UndocumentedSecurityLibraryStatusError

> An undocumented SSPI or GSSAPI status code was returned.

 - Name: `UndocumentedSecurityLibraryStatusError`
 - Code: `-344`
 - Description: `UNDOCUMENTED_SECURITY_LIBRARY_STATUS`
 - Type: http

```js
const err = new chromiumNetErrors.UndocumentedSecurityLibraryStatusError();
// or
const Err = chromiumNetErrors.getErrorByCode(-344);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('UNDOCUMENTED_SECURITY_LIBRARY_STATUS');
const err = new Err();
```

### ResponseBodyTooBigToDrainError

> The HTTP response was too big to drain.

 - Name: `ResponseBodyTooBigToDrainError`
 - Code: `-345`
 - Description: `RESPONSE_BODY_TOO_BIG_TO_DRAIN`
 - Type: http

```js
const err = new chromiumNetErrors.ResponseBodyTooBigToDrainError();
// or
const Err = chromiumNetErrors.getErrorByCode(-345);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('RESPONSE_BODY_TOO_BIG_TO_DRAIN');
const err = new Err();
```

### ResponseHeadersMultipleContentLengthError

> The HTTP response contained multiple distinct Content-Length headers.

 - Name: `ResponseHeadersMultipleContentLengthError`
 - Code: `-346`
 - Description: `RESPONSE_HEADERS_MULTIPLE_CONTENT_LENGTH`
 - Type: http

```js
const err = new chromiumNetErrors.ResponseHeadersMultipleContentLengthError();
// or
const Err = chromiumNetErrors.getErrorByCode(-346);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('RESPONSE_HEADERS_MULTIPLE_CONTENT_LENGTH');
const err = new Err();
```

### IncompleteHttp2HeadersError

> HTTP/2 headers have been received, but not all of them - status or version
> headers are missing, so we're expecting additional frames to complete them.

 - Name: `IncompleteHttp2HeadersError`
 - Code: `-347`
 - Description: `INCOMPLETE_HTTP2_HEADERS`
 - Type: http

```js
const err = new chromiumNetErrors.IncompleteHttp2HeadersError();
// or
const Err = chromiumNetErrors.getErrorByCode(-347);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('INCOMPLETE_HTTP2_HEADERS');
const err = new Err();
```

### PacNotInDhcpError

> No PAC URL configuration could be retrieved from DHCP. This can indicate
> either a failure to retrieve the DHCP configuration, or that there was no
> PAC URL configured in DHCP.

 - Name: `PacNotInDhcpError`
 - Code: `-348`
 - Description: `PAC_NOT_IN_DHCP`
 - Type: http

```js
const err = new chromiumNetErrors.PacNotInDhcpError();
// or
const Err = chromiumNetErrors.getErrorByCode(-348);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PAC_NOT_IN_DHCP');
const err = new Err();
```

### ResponseHeadersMultipleContentDispositionError

> The HTTP response contained multiple Content-Disposition headers.

 - Name: `ResponseHeadersMultipleContentDispositionError`
 - Code: `-349`
 - Description: `RESPONSE_HEADERS_MULTIPLE_CONTENT_DISPOSITION`
 - Type: http

```js
const err = new chromiumNetErrors.ResponseHeadersMultipleContentDispositionError();
// or
const Err = chromiumNetErrors.getErrorByCode(-349);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('RESPONSE_HEADERS_MULTIPLE_CONTENT_DISPOSITION');
const err = new Err();
```

### ResponseHeadersMultipleLocationError

> The HTTP response contained multiple Location headers.

 - Name: `ResponseHeadersMultipleLocationError`
 - Code: `-350`
 - Description: `RESPONSE_HEADERS_MULTIPLE_LOCATION`
 - Type: http

```js
const err = new chromiumNetErrors.ResponseHeadersMultipleLocationError();
// or
const Err = chromiumNetErrors.getErrorByCode(-350);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('RESPONSE_HEADERS_MULTIPLE_LOCATION');
const err = new Err();
```

### Http2ServerRefusedStreamError

> HTTP/2 server refused the request without processing, and sent either a
> GOAWAY frame with error code NO_ERROR and Last-Stream-ID lower than the
> stream id corresponding to the request indicating that this request has not
> been processed yet, or a RST_STREAM frame with error code REFUSED_STREAM.
> Client MAY retry (on a different connection). See RFC7540 Section 8.1.4.

 - Name: `Http2ServerRefusedStreamError`
 - Code: `-351`
 - Description: `HTTP2_SERVER_REFUSED_STREAM`
 - Type: http

```js
const err = new chromiumNetErrors.Http2ServerRefusedStreamError();
// or
const Err = chromiumNetErrors.getErrorByCode(-351);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HTTP2_SERVER_REFUSED_STREAM');
const err = new Err();
```

### Http2PingFailedError

> HTTP/2 server didn't respond to the PING message.

 - Name: `Http2PingFailedError`
 - Code: `-352`
 - Description: `HTTP2_PING_FAILED`
 - Type: http

```js
const err = new chromiumNetErrors.Http2PingFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-352);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HTTP2_PING_FAILED');
const err = new Err();
```

### ContentLengthMismatchError

> The HTTP response body transferred fewer bytes than were advertised by the
> Content-Length header when the connection is closed.

 - Name: `ContentLengthMismatchError`
 - Code: `-354`
 - Description: `CONTENT_LENGTH_MISMATCH`
 - Type: http

```js
const err = new chromiumNetErrors.ContentLengthMismatchError();
// or
const Err = chromiumNetErrors.getErrorByCode(-354);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CONTENT_LENGTH_MISMATCH');
const err = new Err();
```

### IncompleteChunkedEncodingError

> The HTTP response body is transferred with Chunked-Encoding, but the
> terminating zero-length chunk was never sent when the connection is closed.

 - Name: `IncompleteChunkedEncodingError`
 - Code: `-355`
 - Description: `INCOMPLETE_CHUNKED_ENCODING`
 - Type: http

```js
const err = new chromiumNetErrors.IncompleteChunkedEncodingError();
// or
const Err = chromiumNetErrors.getErrorByCode(-355);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('INCOMPLETE_CHUNKED_ENCODING');
const err = new Err();
```

### QuicProtocolError

> There is a QUIC protocol error.

 - Name: `QuicProtocolError`
 - Code: `-356`
 - Description: `QUIC_PROTOCOL_ERROR`
 - Type: http

```js
const err = new chromiumNetErrors.QuicProtocolError();
// or
const Err = chromiumNetErrors.getErrorByCode(-356);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('QUIC_PROTOCOL_ERROR');
const err = new Err();
```

### ResponseHeadersTruncatedError

> The HTTP headers were truncated by an EOF.

 - Name: `ResponseHeadersTruncatedError`
 - Code: `-357`
 - Description: `RESPONSE_HEADERS_TRUNCATED`
 - Type: http

```js
const err = new chromiumNetErrors.ResponseHeadersTruncatedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-357);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('RESPONSE_HEADERS_TRUNCATED');
const err = new Err();
```

### QuicHandshakeFailedError

> The QUIC crytpo handshake failed. This means that the server was unable
> to read any requests sent, so they may be resent.

 - Name: `QuicHandshakeFailedError`
 - Code: `-358`
 - Description: `QUIC_HANDSHAKE_FAILED`
 - Type: http

```js
const err = new chromiumNetErrors.QuicHandshakeFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-358);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('QUIC_HANDSHAKE_FAILED');
const err = new Err();
```

### Http2InadequateTransportSecurityError

> Transport security is inadequate for the HTTP/2 version.

 - Name: `Http2InadequateTransportSecurityError`
 - Code: `-360`
 - Description: `HTTP2_INADEQUATE_TRANSPORT_SECURITY`
 - Type: http

```js
const err = new chromiumNetErrors.Http2InadequateTransportSecurityError();
// or
const Err = chromiumNetErrors.getErrorByCode(-360);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HTTP2_INADEQUATE_TRANSPORT_SECURITY');
const err = new Err();
```

### Http2FlowControlError

> The peer violated HTTP/2 flow control.

 - Name: `Http2FlowControlError`
 - Code: `-361`
 - Description: `HTTP2_FLOW_CONTROL_ERROR`
 - Type: http

```js
const err = new chromiumNetErrors.Http2FlowControlError();
// or
const Err = chromiumNetErrors.getErrorByCode(-361);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HTTP2_FLOW_CONTROL_ERROR');
const err = new Err();
```

### Http2FrameSizeError

> The peer sent an improperly sized HTTP/2 frame.

 - Name: `Http2FrameSizeError`
 - Code: `-362`
 - Description: `HTTP2_FRAME_SIZE_ERROR`
 - Type: http

```js
const err = new chromiumNetErrors.Http2FrameSizeError();
// or
const Err = chromiumNetErrors.getErrorByCode(-362);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HTTP2_FRAME_SIZE_ERROR');
const err = new Err();
```

### Http2CompressionError

> Decoding or encoding of compressed HTTP/2 headers failed.

 - Name: `Http2CompressionError`
 - Code: `-363`
 - Description: `HTTP2_COMPRESSION_ERROR`
 - Type: http

```js
const err = new chromiumNetErrors.Http2CompressionError();
// or
const Err = chromiumNetErrors.getErrorByCode(-363);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HTTP2_COMPRESSION_ERROR');
const err = new Err();
```

### ProxyAuthRequestedWithNoConnectionError

> Proxy Auth Requested without a valid Client Socket Handle.

 - Name: `ProxyAuthRequestedWithNoConnectionError`
 - Code: `-364`
 - Description: `PROXY_AUTH_REQUESTED_WITH_NO_CONNECTION`
 - Type: http

```js
const err = new chromiumNetErrors.ProxyAuthRequestedWithNoConnectionError();
// or
const Err = chromiumNetErrors.getErrorByCode(-364);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PROXY_AUTH_REQUESTED_WITH_NO_CONNECTION');
const err = new Err();
```

### Http_1_1RequiredError

> HTTP_1_1_REQUIRED error code received on HTTP/2 session.

 - Name: `Http_1_1RequiredError`
 - Code: `-365`
 - Description: `HTTP_1_1_REQUIRED`
 - Type: http

```js
const err = new chromiumNetErrors.Http_1_1RequiredError();
// or
const Err = chromiumNetErrors.getErrorByCode(-365);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HTTP_1_1_REQUIRED');
const err = new Err();
```

### ProxyHttp_1_1RequiredError

> HTTP_1_1_REQUIRED error code received on HTTP/2 session to proxy.

 - Name: `ProxyHttp_1_1RequiredError`
 - Code: `-366`
 - Description: `PROXY_HTTP_1_1_REQUIRED`
 - Type: http

```js
const err = new chromiumNetErrors.ProxyHttp_1_1RequiredError();
// or
const Err = chromiumNetErrors.getErrorByCode(-366);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PROXY_HTTP_1_1_REQUIRED');
const err = new Err();
```

### PacScriptTerminatedError

> The PAC script terminated fatally and must be reloaded.

 - Name: `PacScriptTerminatedError`
 - Code: `-367`
 - Description: `PAC_SCRIPT_TERMINATED`
 - Type: http

```js
const err = new chromiumNetErrors.PacScriptTerminatedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-367);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PAC_SCRIPT_TERMINATED');
const err = new Err();
```

### InvalidHttpResponseError

> The server was expected to return an HTTP/1.x response, but did not. Rather
> than treat it as HTTP/0.9, this error is returned.

 - Name: `InvalidHttpResponseError`
 - Code: `-370`
 - Description: `INVALID_HTTP_RESPONSE`
 - Type: http

```js
const err = new chromiumNetErrors.InvalidHttpResponseError();
// or
const Err = chromiumNetErrors.getErrorByCode(-370);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('INVALID_HTTP_RESPONSE');
const err = new Err();
```

### ContentDecodingInitFailedError

> Initializing content decoding failed.

 - Name: `ContentDecodingInitFailedError`
 - Code: `-371`
 - Description: `CONTENT_DECODING_INIT_FAILED`
 - Type: http

```js
const err = new chromiumNetErrors.ContentDecodingInitFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-371);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CONTENT_DECODING_INIT_FAILED');
const err = new Err();
```

### Http2RstStreamNoErrorReceivedError

> Received HTTP/2 RST_STREAM frame with NO_ERROR error code. This error should
> be handled internally by HTTP/2 code, and should not make it above the
> SpdyStream layer.

 - Name: `Http2RstStreamNoErrorReceivedError`
 - Code: `-372`
 - Description: `HTTP2_RST_STREAM_NO_ERROR_RECEIVED`
 - Type: http

```js
const err = new chromiumNetErrors.Http2RstStreamNoErrorReceivedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-372);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HTTP2_RST_STREAM_NO_ERROR_RECEIVED');
const err = new Err();
```

### Http2PushedStreamNotAvailableError

> The pushed stream claimed by the request is no longer available.

 - Name: `Http2PushedStreamNotAvailableError`
 - Code: `-373`
 - Description: `HTTP2_PUSHED_STREAM_NOT_AVAILABLE`
 - Type: http

```js
const err = new chromiumNetErrors.Http2PushedStreamNotAvailableError();
// or
const Err = chromiumNetErrors.getErrorByCode(-373);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HTTP2_PUSHED_STREAM_NOT_AVAILABLE');
const err = new Err();
```

### Http2ClaimedPushedStreamResetByServerError

> A pushed stream was claimed and later reset by the server. When this happens,
> the request should be retried.

 - Name: `Http2ClaimedPushedStreamResetByServerError`
 - Code: `-374`
 - Description: `HTTP2_CLAIMED_PUSHED_STREAM_RESET_BY_SERVER`
 - Type: http

```js
const err = new chromiumNetErrors.Http2ClaimedPushedStreamResetByServerError();
// or
const Err = chromiumNetErrors.getErrorByCode(-374);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HTTP2_CLAIMED_PUSHED_STREAM_RESET_BY_SERVER');
const err = new Err();
```

### TooManyRetriesError

> An HTTP transaction was retried too many times due for authentication or
> invalid certificates. This may be due to a bug in the net stack that would
> otherwise infinite loop, or if the server or proxy continually requests fresh
> credentials or presents a fresh invalid certificate.

 - Name: `TooManyRetriesError`
 - Code: `-375`
 - Description: `TOO_MANY_RETRIES`
 - Type: http

```js
const err = new chromiumNetErrors.TooManyRetriesError();
// or
const Err = chromiumNetErrors.getErrorByCode(-375);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('TOO_MANY_RETRIES');
const err = new Err();
```

### Http2StreamClosedError

> Received an HTTP/2 frame on a closed stream.

 - Name: `Http2StreamClosedError`
 - Code: `-376`
 - Description: `HTTP2_STREAM_CLOSED`
 - Type: http

```js
const err = new chromiumNetErrors.Http2StreamClosedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-376);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HTTP2_STREAM_CLOSED');
const err = new Err();
```

### Http2ClientRefusedStreamError

> Client is refusing an HTTP/2 stream.

 - Name: `Http2ClientRefusedStreamError`
 - Code: `-377`
 - Description: `HTTP2_CLIENT_REFUSED_STREAM`
 - Type: http

```js
const err = new chromiumNetErrors.Http2ClientRefusedStreamError();
// or
const Err = chromiumNetErrors.getErrorByCode(-377);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HTTP2_CLIENT_REFUSED_STREAM');
const err = new Err();
```

### Http2PushedResponseDoesNotMatchError

> A pushed HTTP/2 stream was claimed by a request based on matching URL and
> request headers, but the pushed response headers do not match the request.

 - Name: `Http2PushedResponseDoesNotMatchError`
 - Code: `-378`
 - Description: `HTTP2_PUSHED_RESPONSE_DOES_NOT_MATCH`
 - Type: http

```js
const err = new chromiumNetErrors.Http2PushedResponseDoesNotMatchError();
// or
const Err = chromiumNetErrors.getErrorByCode(-378);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('HTTP2_PUSHED_RESPONSE_DOES_NOT_MATCH');
const err = new Err();
```

### CacheMissError

> The cache does not have the requested entry.

 - Name: `CacheMissError`
 - Code: `-400`
 - Description: `CACHE_MISS`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheMissError();
// or
const Err = chromiumNetErrors.getErrorByCode(-400);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CACHE_MISS');
const err = new Err();
```

### CacheReadFailureError

> Unable to read from the disk cache.

 - Name: `CacheReadFailureError`
 - Code: `-401`
 - Description: `CACHE_READ_FAILURE`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheReadFailureError();
// or
const Err = chromiumNetErrors.getErrorByCode(-401);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CACHE_READ_FAILURE');
const err = new Err();
```

### CacheWriteFailureError

> Unable to write to the disk cache.

 - Name: `CacheWriteFailureError`
 - Code: `-402`
 - Description: `CACHE_WRITE_FAILURE`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheWriteFailureError();
// or
const Err = chromiumNetErrors.getErrorByCode(-402);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CACHE_WRITE_FAILURE');
const err = new Err();
```

### CacheOperationNotSupportedError

> The operation is not supported for this entry.

 - Name: `CacheOperationNotSupportedError`
 - Code: `-403`
 - Description: `CACHE_OPERATION_NOT_SUPPORTED`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheOperationNotSupportedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-403);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CACHE_OPERATION_NOT_SUPPORTED');
const err = new Err();
```

### CacheOpenFailureError

> The disk cache is unable to open this entry.

 - Name: `CacheOpenFailureError`
 - Code: `-404`
 - Description: `CACHE_OPEN_FAILURE`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheOpenFailureError();
// or
const Err = chromiumNetErrors.getErrorByCode(-404);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CACHE_OPEN_FAILURE');
const err = new Err();
```

### CacheCreateFailureError

> The disk cache is unable to create this entry.

 - Name: `CacheCreateFailureError`
 - Code: `-405`
 - Description: `CACHE_CREATE_FAILURE`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheCreateFailureError();
// or
const Err = chromiumNetErrors.getErrorByCode(-405);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CACHE_CREATE_FAILURE');
const err = new Err();
```

### CacheRaceError

> Multiple transactions are racing to create disk cache entries. This is an
> internal error returned from the HttpCache to the HttpCacheTransaction that
> tells the transaction to restart the entry-creation logic because the state
> of the cache has changed.

 - Name: `CacheRaceError`
 - Code: `-406`
 - Description: `CACHE_RACE`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheRaceError();
// or
const Err = chromiumNetErrors.getErrorByCode(-406);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CACHE_RACE');
const err = new Err();
```

### CacheChecksumReadFailureError

> The cache was unable to read a checksum record on an entry. This can be
> returned from attempts to read from the cache. It is an internal error,
> returned by the SimpleCache backend, but not by any URLRequest methods
> or members.

 - Name: `CacheChecksumReadFailureError`
 - Code: `-407`
 - Description: `CACHE_CHECKSUM_READ_FAILURE`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheChecksumReadFailureError();
// or
const Err = chromiumNetErrors.getErrorByCode(-407);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CACHE_CHECKSUM_READ_FAILURE');
const err = new Err();
```

### CacheChecksumMismatchError

> The cache found an entry with an invalid checksum. This can be returned from
> attempts to read from the cache. It is an internal error, returned by the
> SimpleCache backend, but not by any URLRequest methods or members.

 - Name: `CacheChecksumMismatchError`
 - Code: `-408`
 - Description: `CACHE_CHECKSUM_MISMATCH`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheChecksumMismatchError();
// or
const Err = chromiumNetErrors.getErrorByCode(-408);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CACHE_CHECKSUM_MISMATCH');
const err = new Err();
```

### CacheLockTimeoutError

> Internal error code for the HTTP cache. The cache lock timeout has fired.

 - Name: `CacheLockTimeoutError`
 - Code: `-409`
 - Description: `CACHE_LOCK_TIMEOUT`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheLockTimeoutError();
// or
const Err = chromiumNetErrors.getErrorByCode(-409);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CACHE_LOCK_TIMEOUT');
const err = new Err();
```

### CacheAuthFailureAfterReadError

> Received a challenge after the transaction has read some data, and the
> credentials aren't available. There isn't a way to get them at that point.

 - Name: `CacheAuthFailureAfterReadError`
 - Code: `-410`
 - Description: `CACHE_AUTH_FAILURE_AFTER_READ`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheAuthFailureAfterReadError();
// or
const Err = chromiumNetErrors.getErrorByCode(-410);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CACHE_AUTH_FAILURE_AFTER_READ');
const err = new Err();
```

### CacheEntryNotSuitableError

> Internal not-quite error code for the HTTP cache. In-memory hints suggest
> that the cache entry would not have been useable with the transaction's
> current configuration (e.g. load flags, mode, etc.)

 - Name: `CacheEntryNotSuitableError`
 - Code: `-411`
 - Description: `CACHE_ENTRY_NOT_SUITABLE`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheEntryNotSuitableError();
// or
const Err = chromiumNetErrors.getErrorByCode(-411);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CACHE_ENTRY_NOT_SUITABLE');
const err = new Err();
```

### CacheDoomFailureError

> The disk cache is unable to doom this entry.

 - Name: `CacheDoomFailureError`
 - Code: `-412`
 - Description: `CACHE_DOOM_FAILURE`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheDoomFailureError();
// or
const Err = chromiumNetErrors.getErrorByCode(-412);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CACHE_DOOM_FAILURE');
const err = new Err();
```

### CacheOpenOrCreateFailureError

> The disk cache is unable to open or create this entry.

 - Name: `CacheOpenOrCreateFailureError`
 - Code: `-413`
 - Description: `CACHE_OPEN_OR_CREATE_FAILURE`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheOpenOrCreateFailureError();
// or
const Err = chromiumNetErrors.getErrorByCode(-413);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CACHE_OPEN_OR_CREATE_FAILURE');
const err = new Err();
```

### InsecureResponseError

> The server's response was insecure (e.g. there was a cert error).

 - Name: `InsecureResponseError`
 - Code: `-501`
 - Description: `INSECURE_RESPONSE`
 - Type: unknown

```js
const err = new chromiumNetErrors.InsecureResponseError();
// or
const Err = chromiumNetErrors.getErrorByCode(-501);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('INSECURE_RESPONSE');
const err = new Err();
```

### NoPrivateKeyForCertError

> An attempt to import a client certificate failed, as the user's key
> database lacked a corresponding private key.

 - Name: `NoPrivateKeyForCertError`
 - Code: `-502`
 - Description: `NO_PRIVATE_KEY_FOR_CERT`
 - Type: unknown

```js
const err = new chromiumNetErrors.NoPrivateKeyForCertError();
// or
const Err = chromiumNetErrors.getErrorByCode(-502);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('NO_PRIVATE_KEY_FOR_CERT');
const err = new Err();
```

### AddUserCertFailedError

> An error adding a certificate to the OS certificate database.

 - Name: `AddUserCertFailedError`
 - Code: `-503`
 - Description: `ADD_USER_CERT_FAILED`
 - Type: unknown

```js
const err = new chromiumNetErrors.AddUserCertFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-503);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('ADD_USER_CERT_FAILED');
const err = new Err();
```

### InvalidSignedExchangeError

> An error occurred while handling a signed exchange.

 - Name: `InvalidSignedExchangeError`
 - Code: `-504`
 - Description: `INVALID_SIGNED_EXCHANGE`
 - Type: unknown

```js
const err = new chromiumNetErrors.InvalidSignedExchangeError();
// or
const Err = chromiumNetErrors.getErrorByCode(-504);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('INVALID_SIGNED_EXCHANGE');
const err = new Err();
```

### FtpFailedError

> A generic error for failed FTP control connection command.
> If possible, please use or add a more specific error code.

 - Name: `FtpFailedError`
 - Code: `-601`
 - Description: `FTP_FAILED`
 - Type: ftp

```js
const err = new chromiumNetErrors.FtpFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-601);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('FTP_FAILED');
const err = new Err();
```

### FtpServiceUnavailableError

> The server cannot fulfill the request at this point. This is a temporary
> error.
> FTP response code 421.

 - Name: `FtpServiceUnavailableError`
 - Code: `-602`
 - Description: `FTP_SERVICE_UNAVAILABLE`
 - Type: ftp

```js
const err = new chromiumNetErrors.FtpServiceUnavailableError();
// or
const Err = chromiumNetErrors.getErrorByCode(-602);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('FTP_SERVICE_UNAVAILABLE');
const err = new Err();
```

### FtpTransferAbortedError

> The server has aborted the transfer.
> FTP response code 426.

 - Name: `FtpTransferAbortedError`
 - Code: `-603`
 - Description: `FTP_TRANSFER_ABORTED`
 - Type: ftp

```js
const err = new chromiumNetErrors.FtpTransferAbortedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-603);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('FTP_TRANSFER_ABORTED');
const err = new Err();
```

### FtpFileBusyError

> The file is busy, or some other temporary error condition on opening
> the file.
> FTP response code 450.

 - Name: `FtpFileBusyError`
 - Code: `-604`
 - Description: `FTP_FILE_BUSY`
 - Type: ftp

```js
const err = new chromiumNetErrors.FtpFileBusyError();
// or
const Err = chromiumNetErrors.getErrorByCode(-604);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('FTP_FILE_BUSY');
const err = new Err();
```

### FtpSyntaxError

> Server rejected our command because of syntax errors.
> FTP response codes 500, 501.

 - Name: `FtpSyntaxError`
 - Code: `-605`
 - Description: `FTP_SYNTAX_ERROR`
 - Type: ftp

```js
const err = new chromiumNetErrors.FtpSyntaxError();
// or
const Err = chromiumNetErrors.getErrorByCode(-605);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('FTP_SYNTAX_ERROR');
const err = new Err();
```

### FtpCommandNotSupportedError

> Server does not support the command we issued.
> FTP response codes 502, 504.

 - Name: `FtpCommandNotSupportedError`
 - Code: `-606`
 - Description: `FTP_COMMAND_NOT_SUPPORTED`
 - Type: ftp

```js
const err = new chromiumNetErrors.FtpCommandNotSupportedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-606);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('FTP_COMMAND_NOT_SUPPORTED');
const err = new Err();
```

### FtpBadCommandSequenceError

> Server rejected our command because we didn't issue the commands in right
> order.
> FTP response code 503.

 - Name: `FtpBadCommandSequenceError`
 - Code: `-607`
 - Description: `FTP_BAD_COMMAND_SEQUENCE`
 - Type: ftp

```js
const err = new chromiumNetErrors.FtpBadCommandSequenceError();
// or
const Err = chromiumNetErrors.getErrorByCode(-607);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('FTP_BAD_COMMAND_SEQUENCE');
const err = new Err();
```

### Pkcs12ImportBadPasswordError

> PKCS #12 import failed due to incorrect password.

 - Name: `Pkcs12ImportBadPasswordError`
 - Code: `-701`
 - Description: `PKCS12_IMPORT_BAD_PASSWORD`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.Pkcs12ImportBadPasswordError();
// or
const Err = chromiumNetErrors.getErrorByCode(-701);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PKCS12_IMPORT_BAD_PASSWORD');
const err = new Err();
```

### Pkcs12ImportFailedError

> PKCS #12 import failed due to other error.

 - Name: `Pkcs12ImportFailedError`
 - Code: `-702`
 - Description: `PKCS12_IMPORT_FAILED`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.Pkcs12ImportFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-702);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PKCS12_IMPORT_FAILED');
const err = new Err();
```

### ImportCaCertNotCaError

> CA import failed - not a CA cert.

 - Name: `ImportCaCertNotCaError`
 - Code: `-703`
 - Description: `IMPORT_CA_CERT_NOT_CA`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.ImportCaCertNotCaError();
// or
const Err = chromiumNetErrors.getErrorByCode(-703);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('IMPORT_CA_CERT_NOT_CA');
const err = new Err();
```

### ImportCertAlreadyExistsError

> Import failed - certificate already exists in database.
> Note it's a little weird this is an error but reimporting a PKCS12 is ok
> (no-op). That's how Mozilla does it, though.

 - Name: `ImportCertAlreadyExistsError`
 - Code: `-704`
 - Description: `IMPORT_CERT_ALREADY_EXISTS`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.ImportCertAlreadyExistsError();
// or
const Err = chromiumNetErrors.getErrorByCode(-704);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('IMPORT_CERT_ALREADY_EXISTS');
const err = new Err();
```

### ImportCaCertFailedError

> CA import failed due to some other error.

 - Name: `ImportCaCertFailedError`
 - Code: `-705`
 - Description: `IMPORT_CA_CERT_FAILED`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.ImportCaCertFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-705);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('IMPORT_CA_CERT_FAILED');
const err = new Err();
```

### ImportServerCertFailedError

> Server certificate import failed due to some internal error.

 - Name: `ImportServerCertFailedError`
 - Code: `-706`
 - Description: `IMPORT_SERVER_CERT_FAILED`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.ImportServerCertFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-706);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('IMPORT_SERVER_CERT_FAILED');
const err = new Err();
```

### Pkcs12ImportInvalidMacError

> PKCS #12 import failed due to invalid MAC.

 - Name: `Pkcs12ImportInvalidMacError`
 - Code: `-707`
 - Description: `PKCS12_IMPORT_INVALID_MAC`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.Pkcs12ImportInvalidMacError();
// or
const Err = chromiumNetErrors.getErrorByCode(-707);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PKCS12_IMPORT_INVALID_MAC');
const err = new Err();
```

### Pkcs12ImportInvalidFileError

> PKCS #12 import failed due to invalid/corrupt file.

 - Name: `Pkcs12ImportInvalidFileError`
 - Code: `-708`
 - Description: `PKCS12_IMPORT_INVALID_FILE`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.Pkcs12ImportInvalidFileError();
// or
const Err = chromiumNetErrors.getErrorByCode(-708);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PKCS12_IMPORT_INVALID_FILE');
const err = new Err();
```

### Pkcs12ImportUnsupportedError

> PKCS #12 import failed due to unsupported features.

 - Name: `Pkcs12ImportUnsupportedError`
 - Code: `-709`
 - Description: `PKCS12_IMPORT_UNSUPPORTED`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.Pkcs12ImportUnsupportedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-709);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PKCS12_IMPORT_UNSUPPORTED');
const err = new Err();
```

### KeyGenerationFailedError

> Key generation failed.

 - Name: `KeyGenerationFailedError`
 - Code: `-710`
 - Description: `KEY_GENERATION_FAILED`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.KeyGenerationFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-710);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('KEY_GENERATION_FAILED');
const err = new Err();
```

### PrivateKeyExportFailedError

> Failure to export private key.

 - Name: `PrivateKeyExportFailedError`
 - Code: `-712`
 - Description: `PRIVATE_KEY_EXPORT_FAILED`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.PrivateKeyExportFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-712);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('PRIVATE_KEY_EXPORT_FAILED');
const err = new Err();
```

### SelfSignedCertGenerationFailedError

> Self-signed certificate generation failed.

 - Name: `SelfSignedCertGenerationFailedError`
 - Code: `-713`
 - Description: `SELF_SIGNED_CERT_GENERATION_FAILED`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.SelfSignedCertGenerationFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-713);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('SELF_SIGNED_CERT_GENERATION_FAILED');
const err = new Err();
```

### CertDatabaseChangedError

> The certificate database changed in some way.

 - Name: `CertDatabaseChangedError`
 - Code: `-714`
 - Description: `CERT_DATABASE_CHANGED`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.CertDatabaseChangedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-714);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('CERT_DATABASE_CHANGED');
const err = new Err();
```

### DnsMalformedResponseError

> DNS resolver received a malformed response.

 - Name: `DnsMalformedResponseError`
 - Code: `-800`
 - Description: `DNS_MALFORMED_RESPONSE`
 - Type: dns

```js
const err = new chromiumNetErrors.DnsMalformedResponseError();
// or
const Err = chromiumNetErrors.getErrorByCode(-800);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('DNS_MALFORMED_RESPONSE');
const err = new Err();
```

### DnsServerRequiresTcpError

> DNS server requires TCP

 - Name: `DnsServerRequiresTcpError`
 - Code: `-801`
 - Description: `DNS_SERVER_REQUIRES_TCP`
 - Type: dns

```js
const err = new chromiumNetErrors.DnsServerRequiresTcpError();
// or
const Err = chromiumNetErrors.getErrorByCode(-801);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('DNS_SERVER_REQUIRES_TCP');
const err = new Err();
```

### DnsServerFailedError

> DNS server failed. This error is returned for all of the following
> error conditions:
> 1 - Format error - The name server was unable to interpret the query.
> 2 - Server failure - The name server was unable to process this query
> due to a problem with the name server.
> 4 - Not Implemented - The name server does not support the requested
> kind of query.
> 5 - Refused - The name server refuses to perform the specified
> operation for policy reasons.

 - Name: `DnsServerFailedError`
 - Code: `-802`
 - Description: `DNS_SERVER_FAILED`
 - Type: dns

```js
const err = new chromiumNetErrors.DnsServerFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-802);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('DNS_SERVER_FAILED');
const err = new Err();
```

### DnsTimedOutError

> DNS transaction timed out.

 - Name: `DnsTimedOutError`
 - Code: `-803`
 - Description: `DNS_TIMED_OUT`
 - Type: dns

```js
const err = new chromiumNetErrors.DnsTimedOutError();
// or
const Err = chromiumNetErrors.getErrorByCode(-803);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('DNS_TIMED_OUT');
const err = new Err();
```

### DnsCacheMissError

> The entry was not found in cache or other local sources, for lookups where
> only local sources were queried.
> TODO(ericorth): Consider renaming to DNS_LOCAL_MISS or something like that as
> the cache is not necessarily queried either.

 - Name: `DnsCacheMissError`
 - Code: `-804`
 - Description: `DNS_CACHE_MISS`
 - Type: dns

```js
const err = new chromiumNetErrors.DnsCacheMissError();
// or
const Err = chromiumNetErrors.getErrorByCode(-804);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('DNS_CACHE_MISS');
const err = new Err();
```

### DnsSearchEmptyError

> Suffix search list rules prevent resolution of the given host name.

 - Name: `DnsSearchEmptyError`
 - Code: `-805`
 - Description: `DNS_SEARCH_EMPTY`
 - Type: dns

```js
const err = new chromiumNetErrors.DnsSearchEmptyError();
// or
const Err = chromiumNetErrors.getErrorByCode(-805);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('DNS_SEARCH_EMPTY');
const err = new Err();
```

### DnsSortError

> Failed to sort addresses according to RFC3484.

 - Name: `DnsSortError`
 - Code: `-806`
 - Description: `DNS_SORT_ERROR`
 - Type: dns

```js
const err = new chromiumNetErrors.DnsSortError();
// or
const Err = chromiumNetErrors.getErrorByCode(-806);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('DNS_SORT_ERROR');
const err = new Err();
```

### DnsHttpFailedError

> Failed to resolve over HTTP, fallback to legacy

 - Name: `DnsHttpFailedError`
 - Code: `-807`
 - Description: `DNS_HTTP_FAILED`
 - Type: dns

```js
const err = new chromiumNetErrors.DnsHttpFailedError();
// or
const Err = chromiumNetErrors.getErrorByCode(-807);
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('DNS_HTTP_FAILED');
const err = new Err();
```

<!--END_ERROR_LIST-->

## License

Copyright (c) 2015 - 2019 Max Kueng and contributors

MIT License
