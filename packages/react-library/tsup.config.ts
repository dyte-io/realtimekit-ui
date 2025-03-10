import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', '@dytesdk/ui-kit', '@stencil/react-output-target/runtime'],
  target: 'es2015',
});
