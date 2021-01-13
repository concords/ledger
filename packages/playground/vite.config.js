import path from 'path';
import vue from '@vitejs/plugin-vue'

/**
 * @type {import('vite').UserConfig}
 */
export default {
  alias: {
    '@teamconcords/use': path.resolve(__dirname, '../use'),
    '@teamconcords/core': path.resolve(__dirname, '../core'),
    '@teamconcords/ui-kit': path.resolve(__dirname, '../ui-kit')
  },
  plugins: [vue()],
  build: {
    rollupOptions: {
      external: ['vue'],
    },
  }
}
