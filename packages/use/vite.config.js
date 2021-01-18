import path from 'path';

/**
 * @type {import('vite').UserConfig}
 */
export default {
  alias: {
    '@teamconcords/core': path.resolve(__dirname, '../core')
  },
  build: {
    rollupOptions: {
      lib: {
        entry: path.resolve(__dirname, '../core'),
        name: '@teamconcords/core'
      },
    }
  }
}
