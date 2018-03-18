Chromium Network Errors
=======================

[![Build Status](https://secure.travis-ci.org/maxkueng/chromium-net-errors.png?branch=master)](http://travis-ci.org/maxkueng/chromium-net-errors)
[![Coverage Status](https://coveralls.io/repos/maxkueng/chromium-net-errors/badge.svg?branch=master&service=github)](https://coveralls.io/github/maxkueng/chromium-net-errors?branch=master)

Provides Chromium network errors found in
[net_error_list.h](https://cs.chromium.org/codesearch/f/chromium/src/net/base/net_error_list.h)
as custom error classes for Node.js. It can be used in browsers too.  
They correspond to the error codes that are provided in 
[Electron's `did-fail-load` event](https://github.com/electron/electron/blob/master/docs/api/web-contents.md#event-did-fail-load).

## Install

```sh
npm install chromium-net-errors --save
```

## Example use in Electron

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
      throw chromiumNetErrors.createByCode(errorCode);
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

### Create new errors

```js
const err = new chromiumNetErrors.ConnectionTimedOutError();

console.log(err instanceof Error);
// true
console.log(err instanceof chromiumNetErrors.ChromiumNetError);
// true
console.log(err instanceof chromiumNetErrors.ConnectionTimedOutError);
// true
```

### Create errors by code

```js
const err = chromiumNetErrors.createByCode(-201);

console.log(err instanceof chromiumNetErrors.CertDateInvalidError);
// true

console.log(err.isCertificateError());
// true

console.log(err.type); 
// certificate

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

## License

Copyright (c) 2015 - 2018 Max Kueng and contributors

MIT License
