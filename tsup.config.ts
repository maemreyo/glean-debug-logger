import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: false,
  clean: true,
  minify: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  platform: 'browser',
  target: 'ES2020',
  esbuildOptions: (options) => {
    options.banner = {
      js: '// @ts-nocheck',
    };
  },
});
