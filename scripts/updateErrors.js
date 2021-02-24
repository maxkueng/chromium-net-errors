/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import got from 'got';
import through2 from 'through2';

const ERROR_LIST_URL = 'https://raw.githubusercontent.com/chromium/chromium/master/net/base/net_error_list.h';
const OUTPUT_FILE = './net_error_list.h';

const outputPath = path.resolve(process.cwd(), OUTPUT_FILE);

const check = process.argv.includes('--check');

function getCurrentFile() {
  let stat;
  try {
    stat = fs.statSync(outputPath);
    if (!stat.isFile()) {
      return '';
    }
  } catch (err) {
    return '';
  }
  return fs.readFileSync(outputPath, 'utf-8');
}

const combined = (() => {
  const stream = through2((chunk, enc, callback) => {
    stream.combined += chunk;
    callback();
  });
  stream.combined = '';
  return stream;
})();

got.stream(ERROR_LIST_URL, {
  headers: {
    'Cookie': 'REDIRECT_STATUS=optout',
  },
})
  .pipe(combined)
  .on('finish', () => {
    if (check) {
      if (combined.combined !== getCurrentFile()) {
        console.error(`${OUTPUT_FILE} is not up-to-date. Run 'npm run update-errors'`);
        process.exit(1);
        return;
      }
      console.log(`${OUTPUT_FILE} is up-to-date`);
      return;
    }

    fs.writeFileSync(outputPath, combined.combined, 'utf-8');
    console.log(`Errors updated: ${OUTPUT_FILE}`);
  });
