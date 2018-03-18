Changelog
=========

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

___Breaking Changes___

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
