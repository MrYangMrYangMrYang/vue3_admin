/**
 * @fileoverview Vite 构建工具配置文件
 * @description 配置 Vue 3 项目的开发服务器、构建选项、插件和路径别名
 * @author Vue3 Big Event Admin Team
 * @version 1.1.0
 * @license MIT
 */

import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// 自动导入插件：自动导入 Vue/Vue-Router/Pinia API 和 Element Plus 组件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  /**
   * 加载环境变量
   * @description 根据当前 mode 读取对应的 .env 文件
   * - mode='development' → 读取 .env.development
   * - mode='production'  → 读取 .env.production
   *
   * 第三个参数 '' 表示加载所有变量（不限 VITE_ 前缀），便于在配置文件中使用
   */
  const env = loadEnv(mode, process.cwd(), '')

  return {
    /**
     * 插件配置
     * - vue(): Vue 3 单文件组件支持
     * - AutoImport: 自动导入 API（ref, reactive, computed 等）
     * - Components: 自动注册 Element Plus 组件
     */
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],

    /**
     * 基础路径配置
     * @description 优先使用环境变量 VITE_BASE_PATH，默认根路径 '/'
     *
     * 部署到子路径时，在对应 .env 文件中设置：
     * VITE_BASE_PATH=/admin/
     */
    base: env.VITE_BASE_PATH || '/',

    /**
     * 路径别名配置
     * 将 '@' 映射到 './src' 目录，简化模块导入路径
     * 示例: import xxx from '@/components/xxx'
     */
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
