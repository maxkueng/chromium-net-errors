Chromium Network Errors
=======================

[![Build Status](https://secure.travis-ci.org/maxkueng/chromium-net-errors.png?branch=master)](http://travis-ci.org/maxkueng/chromium-net-errors)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/bdec0faf360447f39cdcc70d9d0750d3)](https://www.codacy.com/app/maxkueng/chromium-net-errors?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=maxkueng/chromium-net-errors&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/df86c1d3fa5b248aaaa6/maintainability)](https://codeclimate.com/github/maxkueng/chromium-net-errors/maintainability)
[![Coverage Status](https://coveralls.io/repos/maxkueng/chromium-net-errors/badge.svg?branch=master&service=github)](https://coveralls.io/github/maxkueng/chromium-net-errors?branch=master)

Provides Chromium network errors found in
[net_error_list.h](https://cs.chromium.org/codesearch/f/chromium/src/net/base/net_error_list.h)
as custom error classes that can be conveniently Node.js and Electron apps. It
can be used in browsers too.  
They correspond to the error codes that are provided in 
[Electron's `did-fail-load` event](https://github.com/electron/electron/blob/master/docs/api/web-contents.md#event-did-fail-load).

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
    } catch(err if err instanceof chromiumNetErrors.NameNotResolvedError) {
      console.error(`The name '${validatedURL}' could not be resolved:\n  ${err.message}`);
    } catch(err /* if err instanceof chromiumNetErrors.UnknownError */) {
      console.error(`Something went wrong while loading ${validatedURL}`);
    }
  });

  win.loadUrl('http://blablanotexist.com');
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

### Get Errors by errorCode

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

### Get All Errors

Get an array of all possible errors.

```js
console.log(chromiumNetErrors.getErrors());

// [ { name: 'IoPendingError',
//     code: -1,
//     type: 'system',
//     message: 'An asynchronous IO operation is not yet complete.  This usually does not\nindicate a fatal error.  Typically this error will be generated as a\nnotification to wait for some external notification that the IO operation\nfinally completed.' },
//   { name: 'FailedError',
//     code: -2,
//     type: 'system',
//     message: 'A generic failure occurred.' },
//   { name: 'AbortedError',
//     code: -3,
//     type: 'system',
//     message: 'An operation was aborted (due to user action).' },
//   { name: 'InvalidArgumentError',
//     code: -4,
//     type: 'system',
//     message: 'An argument to the function is incorrect.' },
//   { name: 'InvalidHandleError',
//     code: -5,
//     type: 'system',
//     message: 'The handle or file descriptor is invalid.' },
//   ...
// ]
```

## License

Copyright (c) 2015 - 2018 Max Kueng and contributors

MIT License
