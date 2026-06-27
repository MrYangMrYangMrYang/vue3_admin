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

    // 包含测试文件的 glob 模式
    include: ['src/**/*.{test,spec}.ts'],

    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // 只统计被测试导入的文件，避免未测试文件拉低整体覆盖率
      all: false,
      // 覆盖率门槛：核心逻辑覆盖率 ≥ 80%
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
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
        'src/types/**'
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
