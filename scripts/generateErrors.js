/* eslint-disable import/no-extraneous-dependencies */

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import errors from '../errors.json';

const errorsDir = path.resolve(process.cwd(), 'generated-errors');
rimraf.sync(errorsDir);
mkdirp.sync(errorsDir);

errors.forEach((error) => {
  const code = `import ChromiumNetError from '../src/ChromiumNetError';

export default class ${error.name} extends ChromiumNetError {
  constructor(message, ...restArgs) {
    super(...[message, ...restArgs]);

    this.name = '${error.name}';
    this.code = ${error.code};
    this.type = ${(error.type && `'${error.type}'`) || '\'unknown\''}
    this.message = message || '${error.message.replace(/'/g, '\\\'')}';
  }
}
`;
  fs.writeFileSync(path.join(errorsDir, `${error.name}.js`), code, 'utf-8');
});

const indexjs = errors.map(error => `export { default as ${error.name} } from './${error.name}';`).join('\n');
fs.writeFileSync(path.join(errorsDir, 'index.js'), indexjs, 'utf-8');
