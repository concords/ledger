import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json'

export default [
  {
    input: 'src/index.ts',
    plugins: [
      resolve({
        extensions: ['.js', '.ts'],
        modulesOnly: true
      }),
      typescript(),
      babel({
        presets: [
          "@babel/preset-flow"
        ],
        runtimeHelpers: true,
        extensions: ['.js', '.ts']
      })
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
      { file: 'dist/build/concords-identity.js', format: 'iife', name: "Identity" }
    ]
  }
]