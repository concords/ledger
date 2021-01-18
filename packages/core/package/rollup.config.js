import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'dist/index.js',
  extensions: [ '.js', '.ts' ],
  output: {
    file: 'dist/build/bundle.js',
    format: 'cjs'
  },
  plugins: [
    nodeResolve({
      extensions: ['.js', '.ts']
    })
  ]
};