import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: {
    entry: ['src/configs/index.ts'],
    resolve: true
  },
  entry: ['src/index.ts'],
  format: ['esm'],
  minify: true,
  outDir: 'dist'
});
