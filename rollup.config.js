import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
// @ts-expect-error, there is not such @types/rollup-plugin-uglify package
//                   add it back when it is available
import { uglify } from 'rollup-plugin-uglify';

/** @type {import("rollup").RollupOptions} */
export default {
  input: './src/index.ts',
  output: {
    compact: true,
    file: './dist/index.js',
    format: 'esm',
    sourcemap: false
  },
  plugins: [json(), typescript(), uglify()],
  external: ['chalk', 'change-case', 'command-line-args']
};
