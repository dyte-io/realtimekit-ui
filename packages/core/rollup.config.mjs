import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'dist/esm/loader.js',
  output: [
    {
      inlineDynamicImports: true,
      file: 'dist/esm/loader.js',
      format: 'esm',
    },
    {
      inlineDynamicImports: true,
      file: 'dist/browser.js',
      name: 'RtkUiKit',
      format: 'iife',
      plugins: [terser()],
    },
  ],
  plugins: [commonjs(), nodeResolve()],
};
