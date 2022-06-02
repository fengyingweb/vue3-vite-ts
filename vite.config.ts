import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import styleImport, { VantResolve } from 'vite-plugin-style-import'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteMockServe(),
    styleImport({
      resolves: [VantResolve()],
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 设置 `@` 指向 `src` 目录
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  base: './', // 设置打包路径
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
    cors: true, // 允许跨域
    proxy: {
      '/api/mall': {
        target: 'http://localhost:3001',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/mall/, 'api')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
