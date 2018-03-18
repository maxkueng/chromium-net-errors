import * as path from 'path';
import * as fs from 'fs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import pkg from './package.json';

const license = fs.readFileSync(path.resolve('LICENSE'), 'utf-8');

const bannerLines = [];
bannerLines.push('/*!');
bannerLines.push(` * ${pkg.name} v${pkg.version}`);
bannerLines.push(' *');
license.split(/\r?\n/).forEach((line) => {
  bannerLines.push(` * ${line}`);
});
bannerLines.push(' */');

const banner = bannerLines.join('\n');
const errors = fs.readFileSync(path.resolve('./errors.json'), 'utf-8');

export default {
  input: 'src/index.js',
  plugins: [
    replace({
      delimiters: ["'", "'"],
      values: {
        ERRORS: errors,
      },
    }),
    babel({
      babelrc: false,
      plugins: [
        [
          'transform-object-rest-spread',
          { useBuiltIns: true },
        ],
      ],
    }),
  ],
  output: [
    {
      file: 'build/index.js',
      format: 'cjs',
      sourcemap: true,
      banner,
    },
    {
      file: 'build/index.es.js',
      format: 'es',
      sourcemap: true,
      banner,
    },
  ],
};
