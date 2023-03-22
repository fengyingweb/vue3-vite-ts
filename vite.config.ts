import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { babel } from '@rollup/plugin-babel'
import { viteMockServe } from 'vite-plugin-mock'
import styleImport, { VantResolve } from 'vite-plugin-style-import'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    babel({
      plugins: [
        [
          '@babel/plugin-transform-react-jsx',
          {
            runtime: 'automatic',
            importSource: '@antv/f2',
          },
        ],
      ],
    }),
    vue(),
    vueJsx(),
    vueSetupExtend(), // 使用script setup语法糖时，设置组件名称用的插件
    viteMockServe(),
    styleImport({
      resolves: [VantResolve()],
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 设置 `@` 指向 `src` 目录
    },
    extensions: ['.js', '.ts', '.vue', '.jsx', '.tsx', '.json']
  },
  base: './', // 设置打包后文件引用路径
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
    cors: true, // 允许跨域
    proxy: {
      '/api/': {
        target: 'http://localhost:3001',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\//, 'api')
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
    minify: 'terser',
    terserOptions: { // 需要把build.minify设置为terser才会生效
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
