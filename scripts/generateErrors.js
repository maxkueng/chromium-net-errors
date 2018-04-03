/* eslint-disable import/no-extraneous-dependencies */

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import errors from '../errors.json';

function formatErrorMessage(message) {
  return String(message)
    .replace(/[ ]+/g, ' ')
    .split(/\r?\n/)
    .map(line => `> ${line}`)
    .join('\n');
}

const readmePath = path.resolve(process.cwd(), 'README.md');
const errorsDir = path.resolve(process.cwd(), 'generated-errors');
rimraf.sync(errorsDir);
mkdirp.sync(errorsDir);

const readmeErrors = [];

errors.forEach((error) => {
  const code = `import ChromiumNetError from '../src/ChromiumNetError';

export default class ${error.name} extends ChromiumNetError {
  constructor(message, ...restArgs) {
    super(...[message, ...restArgs]);

    this.name = '${error.name}';
    this.code = ${error.code};
    this.description = '${error.description}';
    this.type = ${(error.type && JSON.stringify(error.type)) || '\'unknown\''};
    this.message = message || ${JSON.stringify(error.message)};
    Error.captureStackTrace(this, ${error.name});
  }
}
`;
  fs.writeFileSync(path.join(errorsDir, `${error.name}.js`), code, 'utf-8');

  readmeErrors.push(`${`
### ${error.name}

${formatErrorMessage(error.message)}

 - Name: \`${error.name}\`
 - Code: \`${error.code}\`
 - Description: \`${error.description}\`
 - Type: ${error.type}

\`\`\`js
const err = new chromiumNetErrors.${error.name}();
// or
const Err = chromiumNetErrors.getErrorByCode(${error.code});
const err = new Err();
// or
const Err = chromiumNetErrors.getErrorByDescription('${error.description}');
const err = new Err();
\`\`\`
  `.trim()}\n`);
});

function updateReadme(errorList) {
  const readmeContents = fs.readFileSync(readmePath, 'utf-8');
  const startComment = '<!--START_ERROR_LIST-->';
  const endComment = '<!--END_ERROR_LIST-->';
  const startIndex = readmeContents.indexOf(startComment);
  const endIndex = readmeContents.indexOf(endComment) + endComment.length;

  const errorContents = [
    startComment,
    ...errorList,
    endComment,
  ].join('\n');

  const beforeContents = readmeContents.substring(0, startIndex);
  const afterContents = readmeContents.substring(endIndex);
  const newContents = `${beforeContents}${errorContents}${afterContents}`;

  fs.writeFileSync(readmePath, newContents, 'utf-8');
}

const indexjs = errors.map(error => `export { default as ${error.name} } from './${error.name}';`).join('\n');
fs.writeFileSync(path.join(errorsDir, 'index.js'), indexjs, 'utf-8');

updateReadme(readmeErrors);
