/**
 * @fileoverview Vite 构建工具配置文件
 * @description 配置 Vue 3 项目的开发服务器、构建选项、插件和路径别名
 * @author Vue3 Big Event Admin Team
 * @version 1.2.0
 * @license MIT
 */

import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// 自动导入插件：自动导入 Vue/Vue-Router/Pinia API 和 Element Plus 组件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 构建优化插件
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

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

  /** 是否为生产环境（仅在 build 时启用压缩与分析插件，避免影响 dev 启动速度） */
  const isProd = mode === 'production'

  return {
    /**
     * 插件配置
     *
     * 生产环境额外启用：
     * - Gzip 压缩（生成 .gz 文件，服务器需配置 gzip_static）
     * - Brotli 压缩（生成 .br 文件，压缩率比 Gzip 高 15-20%，服务器需配置 brotli_static）
     * - 打包体积分析（生成 dist/stats.html，用于可视化分析依赖体积）
     *
     * @see {@link https://github.com/vbenjs/vite-plugin-compression} 压缩插件文档
     * @see {@link https://github.com/btd/rollup-plugin-visualizer} 分析插件文档
     */
    plugins: [
      // Vue 3 单文件组件支持
      vue(),

      // 自动导入 Vue/Vue-Router/Pinia API
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),

      // 自动注册 Element Plus 组件
      Components({
        resolvers: [ElementPlusResolver()]
      }),

      // 生产环境：Gzip 压缩（仅压缩大于 10KB 的文件，避免压缩小文件反而变大）
      isProd &&
        viteCompression({
          verbose: true,
          threshold: 10240,
          algorithm: 'gzip',
          ext: '.gz',
          deleteOriginFile: false
        }),

      // 生产环境：Brotli 压缩（压缩率更高，现代浏览器均支持）
      isProd &&
        viteCompression({
          verbose: true,
          threshold: 10240,
          algorithm: 'brotliCompress',
          ext: '.br',
          deleteOriginFile: false
        }),

      // 生产环境：打包体积可视化分析（生成 dist/stats.html）
      isProd &&
        visualizer({
          open: false,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html'
        })
    ].filter(Boolean),

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
    },

    /**
     * 构建配置
     * @description 通过 manualChunks 将第三方依赖分包，优化缓存命中率与首屏加载
     *
     * 分包策略说明：
     * - vendor-vue:      Vue 核心（vue + vue-router + pinia），变更频率极低，长期缓存
     * - vendor-element:  Element Plus UI 库，体积大但稳定，独立缓存
     * - vendor-gsap:     GSAP 动画库，仅登录页使用，按需加载
     * - vendor-quill:    VueQuill 富文本编辑器，仅文章编辑使用，按需加载
     * - vendor-axios:    HTTP 客户端，体积小但独立缓存
     *
     * 收益：业务代码变更时，第三方库 chunk 不会失效，用户刷新无需重新下载
     */
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router', 'pinia'],
            'vendor-element': ['element-plus', '@element-plus/icons-vue'],
            'vendor-gsap': ['gsap'],
            'vendor-quill': ['@vueup/vue-quill'],
            'vendor-axios': ['axios']
          }
        }
      }
    }
  }
})
