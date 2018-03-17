#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const got = require('got');
const through2 = require('through2');
const split = require('split');
const { pascalCase } = require('change-case');
const chromiumNetErrors = require('..');

const ERROR_LIST_URL = 'https://cs.chromium.org/codesearch/f/chromium/src/net/base/net_error_list.h';
const OUTPUT_FILE = './errors.json';

const EMPTY_LINE_REGEX = /^\s*$/;
const COMMENT_REGEX = /^\/\/\s*/;
const NET_ERROR_REGEX = /^NET_ERROR\(([A-Z_]+), ([0-9-]+)\)$/;

const errorTypes = {
  0: chromiumNetErrors.ERROR_TYPE_SYSTEM,
  100: chromiumNetErrors.ERROR_TYPE_CONNECTION,
  200: chromiumNetErrors.ERROR_TYPE_CERTIFICATE,
  300: chromiumNetErrors.ERROR_TYPE_HTTP,
  400: chromiumNetErrors.ERROR_TYPE_CACHE,
  500: chromiumNetErrors.ERROR_TYPE_UNKNOWN,
  600: chromiumNetErrors.ERROR_TYPE_FTP,
  700: chromiumNetErrors.ERROR_TYPE_CERTIFICATE_MANAGER,
  800: chromiumNetErrors.ERROR_TYPE_DNS,
};

function createSinkStream() {
  return through2.obj((chunk, enc, next) => next());
}

function createSegmentsStream() {
  function fixErrorName(name) {
    if (name.endsWith('Error')) {
      return name;
    }
    return `${name}Error`;
  }

  function fixErrorMessage(message) {
    return message
      .replace(COMMENT_REGEX, '')
      .replace(/\r?\n/g, ' ')
      .replace(/\s+/g, ' ');
  }

  const stream = through2.obj((chunk, enc, callback) => {
    function next(line) {
      stream.push(line);
      callback();
    }

    function increment() {
      stream.currentSegment += 1;
    }

    function addToSegment(line) {
      let segment = stream.segments[stream.currentSegment] || '';
      if (segment !== '') {
        segment += '\n';
      }

      segment += line;
      stream.segments[stream.currentSegment] = segment;
    }

    function getPreviousSegment() {
      return stream.segments[stream.currentSegment - 1] || '';
    }

    if (EMPTY_LINE_REGEX.test(chunk)) {
      increment();
      next(chunk);
      return;
    }

    if (NET_ERROR_REGEX.test(chunk)) {
      increment();
      addToSegment(chunk);

      const [
        ,
        errorName,
        errorCode,
      ] = NET_ERROR_REGEX.exec(chunk);

      const errorCodeNumber = Number.parseInt(errorCode, 10);
      const errorTypeCode = Math.floor(Math.abs(errorCodeNumber) / 100) * 100;
      const errorMessage = fixErrorMessage(getPreviousSegment());

      stream.errors.push({
        name: fixErrorName(pascalCase(errorName)),
        code: errorCodeNumber,
        type: errorTypes[errorTypeCode],
        message: errorMessage,
      });
    } else {
      addToSegment(chunk.replace(COMMENT_REGEX, ''));
    }

    next(chunk);
  });

  stream.errors = [];
  stream.currentSegment = 0;
  stream.segments = [];

  return stream;
}

const segmentsStream = createSegmentsStream();

got(ERROR_LIST_URL)
  .pipe(split())
  .pipe(segmentsStream)
  .pipe(createSinkStream())
  .on('finish', () => {
    const outputPath = path.resolve(OUTPUT_FILE);

    fs.writeFile(
      path.resolve(OUTPUT_FILE),
      JSON.stringify(segmentsStream.errors, null, '  '),
      'utf-8',
      (err) => {
        if (err) {
          console.error(`Failed to write file '${OUTPUT_FILE}' - ${err.toString()}`);
          process.exit(1);
          return;
        }

        console.log(`${segmentsStream.errors.length} errors parsed`);
        console.log(`Written to ${outputPath}`);
      },
    );
  });

