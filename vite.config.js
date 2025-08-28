import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      less: {}
    }
  },
  server: {
    port: 1024,
    hmr: true,
    proxy: {
      // 代理 /auth 请求
      '/auth': {
        target: 'http://39.105.113.157:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, '/auth')
      },
      // ✅ 重点：代理 /cloud 请求
      '/cloud': {
        target: 'http://39.105.113.157:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cloud/, '/cloud')
      },
      // 备用代理：/api → 转发并去掉 /api 前缀
      '/api': {
        target: 'http://39.105.113.157:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})