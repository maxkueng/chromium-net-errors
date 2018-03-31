Changelog
=========

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

 - Add TooManyRetriesError (code -375)

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
