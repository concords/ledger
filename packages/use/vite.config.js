import path from 'path';
import vue from '@vitejs/plugin-vue'

/**
 * @type {import('vite').UserConfig}
 */
export default {
  alias: {
    '@teamconcords/core': path.resolve(__dirname, '../core')
  },
  plugins: [vue()]
}
