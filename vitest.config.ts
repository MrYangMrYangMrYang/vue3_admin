/**
 * @fileoverview Vitest 测试框架配置文件
 * @description 配置单元测试环境、覆盖率收集与路径别名
 * @version 1.0.0
 */

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // Vue 插件：支持 .vue 单文件组件测试
  plugins: [vue()],

  /**
   * 测试配置
   * @description 使用 jsdom 提供浏览器 DOM 环境，启用全局 API（describe/it/expect 无需 import）
   */
  test: {
    // 测试环境：jsdom 提供 localStorage / window / document 等 DOM API
    environment: 'jsdom',

    // 启用全局 API，测试文件无需手动 import { describe, it, expect }
    globals: true,

    // 覆盖 .ts 和 .vue 测试文件
    include: ['src/**/*.{test,spec}.{ts,vue}'],

    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // 统计所有源文件覆盖率（true），而非仅统计被测试导入的文件（false）
      all: true,
      // 覆盖率门槛：仅应用于核心逻辑层
      // 页面/组件层由 Playwright E2E 测试覆盖，不计入单元测试阈值
      thresholds: {
        lines: 40,
        functions: 40,
        branches: 35,
        statements: 40
      },
      // 排除不需要统计覆盖率的文件
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.*',
        '**/*.d.ts',
        'src/main.ts',
        'env.d.ts',
        'src/vite-env.d.ts',
        'src/types/**',
        // 以下由 E2E 测试覆盖，不纳入单元测试覆盖率阈值
        'src/views/**',
        'src/components/**'
      ]
    }
  },

  // 路径别名：与 vite.config.ts 保持一致，测试中可用 '@/xxx'
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
