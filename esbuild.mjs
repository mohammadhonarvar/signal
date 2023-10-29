import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['./dist/index.js'],
  outfile: './build/signal.js',

  logLevel: 'info',
  platform: 'browser',
  target: 'es2018',
  format: 'esm',

  minify: true,
  treeShaking: true,
  sourcemap: true,
  sourcesContent: true,
  bundle: true,
  charset: 'utf8',
  legalComments: 'none',
  metafile: true,
})