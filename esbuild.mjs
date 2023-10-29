import * as esbuild from 'esbuild'
import {dTSPathAliasPlugin} from 'esbuild-plugin-d-ts-path-alias';

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  outfile: './build/signal.js',

  logLevel: 'info',
  platform: 'browser',
  target: 'es2018',
  format: 'esm',

  minify: true,
  treeShaking: true,
  sourcemap: true,
  // sourcesContent: true,
  bundle: true,
  charset: 'utf8',
  legalComments: 'none',
  metafile: true,

  plugins: [dTSPathAliasPlugin({
    outputPath: './build/',
  })]
})