import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  // external: ['reflect-metadata'],
  plugins: [
    resolve(),
    json(),
    terser(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
};
