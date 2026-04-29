/**
 * @fileoverview ESLint 扁平配置文件（ESLint Flat Config）
 * @description 配置 Vue 3 + TypeScript 项目的代码质量检查规则、Prettier 格式化和全局变量
 * @author Vue3 Big Event Admin Team
 * @version 1.0.0
 *
 * @remarks
 * 本配置文件负责：
 * - JavaScript/TypeScript/Vue 文件的语法检查
 * - Vue 组件的最佳实践规则
 * - Prettier 格式化集成（保存时自动修复）
 * - Element Plus 全局组件声明（避免未定义错误）
 *
 * @see {@link https://eslint.org/docs/latest/use/configure/configuration-files-new} ESLint Flat Config 文档
 */

import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import configPrettier from '@vue/eslint-config-prettier'

export default defineConfig([
  // ==================== 1. 文件匹配范围 ====================
  {
    name: 'app/files-to-lint',
    /** 匹配需要检查的文件类型 */
    files: ['**/*.{js,mjs,jsx,ts,tsx,vue}']
  },

  // ==================== 2. 全局忽略目录 ====================
  globalIgnores([
    /** 构建输出目录（由 Vite 生成） */
    '**/dist/**',
    /** SSR 构建输出 */
    '**/dist-ssr/**',
    /** 测试覆盖率报告 */
    '**/coverage/**'
  ]),

  // ==================== 3. 全局变量声明 ====================
  {
    languageOptions: {
      globals: {
        /** 浏览器环境全局变量（window, document 等） */
        ...globals.browser,
        /**
         * Element Plus 消息提示组件（自动导入，无需手动 import）
         * @type {readonly}
         */
        ElMessage: 'readonly',
        /**
         * Element Plus 消息弹框组件（自动导入，无需手动 import）
         * @type {readonly}
         */
        ElMessageBox: 'readonly',
        /**
         * Element Plus 加载指令组件（自动导入，无需手动 import）
         * @type {readonly}
         */
        ElLoading: 'readonly'
      }
    }
  },

  // ==================== 4. TypeScript 配置 ====================
  ...tseslint.configs.recommended,

  // ==================== 5. 插件规则继承 ====================
  ...pluginVue.configs['flat/essential'],
  js.configs.recommended,

  // ==================== 6. 自定义规则配置 ====================
  {
    rules: {
      /* ---------- Vue 相关规则 ---------- */

      /**
       * Vue 组件名称必须为多单词组合
       * @rule vue/multi-word-component-names
       * @param {'warn'} severity - 警告级别
       * @param {Object} options - 规则选项
       * @param {string[]} options.ignores - 忽略的组件名列表
       */
      'vue/multi-word-component-names': [
        'warn',
        {
          /** 忽略 index.vue 等特殊组件名 */
          ignores: ['index']
        }
      ],

      /**
       * 允许 props 解构（Vue 3.3+ 支持）
       * @rule vue/no-setup-props-destructure
       */
      'vue/no-setup-props-destructure': ['off'],

      /* ---------- JavaScript 相关规则 ---------- */

      /** 禁止使用未定义的变量 */
      'no-undef': 'error',

      /** 未使用的变量显示警告（不阻塞构建） */
      'no-unused-vars': 'warn',

      /** 使用 console 显示警告（生产环境应移除） */
      'no-console': 'warn',

      /** 建议使用 const 而非 let（不可变优先） */
      'prefer-const': 'error',

      /* ---------- TypeScript 相关规则 ---------- */

      /**
       * 允许隐式 any 类型（开发阶段可放宽）
       * 生产环境建议改为 'error'
       */
      '@typescript-eslint/no-explicit-any': ['warn'],

      /**
       * 未使用的 TypeScript 变量显示警告
       */
      '@typescript-eslint/no-unused-vars': ['warn'],

      /* ---------- Prettier 格式化规则 ---------- */

      /**
       * Prettier 格式化问题显示为警告
       * 需配合 VS Code 的 "保存时运行 linter" 设置
       *
       * @requires
       * - 安装 ESLint 插件
       * - 关闭 VS Code 的 formatOnSave
       * - 启用 codeActionsOnSave.source.fixAll
       */
      'prettier/prettier': 'warn'
    }
  },

  // ==================== 7. Prettier 冲突禁用 ====================
  /**
   * 必须放在最后！
   * 禁用所有与 Prettier 冲突的格式化规则（如缩进、引号等）
   */
  configPrettier
])
