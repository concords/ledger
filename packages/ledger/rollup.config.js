import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
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
      }),
    ],
    output: [
      { file: pkg.main, format: 'cjs', exports: 'default' },
      { file: pkg.module, format: 'es' },
      { file: 'dist/concords-ledger.js', format: 'iife', name: 'Ledger', exports: 'default' },
      { file: 'dist/concords-ledger.min.js', format: 'iife', name: 'Ledger', exports: 'default', plugins: [terser()] }
    ]
  }
]