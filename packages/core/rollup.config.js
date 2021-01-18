import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'dist/index.js',
    output: {
      name: 'core.umd.js',
      file: 'builds/core.umd.js',
      format: 'umd'
    },
    plugins: [
      nodeResolve({
        extensions: ['.js', '.ts']
      })
    ]
  },
  {
    input: 'dist/index.js',
    output: {
      name: 'core.esm.js',
      file: 'builds/core.esm.js',
      format: 'esm'
    },
    plugins: [
      nodeResolve({
        extensions: ['.js', '.ts']
      })
    ]
  }
];