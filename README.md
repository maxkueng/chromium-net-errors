Chromium Network Errors
=======================

[![Build Status](https://secure.travis-ci.org/maxkueng/chromium-net-errors.png?branch=master)](http://travis-ci.org/maxkueng/chromium-net-errors)

Provides Chromium network errors found in
[net_error_list.h](http://src.chromium.org/svn/trunk/src/net/base/net_error_list.h)
as custom errors for Node.js. 

They correspond to the error codes that could be provided by
[Electron](https://github.com/atom/electron)'s `did-fail-load` event, for
example.

## Install

```sh
npm install chromium-net-errors --save
```

## Usage

```js
var cne = require('chromium-net-errors');
```

### Create new errors

```js
var err = new cne.ConnectionTimedOutError();

console.log(err instanceof Error); // true
console.log(err instanceof cne.ChromiumNetError); // true
console.log(err instanceof cne.ConnectionTimedOutError); // true
```

### Create errors by code

```js
var err = cne.createByCode(-201);

console.log(err instanceof cne.CertDateInvalidError);
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

MIT
