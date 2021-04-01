import path from 'path';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * @type {import('vite').UserConfig}
 */
export default {
  alias: {
    '@concords/core': path.resolve(__dirname, '../core'),
    '@concords/vue-kit': path.resolve(__dirname, '../vue-kit')
  },
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        "background_color": "#ffffff",
        "theme_color": "#2F4858",
        "name": "Concords",
        "short_name": "Concords",
        "display": "standalone",
        "start_url": "/",
        "icons": [
          {
            "src": "icon-152x152.png",
            "sizes": "152x152",
            "type": "image/png"
          },
          {
            "src": "icon-152x152.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      },
    })
  ],
}
