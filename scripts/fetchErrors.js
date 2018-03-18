/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import got from 'got';
import through2 from 'through2';
import split from 'split';
import { pascalCase } from 'change-case';
import * as errorTypes from '../src/errorTypes';

const ERROR_LIST_URL = 'https://cs.chromium.org/codesearch/f/chromium/src/net/base/net_error_list.h';
const OUTPUT_FILE = './errors.json';

const EMPTY_LINE_REGEX = /^\s*$/;
const COMMENT_REGEX = /^\/\/\s*/;
const NET_ERROR_REGEX = /^NET_ERROR\(([A-Z_]+), ([0-9-]+)\)$/;

const errorTypesMap = {
  0: errorTypes.ERROR_TYPE_SYSTEM,
  100: errorTypes.ERROR_TYPE_CONNECTION,
  200: errorTypes.ERROR_TYPE_CERTIFICATE,
  300: errorTypes.ERROR_TYPE_HTTP,
  400: errorTypes.ERROR_TYPE_CACHE,
  500: errorTypes.ERROR_TYPE_UNKNOWN,
  600: errorTypes.ERROR_TYPE_FTP,
  700: errorTypes.ERROR_TYPE_CERTIFICATE_MANAGER,
  800: errorTypes.ERROR_TYPE_DNS,
};

function createSinkStream() {
  return through2.obj((chunk, enc, next) => next());
}

function fixErrorName(name) {
  if (name.endsWith('Error')) {
    return name;
  }
  return `${name}Error`;
}

function fixErrorMessage(message) {
  return message
    .replace(COMMENT_REGEX, '');
}

const segmentUtils = {
  initStream(stream) {
    /* eslint-disable no-param-reassign */
    stream.errors = [];
    stream.currentSegment = 0;
    stream.segments = [];
    /* eslint-enable no-param-reassign */
  },
  increment(stream) {
    // eslint-disable-next-line no-param-reassign
    stream.currentSegment += 1;
  },
  addToSegment(stream, line) {
    let segment = stream.segments[stream.currentSegment] || '';
    if (segment !== '') {
      segment += '\n';
    }

    segment += line;
    // eslint-disable-next-line no-param-reassign
    stream.segments[stream.currentSegment] = segment;
  },
  getPreviousSegment(stream) {
    return stream.segments[stream.currentSegment - 1] || '';
  },
  handleErrorChunk(stream, chunk) {
    segmentUtils.increment(stream);
    segmentUtils.addToSegment(stream, chunk);

    const [, errorName, errorCode] = NET_ERROR_REGEX.exec(chunk);

    const errorCodeNumber = Number.parseInt(errorCode, 10);
    const errorTypeCode = Math.floor(Math.abs(errorCodeNumber) / 100) * 100;
    const errorMessage = fixErrorMessage(segmentUtils.getPreviousSegment(stream));

    stream.errors.push({
      name: fixErrorName(pascalCase(errorName)),
      code: errorCodeNumber,
      type: errorTypesMap[errorTypeCode] || errorTypes.ERROR_TYPE_UNKNOWN,
      message: errorMessage,
    });
  },
  handleEmptyChunk(stream) {
    segmentUtils.increment(stream);
  },
  handleMessageChunk(stream, chunk) {
    segmentUtils.addToSegment(stream, chunk.replace(COMMENT_REGEX, ''));
  },
};

function createSegmentsStream() {
  const stream = through2.obj((chunk, enc, callback) => {
    function next(line) {
      callback(null, line);
    }

    if (EMPTY_LINE_REGEX.test(chunk)) {
      segmentUtils.handleEmptyChunk(stream);
      next(chunk);
      return;
    }

    if (NET_ERROR_REGEX.test(chunk)) {
      segmentUtils.handleErrorChunk(stream, chunk);
    } else {
      segmentUtils.handleMessageChunk(stream, chunk);
    }

    next(chunk);
  });

  segmentUtils.initStream(stream);

  return stream;
}

const segmentsStream = createSegmentsStream();

got.stream(ERROR_LIST_URL)
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

