/*
 * @Author: xiaoHao
 */

import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import commonjs from 'vite-plugin-commonjs';
export default defineConfig({
  plugins: [vue(), vueJsx(), commonjs()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  define: { 'process.env': {} },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.59',//开发
        //target: 'http://124.223.101.232',//开发

        //target: 'www.bdncn.cn',//online

        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""), //地址重写
      },
      '/store': {
        // target: 'http://192.168.1.59',//开发
        target: 'http://124.223.101.232',//开发
        //target: 'www.bdncn.cn',//online
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jss/, ""), //地址重写
      },
    },
    port: 8088, // 访问端口号
    host: '0.0.0.0', // 配置项目可以局域网访问
    cors: true, // 默认启用并允许任何源
  },
  css: {
    /* CSS 预处理器 */
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/css/variables.scss";'
      }
    }
  },
});
