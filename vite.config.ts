import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Hanko registers <hanko-auth>, <hanko-login>, etc. as native
          // Web Components — tell Vue not to try resolving them.
          isCustomElement: (tag) => tag.startsWith('hanko-'),
        },
      },
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'styled-system': fileURLToPath(new URL('./styled-system', import.meta.url)),
    },
  },
})
