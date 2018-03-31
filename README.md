Chromium Network Errors
=======================

[![Build Status](https://secure.travis-ci.org/maxkueng/chromium-net-errors.png?branch=master)](http://travis-ci.org/maxkueng/chromium-net-errors)
[![codebeat badge](https://codebeat.co/badges/b022cc1d-3ec0-4f9d-bc7d-45168ec12e08)](https://codebeat.co/projects/github-com-maxkueng-chromium-net-errors-master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/bdec0faf360447f39cdcc70d9d0750d3)](https://www.codacy.com/app/maxkueng/chromium-net-errors?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=maxkueng/chromium-net-errors&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/df86c1d3fa5b248aaaa6/maintainability)](https://codeclimate.com/github/maxkueng/chromium-net-errors/maintainability)
[![Coverage Status](https://coveralls.io/repos/maxkueng/chromium-net-errors/badge.svg?branch=master&service=github)](https://coveralls.io/github/maxkueng/chromium-net-errors?branch=master)

Provides Chromium network errors found in
[net_error_list.h](https://cs.chromium.org/codesearch/f/chromium/src/net/base/net_error_list.h)
as custom error classes that can be conveniently Node.js and Electron apps. It
can be used in browsers too.  
They correspond to the error codes that are provided in 
[Electron's `did-fail-load` event](https://github.com/electron/electron/blob/master/docs/api/web-contents.md#event-did-fail-load).

[Features](#features) |
[Installation](#installation) |
[Electron Example](#example-use-in-electron) |
[Usage](#usage) |
[List of Errors](#list-of-errors) |
[License](#license)

## Features

 - No dependencies.
 - 100% test coverage.
 - ES6 build with `import` and `export` to allow better dead code elimination
   if you use a bundler that supports it.
 - Daily checks for updates on net_error_list.h on [Travis CI](https://travis-ci.org/maxkueng/chromium-net-errors)

## Installation

```sh
npm install chromium-net-errors --save
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

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    try {
      const Err = chromiumNetErrors.getErrorByCode(errorCode);
      throw new Err();
    } catch (err) {
      if (err instanceof chromiumNetErrors.NameNotResolvedError) {
        console.error(`The name '${validatedURL}' could not be resolved:\n  ${err.message}`);
      } else {
        console.error(`Something went wrong while loading ${validatedURL}`);
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
// The server responded with a certificate that is signed by an authority
// we don't trust.  The could mean:
//
// 1. An attacker has substituted the real certificate for a cert that
//    contains his public key and is signed by his cousin.
//
// 2. The server operator has a legitimate certificate from a CA we don't
//    know about, but should trust.
//
// 3. The server is presenting a self-signed certificate, providing no
//    defense against active attackers (but foiling passive attackers).
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
// The server responded with a certificate that is signed by an authority
// we don't trust.  The could mean:
//
// 1. An attacker has substituted the real certificate for a cert that
//    contains his public key and is signed by his cousin.
//
// 2. The server operator has a legitimate certificate from a CA we don't
//    know about, but should trust.
//
// 3. The server is presenting a self-signed certificate, providing no
//    defense against active attackers (but foiling passive attackers).
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
const err = new chromiumNetErrors.IoPendingError()
```

### FailedError

> A generic failure occurred.

 - Name: `FailedError`
 - Code: `-2`
 - Description: `FAILED`
 - Type: system

```js
const err = new chromiumNetErrors.FailedError()
```

### AbortedError

> An operation was aborted (due to user action).

 - Name: `AbortedError`
 - Code: `-3`
 - Description: `ABORTED`
 - Type: system

```js
const err = new chromiumNetErrors.AbortedError()
```

### InvalidArgumentError

> An argument to the function is incorrect.

 - Name: `InvalidArgumentError`
 - Code: `-4`
 - Description: `INVALID_ARGUMENT`
 - Type: system

```js
const err = new chromiumNetErrors.InvalidArgumentError()
```

### InvalidHandleError

> The handle or file descriptor is invalid.

 - Name: `InvalidHandleError`
 - Code: `-5`
 - Description: `INVALID_HANDLE`
 - Type: system

```js
const err = new chromiumNetErrors.InvalidHandleError()
```

### FileNotFoundError

> The file or directory cannot be found.

 - Name: `FileNotFoundError`
 - Code: `-6`
 - Description: `FILE_NOT_FOUND`
 - Type: system

```js
const err = new chromiumNetErrors.FileNotFoundError()
```

### TimedOutError

> An operation timed out.

 - Name: `TimedOutError`
 - Code: `-7`
 - Description: `TIMED_OUT`
 - Type: system

```js
const err = new chromiumNetErrors.TimedOutError()
```

### FileTooBigError

> The file is too large.

 - Name: `FileTooBigError`
 - Code: `-8`
 - Description: `FILE_TOO_BIG`
 - Type: system

```js
const err = new chromiumNetErrors.FileTooBigError()
```

### UnexpectedError

> An unexpected error. This may be caused by a programming mistake or an
> invalid assumption.

 - Name: `UnexpectedError`
 - Code: `-9`
 - Description: `UNEXPECTED`
 - Type: system

```js
const err = new chromiumNetErrors.UnexpectedError()
```

### AccessDeniedError

> Permission to access a resource, other than the network, was denied.

 - Name: `AccessDeniedError`
 - Code: `-10`
 - Description: `ACCESS_DENIED`
 - Type: system

```js
const err = new chromiumNetErrors.AccessDeniedError()
```

### NotImplementedError

> The operation failed because of unimplemented functionality.

 - Name: `NotImplementedError`
 - Code: `-11`
 - Description: `NOT_IMPLEMENTED`
 - Type: system

```js
const err = new chromiumNetErrors.NotImplementedError()
```

### InsufficientResourcesError

> There were not enough resources to complete the operation.

 - Name: `InsufficientResourcesError`
 - Code: `-12`
 - Description: `INSUFFICIENT_RESOURCES`
 - Type: system

```js
const err = new chromiumNetErrors.InsufficientResourcesError()
```

### OutOfMemoryError

> Memory allocation failed.

 - Name: `OutOfMemoryError`
 - Code: `-13`
 - Description: `OUT_OF_MEMORY`
 - Type: system

```js
const err = new chromiumNetErrors.OutOfMemoryError()
```

### UploadFileChangedError

> The file upload failed because the file's modification time was different
> from the expectation.

 - Name: `UploadFileChangedError`
 - Code: `-14`
 - Description: `UPLOAD_FILE_CHANGED`
 - Type: system

```js
const err = new chromiumNetErrors.UploadFileChangedError()
```

### SocketNotConnectedError

> The socket is not connected.

 - Name: `SocketNotConnectedError`
 - Code: `-15`
 - Description: `SOCKET_NOT_CONNECTED`
 - Type: system

```js
const err = new chromiumNetErrors.SocketNotConnectedError()
```

### FileExistsError

> The file already exists.

 - Name: `FileExistsError`
 - Code: `-16`
 - Description: `FILE_EXISTS`
 - Type: system

```js
const err = new chromiumNetErrors.FileExistsError()
```

### FilePathTooLongError

> The path or file name is too long.

 - Name: `FilePathTooLongError`
 - Code: `-17`
 - Description: `FILE_PATH_TOO_LONG`
 - Type: system

```js
const err = new chromiumNetErrors.FilePathTooLongError()
```

### FileNoSpaceError

> Not enough room left on the disk.

 - Name: `FileNoSpaceError`
 - Code: `-18`
 - Description: `FILE_NO_SPACE`
 - Type: system

```js
const err = new chromiumNetErrors.FileNoSpaceError()
```

### FileVirusInfectedError

> The file has a virus.

 - Name: `FileVirusInfectedError`
 - Code: `-19`
 - Description: `FILE_VIRUS_INFECTED`
 - Type: system

```js
const err = new chromiumNetErrors.FileVirusInfectedError()
```

### BlockedByClientError

> The client chose to block the request.

 - Name: `BlockedByClientError`
 - Code: `-20`
 - Description: `BLOCKED_BY_CLIENT`
 - Type: system

```js
const err = new chromiumNetErrors.BlockedByClientError()
```

### NetworkChangedError

> The network changed.

 - Name: `NetworkChangedError`
 - Code: `-21`
 - Description: `NETWORK_CHANGED`
 - Type: system

```js
const err = new chromiumNetErrors.NetworkChangedError()
```

### BlockedByAdministratorError

> The request was blocked by the URL blacklist configured by the domain
> administrator.

 - Name: `BlockedByAdministratorError`
 - Code: `-22`
 - Description: `BLOCKED_BY_ADMINISTRATOR`
 - Type: system

```js
const err = new chromiumNetErrors.BlockedByAdministratorError()
```

### SocketIsConnectedError

> The socket is already connected.

 - Name: `SocketIsConnectedError`
 - Code: `-23`
 - Description: `SOCKET_IS_CONNECTED`
 - Type: system

```js
const err = new chromiumNetErrors.SocketIsConnectedError()
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
const err = new chromiumNetErrors.BlockedEnrollmentCheckPendingError()
```

### UploadStreamRewindNotSupportedError

> The upload failed because the upload stream needed to be re-read, due to a
> retry or a redirect, but the upload stream doesn't support that operation.

 - Name: `UploadStreamRewindNotSupportedError`
 - Code: `-25`
 - Description: `UPLOAD_STREAM_REWIND_NOT_SUPPORTED`
 - Type: system

```js
const err = new chromiumNetErrors.UploadStreamRewindNotSupportedError()
```

### ContextShutDownError

> The request failed because the URLRequestContext is shutting down, or has
> been shut down.

 - Name: `ContextShutDownError`
 - Code: `-26`
 - Description: `CONTEXT_SHUT_DOWN`
 - Type: system

```js
const err = new chromiumNetErrors.ContextShutDownError()
```

### BlockedByResponseError

> The request failed because the response was delivered along with requirements
> which are not met ('X-Frame-Options' and 'Content-Security-Policy' ancestor
> checks, for instance).

 - Name: `BlockedByResponseError`
 - Code: `-27`
 - Description: `BLOCKED_BY_RESPONSE`
 - Type: system

```js
const err = new chromiumNetErrors.BlockedByResponseError()
```

### BlockedByXssAuditorError

> The request failed after the response was received, based on client-side
> heuristics that point to the possiblility of a cross-site scripting attack.

 - Name: `BlockedByXssAuditorError`
 - Code: `-28`
 - Description: `BLOCKED_BY_XSS_AUDITOR`
 - Type: system

```js
const err = new chromiumNetErrors.BlockedByXssAuditorError()
```

### CleartextNotPermittedError

> The request was blocked by system policy disallowing some or all cleartext
> requests. Used for NetworkSecurityPolicy on Android.

 - Name: `CleartextNotPermittedError`
 - Code: `-29`
 - Description: `CLEARTEXT_NOT_PERMITTED`
 - Type: system

```js
const err = new chromiumNetErrors.CleartextNotPermittedError()
```

### ConnectionClosedError

> A connection was closed (corresponding to a TCP FIN).

 - Name: `ConnectionClosedError`
 - Code: `-100`
 - Description: `CONNECTION_CLOSED`
 - Type: connection

```js
const err = new chromiumNetErrors.ConnectionClosedError()
```

### ConnectionResetError

> A connection was reset (corresponding to a TCP RST).

 - Name: `ConnectionResetError`
 - Code: `-101`
 - Description: `CONNECTION_RESET`
 - Type: connection

```js
const err = new chromiumNetErrors.ConnectionResetError()
```

### ConnectionRefusedError

> A connection attempt was refused.

 - Name: `ConnectionRefusedError`
 - Code: `-102`
 - Description: `CONNECTION_REFUSED`
 - Type: connection

```js
const err = new chromiumNetErrors.ConnectionRefusedError()
```

### ConnectionAbortedError

> A connection timed out as a result of not receiving an ACK for data sent.
> This can include a FIN packet that did not get ACK'd.

 - Name: `ConnectionAbortedError`
 - Code: `-103`
 - Description: `CONNECTION_ABORTED`
 - Type: connection

```js
const err = new chromiumNetErrors.ConnectionAbortedError()
```

### ConnectionFailedError

> A connection attempt failed.

 - Name: `ConnectionFailedError`
 - Code: `-104`
 - Description: `CONNECTION_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.ConnectionFailedError()
```

### NameNotResolvedError

> The host name could not be resolved.

 - Name: `NameNotResolvedError`
 - Code: `-105`
 - Description: `NAME_NOT_RESOLVED`
 - Type: connection

```js
const err = new chromiumNetErrors.NameNotResolvedError()
```

### InternetDisconnectedError

> The Internet connection has been lost.

 - Name: `InternetDisconnectedError`
 - Code: `-106`
 - Description: `INTERNET_DISCONNECTED`
 - Type: connection

```js
const err = new chromiumNetErrors.InternetDisconnectedError()
```

### SslProtocolError

> An SSL protocol error occurred.

 - Name: `SslProtocolError`
 - Code: `-107`
 - Description: `SSL_PROTOCOL_ERROR`
 - Type: connection

```js
const err = new chromiumNetErrors.SslProtocolError()
```

### AddressInvalidError

> The IP address or port number is invalid (e.g., cannot connect to the IP
> address 0 or the port 0).

 - Name: `AddressInvalidError`
 - Code: `-108`
 - Description: `ADDRESS_INVALID`
 - Type: connection

```js
const err = new chromiumNetErrors.AddressInvalidError()
```

### AddressUnreachableError

> The IP address is unreachable. This usually means that there is no route to
> the specified host or network.

 - Name: `AddressUnreachableError`
 - Code: `-109`
 - Description: `ADDRESS_UNREACHABLE`
 - Type: connection

```js
const err = new chromiumNetErrors.AddressUnreachableError()
```

### SslClientAuthCertNeededError

> The server requested a client certificate for SSL client authentication.

 - Name: `SslClientAuthCertNeededError`
 - Code: `-110`
 - Description: `SSL_CLIENT_AUTH_CERT_NEEDED`
 - Type: connection

```js
const err = new chromiumNetErrors.SslClientAuthCertNeededError()
```

### TunnelConnectionFailedError

> A tunnel connection through the proxy could not be established.

 - Name: `TunnelConnectionFailedError`
 - Code: `-111`
 - Description: `TUNNEL_CONNECTION_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.TunnelConnectionFailedError()
```

### NoSslVersionsEnabledError

> No SSL protocol versions are enabled.

 - Name: `NoSslVersionsEnabledError`
 - Code: `-112`
 - Description: `NO_SSL_VERSIONS_ENABLED`
 - Type: connection

```js
const err = new chromiumNetErrors.NoSslVersionsEnabledError()
```

### SslVersionOrCipherMismatchError

> The client and server don't support a common SSL protocol version or
> cipher suite.

 - Name: `SslVersionOrCipherMismatchError`
 - Code: `-113`
 - Description: `SSL_VERSION_OR_CIPHER_MISMATCH`
 - Type: connection

```js
const err = new chromiumNetErrors.SslVersionOrCipherMismatchError()
```

### SslRenegotiationRequestedError

> The server requested a renegotiation (rehandshake).

 - Name: `SslRenegotiationRequestedError`
 - Code: `-114`
 - Description: `SSL_RENEGOTIATION_REQUESTED`
 - Type: connection

```js
const err = new chromiumNetErrors.SslRenegotiationRequestedError()
```

### ProxyAuthUnsupportedError

> The proxy requested authentication (for tunnel establishment) with an
> unsupported method.

 - Name: `ProxyAuthUnsupportedError`
 - Code: `-115`
 - Description: `PROXY_AUTH_UNSUPPORTED`
 - Type: connection

```js
const err = new chromiumNetErrors.ProxyAuthUnsupportedError()
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
const err = new chromiumNetErrors.CertErrorInSslRenegotiationError()
```

### BadSslClientAuthCertError

> The SSL handshake failed because of a bad or missing client certificate.

 - Name: `BadSslClientAuthCertError`
 - Code: `-117`
 - Description: `BAD_SSL_CLIENT_AUTH_CERT`
 - Type: connection

```js
const err = new chromiumNetErrors.BadSslClientAuthCertError()
```

### ConnectionTimedOutError

> A connection attempt timed out.

 - Name: `ConnectionTimedOutError`
 - Code: `-118`
 - Description: `CONNECTION_TIMED_OUT`
 - Type: connection

```js
const err = new chromiumNetErrors.ConnectionTimedOutError()
```

### HostResolverQueueTooLargeError

> There are too many pending DNS resolves, so a request in the queue was
> aborted.

 - Name: `HostResolverQueueTooLargeError`
 - Code: `-119`
 - Description: `HOST_RESOLVER_QUEUE_TOO_LARGE`
 - Type: connection

```js
const err = new chromiumNetErrors.HostResolverQueueTooLargeError()
```

### SocksConnectionFailedError

> Failed establishing a connection to the SOCKS proxy server for a target host.

 - Name: `SocksConnectionFailedError`
 - Code: `-120`
 - Description: `SOCKS_CONNECTION_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.SocksConnectionFailedError()
```

### SocksConnectionHostUnreachableError

> The SOCKS proxy server failed establishing connection to the target host
> because that host is unreachable.

 - Name: `SocksConnectionHostUnreachableError`
 - Code: `-121`
 - Description: `SOCKS_CONNECTION_HOST_UNREACHABLE`
 - Type: connection

```js
const err = new chromiumNetErrors.SocksConnectionHostUnreachableError()
```

### AlpnNegotiationFailedError

> The request to negotiate an alternate protocol failed.

 - Name: `AlpnNegotiationFailedError`
 - Code: `-122`
 - Description: `ALPN_NEGOTIATION_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.AlpnNegotiationFailedError()
```

### SslNoRenegotiationError

> The peer sent an SSL no_renegotiation alert message.

 - Name: `SslNoRenegotiationError`
 - Code: `-123`
 - Description: `SSL_NO_RENEGOTIATION`
 - Type: connection

```js
const err = new chromiumNetErrors.SslNoRenegotiationError()
```

### WinsockUnexpectedWrittenBytesError

> Winsock sometimes reports more data written than passed. This is probably
> due to a broken LSP.

 - Name: `WinsockUnexpectedWrittenBytesError`
 - Code: `-124`
 - Description: `WINSOCK_UNEXPECTED_WRITTEN_BYTES`
 - Type: connection

```js
const err = new chromiumNetErrors.WinsockUnexpectedWrittenBytesError()
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
const err = new chromiumNetErrors.SslDecompressionFailureAlertError()
```

### SslBadRecordMacAlertError

> An SSL peer sent us a fatal bad_record_mac alert. This has been observed
> from servers with buggy DEFLATE support.

 - Name: `SslBadRecordMacAlertError`
 - Code: `-126`
 - Description: `SSL_BAD_RECORD_MAC_ALERT`
 - Type: connection

```js
const err = new chromiumNetErrors.SslBadRecordMacAlertError()
```

### ProxyAuthRequestedError

> The proxy requested authentication (for tunnel establishment).

 - Name: `ProxyAuthRequestedError`
 - Code: `-127`
 - Description: `PROXY_AUTH_REQUESTED`
 - Type: connection

```js
const err = new chromiumNetErrors.ProxyAuthRequestedError()
```

### SslWeakServerEphemeralDhKeyError

> The SSL server attempted to use a weak ephemeral Diffie-Hellman key.

 - Name: `SslWeakServerEphemeralDhKeyError`
 - Code: `-129`
 - Description: `SSL_WEAK_SERVER_EPHEMERAL_DH_KEY`
 - Type: connection

```js
const err = new chromiumNetErrors.SslWeakServerEphemeralDhKeyError()
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
const err = new chromiumNetErrors.ProxyConnectionFailedError()
```

### MandatoryProxyConfigurationFailedError

> A mandatory proxy configuration could not be used. Currently this means
> that a mandatory PAC script could not be fetched, parsed or executed.

 - Name: `MandatoryProxyConfigurationFailedError`
 - Code: `-131`
 - Description: `MANDATORY_PROXY_CONFIGURATION_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.MandatoryProxyConfigurationFailedError()
```

### PreconnectMaxSocketLimitError

> We've hit the max socket limit for the socket pool while preconnecting. We
> don't bother trying to preconnect more sockets.

 - Name: `PreconnectMaxSocketLimitError`
 - Code: `-133`
 - Description: `PRECONNECT_MAX_SOCKET_LIMIT`
 - Type: connection

```js
const err = new chromiumNetErrors.PreconnectMaxSocketLimitError()
```

### SslClientAuthPrivateKeyAccessDeniedError

> The permission to use the SSL client certificate's private key was denied.

 - Name: `SslClientAuthPrivateKeyAccessDeniedError`
 - Code: `-134`
 - Description: `SSL_CLIENT_AUTH_PRIVATE_KEY_ACCESS_DENIED`
 - Type: connection

```js
const err = new chromiumNetErrors.SslClientAuthPrivateKeyAccessDeniedError()
```

### SslClientAuthCertNoPrivateKeyError

> The SSL client certificate has no private key.

 - Name: `SslClientAuthCertNoPrivateKeyError`
 - Code: `-135`
 - Description: `SSL_CLIENT_AUTH_CERT_NO_PRIVATE_KEY`
 - Type: connection

```js
const err = new chromiumNetErrors.SslClientAuthCertNoPrivateKeyError()
```

### ProxyCertificateInvalidError

> The certificate presented by the HTTPS Proxy was invalid.

 - Name: `ProxyCertificateInvalidError`
 - Code: `-136`
 - Description: `PROXY_CERTIFICATE_INVALID`
 - Type: connection

```js
const err = new chromiumNetErrors.ProxyCertificateInvalidError()
```

### NameResolutionFailedError

> An error occurred when trying to do a name resolution (DNS).

 - Name: `NameResolutionFailedError`
 - Code: `-137`
 - Description: `NAME_RESOLUTION_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.NameResolutionFailedError()
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
const err = new chromiumNetErrors.NetworkAccessDeniedError()
```

### TemporarilyThrottledError

> The request throttler module cancelled this request to avoid DDOS.

 - Name: `TemporarilyThrottledError`
 - Code: `-139`
 - Description: `TEMPORARILY_THROTTLED`
 - Type: connection

```js
const err = new chromiumNetErrors.TemporarilyThrottledError()
```

### HttpsProxyTunnelResponseError

> A request to create an SSL tunnel connection through the HTTPS proxy
> received a non-200 (OK) and non-407 (Proxy Auth) response. The response
> body might include a description of why the request failed.

 - Name: `HttpsProxyTunnelResponseError`
 - Code: `-140`
 - Description: `HTTPS_PROXY_TUNNEL_RESPONSE`
 - Type: connection

```js
const err = new chromiumNetErrors.HttpsProxyTunnelResponseError()
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
const err = new chromiumNetErrors.SslClientAuthSignatureFailedError()
```

### MsgTooBigError

> The message was too large for the transport. (for example a UDP message
> which exceeds size threshold).

 - Name: `MsgTooBigError`
 - Code: `-142`
 - Description: `MSG_TOO_BIG`
 - Type: connection

```js
const err = new chromiumNetErrors.MsgTooBigError()
```

### SpdySessionAlreadyExistsError

> A SPDY session already exists, and should be used instead of this connection.

 - Name: `SpdySessionAlreadyExistsError`
 - Code: `-143`
 - Description: `SPDY_SESSION_ALREADY_EXISTS`
 - Type: connection

```js
const err = new chromiumNetErrors.SpdySessionAlreadyExistsError()
```

### WsProtocolError

> Websocket protocol error. Indicates that we are terminating the connection
> due to a malformed frame or other protocol violation.

 - Name: `WsProtocolError`
 - Code: `-145`
 - Description: `WS_PROTOCOL_ERROR`
 - Type: connection

```js
const err = new chromiumNetErrors.WsProtocolError()
```

### AddressInUseError

> Returned when attempting to bind an address that is already in use.

 - Name: `AddressInUseError`
 - Code: `-147`
 - Description: `ADDRESS_IN_USE`
 - Type: connection

```js
const err = new chromiumNetErrors.AddressInUseError()
```

### SslHandshakeNotCompletedError

> An operation failed because the SSL handshake has not completed.

 - Name: `SslHandshakeNotCompletedError`
 - Code: `-148`
 - Description: `SSL_HANDSHAKE_NOT_COMPLETED`
 - Type: connection

```js
const err = new chromiumNetErrors.SslHandshakeNotCompletedError()
```

### SslBadPeerPublicKeyError

> SSL peer's public key is invalid.

 - Name: `SslBadPeerPublicKeyError`
 - Code: `-149`
 - Description: `SSL_BAD_PEER_PUBLIC_KEY`
 - Type: connection

```js
const err = new chromiumNetErrors.SslBadPeerPublicKeyError()
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
const err = new chromiumNetErrors.SslPinnedKeyNotInCertChainError()
```

### ClientAuthCertTypeUnsupportedError

> Server request for client certificate did not contain any types we support.

 - Name: `ClientAuthCertTypeUnsupportedError`
 - Code: `-151`
 - Description: `CLIENT_AUTH_CERT_TYPE_UNSUPPORTED`
 - Type: connection

```js
const err = new chromiumNetErrors.ClientAuthCertTypeUnsupportedError()
```

### OriginBoundCertGenerationTypeMismatchError

> Server requested one type of cert, then requested a different type while the
> first was still being generated.

 - Name: `OriginBoundCertGenerationTypeMismatchError`
 - Code: `-152`
 - Description: `ORIGIN_BOUND_CERT_GENERATION_TYPE_MISMATCH`
 - Type: connection

```js
const err = new chromiumNetErrors.OriginBoundCertGenerationTypeMismatchError()
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
const err = new chromiumNetErrors.SslDecryptErrorAlertError()
```

### WsThrottleQueueTooLargeError

> There are too many pending WebSocketJob instances, so the new job was not
> pushed to the queue.

 - Name: `WsThrottleQueueTooLargeError`
 - Code: `-154`
 - Description: `WS_THROTTLE_QUEUE_TOO_LARGE`
 - Type: connection

```js
const err = new chromiumNetErrors.WsThrottleQueueTooLargeError()
```

### SslServerCertChangedError

> The SSL server certificate changed in a renegotiation.

 - Name: `SslServerCertChangedError`
 - Code: `-156`
 - Description: `SSL_SERVER_CERT_CHANGED`
 - Type: connection

```js
const err = new chromiumNetErrors.SslServerCertChangedError()
```

### SslUnrecognizedNameAlertError

> The SSL server sent us a fatal unrecognized_name alert.

 - Name: `SslUnrecognizedNameAlertError`
 - Code: `-159`
 - Description: `SSL_UNRECOGNIZED_NAME_ALERT`
 - Type: connection

```js
const err = new chromiumNetErrors.SslUnrecognizedNameAlertError()
```

### SocketSetReceiveBufferSizeError

> Failed to set the socket's receive buffer size as requested.

 - Name: `SocketSetReceiveBufferSizeError`
 - Code: `-160`
 - Description: `SOCKET_SET_RECEIVE_BUFFER_SIZE_ERROR`
 - Type: connection

```js
const err = new chromiumNetErrors.SocketSetReceiveBufferSizeError()
```

### SocketSetSendBufferSizeError

> Failed to set the socket's send buffer size as requested.

 - Name: `SocketSetSendBufferSizeError`
 - Code: `-161`
 - Description: `SOCKET_SET_SEND_BUFFER_SIZE_ERROR`
 - Type: connection

```js
const err = new chromiumNetErrors.SocketSetSendBufferSizeError()
```

### SocketReceiveBufferSizeUnchangeableError

> Failed to set the socket's receive buffer size as requested, despite success
> return code from setsockopt.

 - Name: `SocketReceiveBufferSizeUnchangeableError`
 - Code: `-162`
 - Description: `SOCKET_RECEIVE_BUFFER_SIZE_UNCHANGEABLE`
 - Type: connection

```js
const err = new chromiumNetErrors.SocketReceiveBufferSizeUnchangeableError()
```

### SocketSendBufferSizeUnchangeableError

> Failed to set the socket's send buffer size as requested, despite success
> return code from setsockopt.

 - Name: `SocketSendBufferSizeUnchangeableError`
 - Code: `-163`
 - Description: `SOCKET_SEND_BUFFER_SIZE_UNCHANGEABLE`
 - Type: connection

```js
const err = new chromiumNetErrors.SocketSendBufferSizeUnchangeableError()
```

### SslClientAuthCertBadFormatError

> Failed to import a client certificate from the platform store into the SSL
> library.

 - Name: `SslClientAuthCertBadFormatError`
 - Code: `-164`
 - Description: `SSL_CLIENT_AUTH_CERT_BAD_FORMAT`
 - Type: connection

```js
const err = new chromiumNetErrors.SslClientAuthCertBadFormatError()
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
const err = new chromiumNetErrors.IcannNameCollisionError()
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
const err = new chromiumNetErrors.SslServerCertBadFormatError()
```

### CtSthParsingFailedError

> Certificate Transparency: Received a signed tree head that failed to parse.

 - Name: `CtSthParsingFailedError`
 - Code: `-168`
 - Description: `CT_STH_PARSING_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.CtSthParsingFailedError()
```

### CtSthIncompleteError

> Certificate Transparency: Received a signed tree head whose JSON parsing was
> OK but was missing some of the fields.

 - Name: `CtSthIncompleteError`
 - Code: `-169`
 - Description: `CT_STH_INCOMPLETE`
 - Type: connection

```js
const err = new chromiumNetErrors.CtSthIncompleteError()
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
const err = new chromiumNetErrors.UnableToReuseConnectionForProxyAuthError()
```

### CtConsistencyProofParsingFailedError

> Certificate Transparency: Failed to parse the received consistency proof.

 - Name: `CtConsistencyProofParsingFailedError`
 - Code: `-171`
 - Description: `CT_CONSISTENCY_PROOF_PARSING_FAILED`
 - Type: connection

```js
const err = new chromiumNetErrors.CtConsistencyProofParsingFailedError()
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
const err = new chromiumNetErrors.SslObsoleteCipherError()
```

### WsUpgradeError

> When a WebSocket handshake is done successfully and the connection has been
> upgraded, the URLRequest is cancelled with this error code.

 - Name: `WsUpgradeError`
 - Code: `-173`
 - Description: `WS_UPGRADE`
 - Type: connection

```js
const err = new chromiumNetErrors.WsUpgradeError()
```

### ReadIfReadyNotImplementedError

> Socket ReadIfReady support is not implemented. This error should not be user
> visible, because the normal Read() method is used as a fallback.

 - Name: `ReadIfReadyNotImplementedError`
 - Code: `-174`
 - Description: `READ_IF_READY_NOT_IMPLEMENTED`
 - Type: connection

```js
const err = new chromiumNetErrors.ReadIfReadyNotImplementedError()
```

### SslVersionInterferenceError

> This error is emitted if TLS 1.3 is enabled, connecting with it failed, but
> retrying at a downgraded maximum version succeeded. This could mean:
> 
> 1. This is a transient network error that will be resolved when the user
> reloads.
> 
> 2. The user is behind a buggy network middlebox, firewall, or proxy which is
> interfering with TLS 1.3.
> 
> 3. The server is buggy and does not implement TLS version negotiation
> correctly. TLS 1.3 was tweaked to avoid a common server bug here, so this
> is unlikely.

 - Name: `SslVersionInterferenceError`
 - Code: `-175`
 - Description: `SSL_VERSION_INTERFERENCE`
 - Type: connection

```js
const err = new chromiumNetErrors.SslVersionInterferenceError()
```

### NoBufferSpaceError

> No socket buffer space is available.

 - Name: `NoBufferSpaceError`
 - Code: `-176`
 - Description: `NO_BUFFER_SPACE`
 - Type: connection

```js
const err = new chromiumNetErrors.NoBufferSpaceError()
```

### SslClientAuthNoCommonAlgorithmsError

> There were no common signature algorithms between our client certificate
> private key and the server's preferences.

 - Name: `SslClientAuthNoCommonAlgorithmsError`
 - Code: `-1478`
 - Description: `SSL_CLIENT_AUTH_NO_COMMON_ALGORITHMS`
 - Type: unknown

```js
const err = new chromiumNetErrors.SslClientAuthNoCommonAlgorithmsError()
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
const err = new chromiumNetErrors.CertCommonNameInvalidError()
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
const err = new chromiumNetErrors.CertDateInvalidError()
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
const err = new chromiumNetErrors.CertAuthorityInvalidError()
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
const err = new chromiumNetErrors.CertContainsErrorsError()
```

### CertNoRevocationMechanismError

> The certificate has no mechanism for determining if it is revoked. In
> effect, this certificate cannot be revoked.

 - Name: `CertNoRevocationMechanismError`
 - Code: `-204`
 - Description: `CERT_NO_REVOCATION_MECHANISM`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertNoRevocationMechanismError()
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
const err = new chromiumNetErrors.CertUnableToCheckRevocationError()
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
const err = new chromiumNetErrors.CertRevokedError()
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
const err = new chromiumNetErrors.CertInvalidError()
```

### CertWeakSignatureAlgorithmError

> The server responded with a certificate that is signed using a weak
> signature algorithm.

 - Name: `CertWeakSignatureAlgorithmError`
 - Code: `-208`
 - Description: `CERT_WEAK_SIGNATURE_ALGORITHM`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertWeakSignatureAlgorithmError()
```

### CertNonUniqueNameError

> The host name specified in the certificate is not unique.

 - Name: `CertNonUniqueNameError`
 - Code: `-210`
 - Description: `CERT_NON_UNIQUE_NAME`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertNonUniqueNameError()
```

### CertWeakKeyError

> The server responded with a certificate that contains a weak key (e.g.
> a too-small RSA key).

 - Name: `CertWeakKeyError`
 - Code: `-211`
 - Description: `CERT_WEAK_KEY`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertWeakKeyError()
```

### CertNameConstraintViolationError

> The certificate claimed DNS names that are in violation of name constraints.

 - Name: `CertNameConstraintViolationError`
 - Code: `-212`
 - Description: `CERT_NAME_CONSTRAINT_VIOLATION`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertNameConstraintViolationError()
```

### CertValidityTooLongError

> The certificate's validity period is too long.

 - Name: `CertValidityTooLongError`
 - Code: `-213`
 - Description: `CERT_VALIDITY_TOO_LONG`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertValidityTooLongError()
```

### CertificateTransparencyRequiredError

> Certificate Transparency was required for this connection, but the server
> did not provide CT information that complied with the policy.

 - Name: `CertificateTransparencyRequiredError`
 - Code: `-214`
 - Description: `CERTIFICATE_TRANSPARENCY_REQUIRED`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertificateTransparencyRequiredError()
```

### CertSymantecLegacyError

> The certificate chained to a legacy Symantec root that is no longer trusted.
> https://g.co/chrome/symantecpkicerts

 - Name: `CertSymantecLegacyError`
 - Code: `-215`
 - Description: `CERT_SYMANTEC_LEGACY`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertSymantecLegacyError()
```

### CertEndError

> The value immediately past the last certificate error code.

 - Name: `CertEndError`
 - Code: `-216`
 - Description: `CERT_END`
 - Type: certificate

```js
const err = new chromiumNetErrors.CertEndError()
```

### InvalidUrlError

> The URL is invalid.

 - Name: `InvalidUrlError`
 - Code: `-300`
 - Description: `INVALID_URL`
 - Type: http

```js
const err = new chromiumNetErrors.InvalidUrlError()
```

### DisallowedUrlSchemeError

> The scheme of the URL is disallowed.

 - Name: `DisallowedUrlSchemeError`
 - Code: `-301`
 - Description: `DISALLOWED_URL_SCHEME`
 - Type: http

```js
const err = new chromiumNetErrors.DisallowedUrlSchemeError()
```

### UnknownUrlSchemeError

> The scheme of the URL is unknown.

 - Name: `UnknownUrlSchemeError`
 - Code: `-302`
 - Description: `UNKNOWN_URL_SCHEME`
 - Type: http

```js
const err = new chromiumNetErrors.UnknownUrlSchemeError()
```

### InvalidRedirectError

> Attempting to load an URL resulted in a redirect to an invalid URL.

 - Name: `InvalidRedirectError`
 - Code: `-303`
 - Description: `INVALID_REDIRECT`
 - Type: http

```js
const err = new chromiumNetErrors.InvalidRedirectError()
```

### TooManyRedirectsError

> Attempting to load an URL resulted in too many redirects.

 - Name: `TooManyRedirectsError`
 - Code: `-310`
 - Description: `TOO_MANY_REDIRECTS`
 - Type: http

```js
const err = new chromiumNetErrors.TooManyRedirectsError()
```

### UnsafeRedirectError

> Attempting to load an URL resulted in an unsafe redirect (e.g., a redirect
> to file:// is considered unsafe).

 - Name: `UnsafeRedirectError`
 - Code: `-311`
 - Description: `UNSAFE_REDIRECT`
 - Type: http

```js
const err = new chromiumNetErrors.UnsafeRedirectError()
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
const err = new chromiumNetErrors.UnsafePortError()
```

### InvalidResponseError

> The server's response was invalid.

 - Name: `InvalidResponseError`
 - Code: `-320`
 - Description: `INVALID_RESPONSE`
 - Type: http

```js
const err = new chromiumNetErrors.InvalidResponseError()
```

### InvalidChunkedEncodingError

> Error in chunked transfer encoding.

 - Name: `InvalidChunkedEncodingError`
 - Code: `-321`
 - Description: `INVALID_CHUNKED_ENCODING`
 - Type: http

```js
const err = new chromiumNetErrors.InvalidChunkedEncodingError()
```

### MethodNotSupportedError

> The server did not support the request method.

 - Name: `MethodNotSupportedError`
 - Code: `-322`
 - Description: `METHOD_NOT_SUPPORTED`
 - Type: http

```js
const err = new chromiumNetErrors.MethodNotSupportedError()
```

### UnexpectedProxyAuthError

> The response was 407 (Proxy Authentication Required), yet we did not send
> the request to a proxy.

 - Name: `UnexpectedProxyAuthError`
 - Code: `-323`
 - Description: `UNEXPECTED_PROXY_AUTH`
 - Type: http

```js
const err = new chromiumNetErrors.UnexpectedProxyAuthError()
```

### EmptyResponseError

> The server closed the connection without sending any data.

 - Name: `EmptyResponseError`
 - Code: `-324`
 - Description: `EMPTY_RESPONSE`
 - Type: http

```js
const err = new chromiumNetErrors.EmptyResponseError()
```

### ResponseHeadersTooBigError

> The headers section of the response is too large.

 - Name: `ResponseHeadersTooBigError`
 - Code: `-325`
 - Description: `RESPONSE_HEADERS_TOO_BIG`
 - Type: http

```js
const err = new chromiumNetErrors.ResponseHeadersTooBigError()
```

### PacStatusNotOkError

> The PAC requested by HTTP did not have a valid status code (non-200).

 - Name: `PacStatusNotOkError`
 - Code: `-326`
 - Description: `PAC_STATUS_NOT_OK`
 - Type: http

```js
const err = new chromiumNetErrors.PacStatusNotOkError()
```

### PacScriptFailedError

> The evaluation of the PAC script failed.

 - Name: `PacScriptFailedError`
 - Code: `-327`
 - Description: `PAC_SCRIPT_FAILED`
 - Type: http

```js
const err = new chromiumNetErrors.PacScriptFailedError()
```

### RequestRangeNotSatisfiableError

> The response was 416 (Requested range not satisfiable) and the server cannot
> satisfy the range requested.

 - Name: `RequestRangeNotSatisfiableError`
 - Code: `-328`
 - Description: `REQUEST_RANGE_NOT_SATISFIABLE`
 - Type: http

```js
const err = new chromiumNetErrors.RequestRangeNotSatisfiableError()
```

### MalformedIdentityError

> The identity used for authentication is invalid.

 - Name: `MalformedIdentityError`
 - Code: `-329`
 - Description: `MALFORMED_IDENTITY`
 - Type: http

```js
const err = new chromiumNetErrors.MalformedIdentityError()
```

### ContentDecodingFailedError

> Content decoding of the response body failed.

 - Name: `ContentDecodingFailedError`
 - Code: `-330`
 - Description: `CONTENT_DECODING_FAILED`
 - Type: http

```js
const err = new chromiumNetErrors.ContentDecodingFailedError()
```

### NetworkIoSuspendedError

> An operation could not be completed because all network IO
> is suspended.

 - Name: `NetworkIoSuspendedError`
 - Code: `-331`
 - Description: `NETWORK_IO_SUSPENDED`
 - Type: http

```js
const err = new chromiumNetErrors.NetworkIoSuspendedError()
```

### SynReplyNotReceivedError

> FLIP data received without receiving a SYN_REPLY on the stream.

 - Name: `SynReplyNotReceivedError`
 - Code: `-332`
 - Description: `SYN_REPLY_NOT_RECEIVED`
 - Type: http

```js
const err = new chromiumNetErrors.SynReplyNotReceivedError()
```

### EncodingConversionFailedError

> Converting the response to target encoding failed.

 - Name: `EncodingConversionFailedError`
 - Code: `-333`
 - Description: `ENCODING_CONVERSION_FAILED`
 - Type: http

```js
const err = new chromiumNetErrors.EncodingConversionFailedError()
```

### UnrecognizedFtpDirectoryListingFormatError

> The server sent an FTP directory listing in a format we do not understand.

 - Name: `UnrecognizedFtpDirectoryListingFormatError`
 - Code: `-334`
 - Description: `UNRECOGNIZED_FTP_DIRECTORY_LISTING_FORMAT`
 - Type: http

```js
const err = new chromiumNetErrors.UnrecognizedFtpDirectoryListingFormatError()
```

### NoSupportedProxiesError

> There are no supported proxies in the provided list.

 - Name: `NoSupportedProxiesError`
 - Code: `-336`
 - Description: `NO_SUPPORTED_PROXIES`
 - Type: http

```js
const err = new chromiumNetErrors.NoSupportedProxiesError()
```

### SpdyProtocolError

> There is a SPDY protocol error.

 - Name: `SpdyProtocolError`
 - Code: `-337`
 - Description: `SPDY_PROTOCOL_ERROR`
 - Type: http

```js
const err = new chromiumNetErrors.SpdyProtocolError()
```

### InvalidAuthCredentialsError

> Credentials could not be established during HTTP Authentication.

 - Name: `InvalidAuthCredentialsError`
 - Code: `-338`
 - Description: `INVALID_AUTH_CREDENTIALS`
 - Type: http

```js
const err = new chromiumNetErrors.InvalidAuthCredentialsError()
```

### UnsupportedAuthSchemeError

> An HTTP Authentication scheme was tried which is not supported on this
> machine.

 - Name: `UnsupportedAuthSchemeError`
 - Code: `-339`
 - Description: `UNSUPPORTED_AUTH_SCHEME`
 - Type: http

```js
const err = new chromiumNetErrors.UnsupportedAuthSchemeError()
```

### EncodingDetectionFailedError

> Detecting the encoding of the response failed.

 - Name: `EncodingDetectionFailedError`
 - Code: `-340`
 - Description: `ENCODING_DETECTION_FAILED`
 - Type: http

```js
const err = new chromiumNetErrors.EncodingDetectionFailedError()
```

### MissingAuthCredentialsError

> (GSSAPI) No Kerberos credentials were available during HTTP Authentication.

 - Name: `MissingAuthCredentialsError`
 - Code: `-341`
 - Description: `MISSING_AUTH_CREDENTIALS`
 - Type: http

```js
const err = new chromiumNetErrors.MissingAuthCredentialsError()
```

### UnexpectedSecurityLibraryStatusError

> An unexpected, but documented, SSPI or GSSAPI status code was returned.

 - Name: `UnexpectedSecurityLibraryStatusError`
 - Code: `-342`
 - Description: `UNEXPECTED_SECURITY_LIBRARY_STATUS`
 - Type: http

```js
const err = new chromiumNetErrors.UnexpectedSecurityLibraryStatusError()
```

### MisconfiguredAuthEnvironmentError

> The environment was not set up correctly for authentication (for
> example, no KDC could be found or the principal is unknown.

 - Name: `MisconfiguredAuthEnvironmentError`
 - Code: `-343`
 - Description: `MISCONFIGURED_AUTH_ENVIRONMENT`
 - Type: http

```js
const err = new chromiumNetErrors.MisconfiguredAuthEnvironmentError()
```

### UndocumentedSecurityLibraryStatusError

> An undocumented SSPI or GSSAPI status code was returned.

 - Name: `UndocumentedSecurityLibraryStatusError`
 - Code: `-344`
 - Description: `UNDOCUMENTED_SECURITY_LIBRARY_STATUS`
 - Type: http

```js
const err = new chromiumNetErrors.UndocumentedSecurityLibraryStatusError()
```

### ResponseBodyTooBigToDrainError

> The HTTP response was too big to drain.

 - Name: `ResponseBodyTooBigToDrainError`
 - Code: `-345`
 - Description: `RESPONSE_BODY_TOO_BIG_TO_DRAIN`
 - Type: http

```js
const err = new chromiumNetErrors.ResponseBodyTooBigToDrainError()
```

### ResponseHeadersMultipleContentLengthError

> The HTTP response contained multiple distinct Content-Length headers.

 - Name: `ResponseHeadersMultipleContentLengthError`
 - Code: `-346`
 - Description: `RESPONSE_HEADERS_MULTIPLE_CONTENT_LENGTH`
 - Type: http

```js
const err = new chromiumNetErrors.ResponseHeadersMultipleContentLengthError()
```

### IncompleteSpdyHeadersError

> SPDY Headers have been received, but not all of them - status or version
> headers are missing, so we're expecting additional frames to complete them.

 - Name: `IncompleteSpdyHeadersError`
 - Code: `-347`
 - Description: `INCOMPLETE_SPDY_HEADERS`
 - Type: http

```js
const err = new chromiumNetErrors.IncompleteSpdyHeadersError()
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
const err = new chromiumNetErrors.PacNotInDhcpError()
```

### ResponseHeadersMultipleContentDispositionError

> The HTTP response contained multiple Content-Disposition headers.

 - Name: `ResponseHeadersMultipleContentDispositionError`
 - Code: `-349`
 - Description: `RESPONSE_HEADERS_MULTIPLE_CONTENT_DISPOSITION`
 - Type: http

```js
const err = new chromiumNetErrors.ResponseHeadersMultipleContentDispositionError()
```

### ResponseHeadersMultipleLocationError

> The HTTP response contained multiple Location headers.

 - Name: `ResponseHeadersMultipleLocationError`
 - Code: `-350`
 - Description: `RESPONSE_HEADERS_MULTIPLE_LOCATION`
 - Type: http

```js
const err = new chromiumNetErrors.ResponseHeadersMultipleLocationError()
```

### SpdyServerRefusedStreamError

> HTTP/2 server refused the request without processing, and sent either a
> GOAWAY frame with error code NO_ERROR and Last-Stream-ID lower than the
> stream id corresponding to the request indicating that this request has not
> been processed yet, or a RST_STREAM frame with error code REFUSED_STREAM.
> Client MAY retry (on a different connection). See RFC7540 Section 8.1.4.

 - Name: `SpdyServerRefusedStreamError`
 - Code: `-351`
 - Description: `SPDY_SERVER_REFUSED_STREAM`
 - Type: http

```js
const err = new chromiumNetErrors.SpdyServerRefusedStreamError()
```

### SpdyPingFailedError

> SPDY server didn't respond to the PING message.

 - Name: `SpdyPingFailedError`
 - Code: `-352`
 - Description: `SPDY_PING_FAILED`
 - Type: http

```js
const err = new chromiumNetErrors.SpdyPingFailedError()
```

### ContentLengthMismatchError

> The HTTP response body transferred fewer bytes than were advertised by the
> Content-Length header when the connection is closed.

 - Name: `ContentLengthMismatchError`
 - Code: `-354`
 - Description: `CONTENT_LENGTH_MISMATCH`
 - Type: http

```js
const err = new chromiumNetErrors.ContentLengthMismatchError()
```

### IncompleteChunkedEncodingError

> The HTTP response body is transferred with Chunked-Encoding, but the
> terminating zero-length chunk was never sent when the connection is closed.

 - Name: `IncompleteChunkedEncodingError`
 - Code: `-355`
 - Description: `INCOMPLETE_CHUNKED_ENCODING`
 - Type: http

```js
const err = new chromiumNetErrors.IncompleteChunkedEncodingError()
```

### QuicProtocolError

> There is a QUIC protocol error.

 - Name: `QuicProtocolError`
 - Code: `-356`
 - Description: `QUIC_PROTOCOL_ERROR`
 - Type: http

```js
const err = new chromiumNetErrors.QuicProtocolError()
```

### ResponseHeadersTruncatedError

> The HTTP headers were truncated by an EOF.

 - Name: `ResponseHeadersTruncatedError`
 - Code: `-357`
 - Description: `RESPONSE_HEADERS_TRUNCATED`
 - Type: http

```js
const err = new chromiumNetErrors.ResponseHeadersTruncatedError()
```

### QuicHandshakeFailedError

> The QUIC crytpo handshake failed. This means that the server was unable
> to read any requests sent, so they may be resent.

 - Name: `QuicHandshakeFailedError`
 - Code: `-358`
 - Description: `QUIC_HANDSHAKE_FAILED`
 - Type: http

```js
const err = new chromiumNetErrors.QuicHandshakeFailedError()
```

### SpdyInadequateTransportSecurityError

> Transport security is inadequate for the SPDY version.

 - Name: `SpdyInadequateTransportSecurityError`
 - Code: `-360`
 - Description: `SPDY_INADEQUATE_TRANSPORT_SECURITY`
 - Type: http

```js
const err = new chromiumNetErrors.SpdyInadequateTransportSecurityError()
```

### SpdyFlowControlError

> The peer violated SPDY flow control.

 - Name: `SpdyFlowControlError`
 - Code: `-361`
 - Description: `SPDY_FLOW_CONTROL_ERROR`
 - Type: http

```js
const err = new chromiumNetErrors.SpdyFlowControlError()
```

### SpdyFrameSizeError

> The peer sent an improperly sized SPDY frame.

 - Name: `SpdyFrameSizeError`
 - Code: `-362`
 - Description: `SPDY_FRAME_SIZE_ERROR`
 - Type: http

```js
const err = new chromiumNetErrors.SpdyFrameSizeError()
```

### SpdyCompressionError

> Decoding or encoding of compressed SPDY headers failed.

 - Name: `SpdyCompressionError`
 - Code: `-363`
 - Description: `SPDY_COMPRESSION_ERROR`
 - Type: http

```js
const err = new chromiumNetErrors.SpdyCompressionError()
```

### ProxyAuthRequestedWithNoConnectionError

> Proxy Auth Requested without a valid Client Socket Handle.

 - Name: `ProxyAuthRequestedWithNoConnectionError`
 - Code: `-364`
 - Description: `PROXY_AUTH_REQUESTED_WITH_NO_CONNECTION`
 - Type: http

```js
const err = new chromiumNetErrors.ProxyAuthRequestedWithNoConnectionError()
```

### PacScriptTerminatedError

> The PAC script terminated fatally and must be reloaded.

 - Name: `PacScriptTerminatedError`
 - Code: `-367`
 - Description: `PAC_SCRIPT_TERMINATED`
 - Type: http

```js
const err = new chromiumNetErrors.PacScriptTerminatedError()
```

### InvalidHttpResponseError

> The server was expected to return an HTTP/1.x response, but did not. Rather
> than treat it as HTTP/0.9, this error is returned.

 - Name: `InvalidHttpResponseError`
 - Code: `-370`
 - Description: `INVALID_HTTP_RESPONSE`
 - Type: http

```js
const err = new chromiumNetErrors.InvalidHttpResponseError()
```

### ContentDecodingInitFailedError

> Initializing content decoding failed.

 - Name: `ContentDecodingInitFailedError`
 - Code: `-371`
 - Description: `CONTENT_DECODING_INIT_FAILED`
 - Type: http

```js
const err = new chromiumNetErrors.ContentDecodingInitFailedError()
```

### SpdyRstStreamNoErrorReceivedError

> Received HTTP/2 RST_STREAM frame with NO_ERROR error code. This error should
> be handled internally by HTTP/2 code, and should not make it above the
> SpdyStream layer.

 - Name: `SpdyRstStreamNoErrorReceivedError`
 - Code: `-372`
 - Description: `SPDY_RST_STREAM_NO_ERROR_RECEIVED`
 - Type: http

```js
const err = new chromiumNetErrors.SpdyRstStreamNoErrorReceivedError()
```

### SpdyPushedStreamNotAvailableError

> The pushed stream claimed by the request is no longer available.

 - Name: `SpdyPushedStreamNotAvailableError`
 - Code: `-373`
 - Description: `SPDY_PUSHED_STREAM_NOT_AVAILABLE`
 - Type: http

```js
const err = new chromiumNetErrors.SpdyPushedStreamNotAvailableError()
```

### SpdyClaimedPushedStreamResetByServerError

> A pushed stream was claimed and later reset by the server. When this happens,
> the request should be retried.

 - Name: `SpdyClaimedPushedStreamResetByServerError`
 - Code: `-374`
 - Description: `SPDY_CLAIMED_PUSHED_STREAM_RESET_BY_SERVER`
 - Type: http

```js
const err = new chromiumNetErrors.SpdyClaimedPushedStreamResetByServerError()
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
const err = new chromiumNetErrors.TooManyRetriesError()
```

### CacheMissError

> The cache does not have the requested entry.

 - Name: `CacheMissError`
 - Code: `-400`
 - Description: `CACHE_MISS`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheMissError()
```

### CacheReadFailureError

> Unable to read from the disk cache.

 - Name: `CacheReadFailureError`
 - Code: `-401`
 - Description: `CACHE_READ_FAILURE`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheReadFailureError()
```

### CacheWriteFailureError

> Unable to write to the disk cache.

 - Name: `CacheWriteFailureError`
 - Code: `-402`
 - Description: `CACHE_WRITE_FAILURE`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheWriteFailureError()
```

### CacheOperationNotSupportedError

> The operation is not supported for this entry.

 - Name: `CacheOperationNotSupportedError`
 - Code: `-403`
 - Description: `CACHE_OPERATION_NOT_SUPPORTED`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheOperationNotSupportedError()
```

### CacheOpenFailureError

> The disk cache is unable to open this entry.

 - Name: `CacheOpenFailureError`
 - Code: `-404`
 - Description: `CACHE_OPEN_FAILURE`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheOpenFailureError()
```

### CacheCreateFailureError

> The disk cache is unable to create this entry.

 - Name: `CacheCreateFailureError`
 - Code: `-405`
 - Description: `CACHE_CREATE_FAILURE`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheCreateFailureError()
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
const err = new chromiumNetErrors.CacheRaceError()
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
const err = new chromiumNetErrors.CacheChecksumReadFailureError()
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
const err = new chromiumNetErrors.CacheChecksumMismatchError()
```

### CacheLockTimeoutError

> Internal error code for the HTTP cache. The cache lock timeout has fired.

 - Name: `CacheLockTimeoutError`
 - Code: `-409`
 - Description: `CACHE_LOCK_TIMEOUT`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheLockTimeoutError()
```

### CacheAuthFailureAfterReadError

> Received a challenge after the transaction has read some data, and the
> credentials aren't available. There isn't a way to get them at that point.

 - Name: `CacheAuthFailureAfterReadError`
 - Code: `-410`
 - Description: `CACHE_AUTH_FAILURE_AFTER_READ`
 - Type: cache

```js
const err = new chromiumNetErrors.CacheAuthFailureAfterReadError()
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
const err = new chromiumNetErrors.CacheEntryNotSuitableError()
```

### InsecureResponseError

> The server's response was insecure (e.g. there was a cert error).

 - Name: `InsecureResponseError`
 - Code: `-501`
 - Description: `INSECURE_RESPONSE`
 - Type: unknown

```js
const err = new chromiumNetErrors.InsecureResponseError()
```

### NoPrivateKeyForCertError

> An attempt to import a client certificate failed, as the user's key
> database lacked a corresponding private key.

 - Name: `NoPrivateKeyForCertError`
 - Code: `-502`
 - Description: `NO_PRIVATE_KEY_FOR_CERT`
 - Type: unknown

```js
const err = new chromiumNetErrors.NoPrivateKeyForCertError()
```

### AddUserCertFailedError

> An error adding a certificate to the OS certificate database.

 - Name: `AddUserCertFailedError`
 - Code: `-503`
 - Description: `ADD_USER_CERT_FAILED`
 - Type: unknown

```js
const err = new chromiumNetErrors.AddUserCertFailedError()
```

### FtpFailedError

> A generic error for failed FTP control connection command.
> If possible, please use or add a more specific error code.

 - Name: `FtpFailedError`
 - Code: `-601`
 - Description: `FTP_FAILED`
 - Type: ftp

```js
const err = new chromiumNetErrors.FtpFailedError()
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
const err = new chromiumNetErrors.FtpServiceUnavailableError()
```

### FtpTransferAbortedError

> The server has aborted the transfer.
> FTP response code 426.

 - Name: `FtpTransferAbortedError`
 - Code: `-603`
 - Description: `FTP_TRANSFER_ABORTED`
 - Type: ftp

```js
const err = new chromiumNetErrors.FtpTransferAbortedError()
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
const err = new chromiumNetErrors.FtpFileBusyError()
```

### FtpSyntaxError

> Server rejected our command because of syntax errors.
> FTP response codes 500, 501.

 - Name: `FtpSyntaxError`
 - Code: `-605`
 - Description: `FTP_SYNTAX_ERROR`
 - Type: ftp

```js
const err = new chromiumNetErrors.FtpSyntaxError()
```

### FtpCommandNotSupportedError

> Server does not support the command we issued.
> FTP response codes 502, 504.

 - Name: `FtpCommandNotSupportedError`
 - Code: `-606`
 - Description: `FTP_COMMAND_NOT_SUPPORTED`
 - Type: ftp

```js
const err = new chromiumNetErrors.FtpCommandNotSupportedError()
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
const err = new chromiumNetErrors.FtpBadCommandSequenceError()
```

### ImportCaCertNotCaError

> CA import failed - not a CA cert.

 - Name: `ImportCaCertNotCaError`
 - Code: `-703`
 - Description: `IMPORT_CA_CERT_NOT_CA`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.ImportCaCertNotCaError()
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
const err = new chromiumNetErrors.ImportCertAlreadyExistsError()
```

### ImportCaCertFailedError

> CA import failed due to some other error.

 - Name: `ImportCaCertFailedError`
 - Code: `-705`
 - Description: `IMPORT_CA_CERT_FAILED`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.ImportCaCertFailedError()
```

### ImportServerCertFailedError

> Server certificate import failed due to some internal error.

 - Name: `ImportServerCertFailedError`
 - Code: `-706`
 - Description: `IMPORT_SERVER_CERT_FAILED`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.ImportServerCertFailedError()
```

### KeyGenerationFailedError

> Key generation failed.

 - Name: `KeyGenerationFailedError`
 - Code: `-710`
 - Description: `KEY_GENERATION_FAILED`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.KeyGenerationFailedError()
```

### PrivateKeyExportFailedError

> Failure to export private key.

 - Name: `PrivateKeyExportFailedError`
 - Code: `-712`
 - Description: `PRIVATE_KEY_EXPORT_FAILED`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.PrivateKeyExportFailedError()
```

### SelfSignedCertGenerationFailedError

> Self-signed certificate generation failed.

 - Name: `SelfSignedCertGenerationFailedError`
 - Code: `-713`
 - Description: `SELF_SIGNED_CERT_GENERATION_FAILED`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.SelfSignedCertGenerationFailedError()
```

### CertDatabaseChangedError

> The certificate database changed in some way.

 - Name: `CertDatabaseChangedError`
 - Code: `-714`
 - Description: `CERT_DATABASE_CHANGED`
 - Type: certificate-manager

```js
const err = new chromiumNetErrors.CertDatabaseChangedError()
```

### DnsMalformedResponseError

> DNS resolver received a malformed response.

 - Name: `DnsMalformedResponseError`
 - Code: `-800`
 - Description: `DNS_MALFORMED_RESPONSE`
 - Type: dns

```js
const err = new chromiumNetErrors.DnsMalformedResponseError()
```

### DnsServerRequiresTcpError

> DNS server requires TCP

 - Name: `DnsServerRequiresTcpError`
 - Code: `-801`
 - Description: `DNS_SERVER_REQUIRES_TCP`
 - Type: dns

```js
const err = new chromiumNetErrors.DnsServerRequiresTcpError()
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
const err = new chromiumNetErrors.DnsServerFailedError()
```

### DnsTimedOutError

> DNS transaction timed out.

 - Name: `DnsTimedOutError`
 - Code: `-803`
 - Description: `DNS_TIMED_OUT`
 - Type: dns

```js
const err = new chromiumNetErrors.DnsTimedOutError()
```

### DnsCacheMissError

> The entry was not found in cache, for cache-only lookups.

 - Name: `DnsCacheMissError`
 - Code: `-804`
 - Description: `DNS_CACHE_MISS`
 - Type: dns

```js
const err = new chromiumNetErrors.DnsCacheMissError()
```

### DnsSearchEmptyError

> Suffix search list rules prevent resolution of the given host name.

 - Name: `DnsSearchEmptyError`
 - Code: `-805`
 - Description: `DNS_SEARCH_EMPTY`
 - Type: dns

```js
const err = new chromiumNetErrors.DnsSearchEmptyError()
```

### DnsSortError

> Failed to sort addresses according to RFC3484.

 - Name: `DnsSortError`
 - Code: `-806`
 - Description: `DNS_SORT_ERROR`
 - Type: dns

```js
const err = new chromiumNetErrors.DnsSortError()
```

### DnsHttpFailedError

> Failed to resolve over HTTP, fallback to legacy

 - Name: `DnsHttpFailedError`
 - Code: `-807`
 - Description: `DNS_HTTP_FAILED`
 - Type: dns

```js
const err = new chromiumNetErrors.DnsHttpFailedError()
```

<!--END_ERROR_LIST-->

## License

Copyright (c) 2015 - 2018 Max Kueng and contributors

MIT License
