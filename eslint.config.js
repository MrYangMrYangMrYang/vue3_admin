import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import configPrettier from '@vue/eslint-config-prettier'
// defineConfig: ESLint 扁平配置的包装函数
// globalIgnores: 全局忽略模式配置
// globals: 提供各种环境的全局变量定义
// js: 官方 JavaScript 规则
// pluginVue: Vue.js 语法规则插件
// configPrettier: 禁用与 Prettier 冲突的 ESLint 规则

// 导出基础的配置结构
export default defineConfig([
  // 配置数组，按顺序应用

  // 1.文件匹配范围
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'] // 匹配所有 JS 和 Vue 文件
  },

  // 2.全局忽略目录
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']), // 忽略构建输出和测试覆盖率目录

  // 3.全局变量配置
  {
    languageOptions: {
      globals: {
        // 浏览器环境全局变量
        ...globals.browser,
        // 声明element库中 EIMessage 组件的全局变量名，避免在vscode中报错
        ElMessage: 'readonly',
        ElMessageBox: 'readonly',
        ElLoading: 'readonly'
      }
    }
  },

  // 4.插件规则继承
  ...pluginVue.configs['flat/essential'], // Vue.js 基础规则
  js.configs.recommended, // JavaScript 推荐规则

  // 5.自定义规则配置
  {
    rules: {
      // (1)自定义eslint规则
      // Vue 相关规则
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index'] // vue组件名称多单词组成（忽略index.vue）
        }
      ],
      'vue/no-setup-props-destructure': ['off'], // 关闭 props 解构的校验

      // JavaScript 相关规则
      'no-undef': 'error', // 未定义变量错误提示
      'no-unused-vars': 'warn', // 未使用变量警告
      'no-console': 'warn', // 使用 console 警告
      'prefer-const': 'error', // 建议使用 const

      // (2)自定义prettier规则 (格式化工具:专注于代码的美观度)
      // 前置条件：禁用格式化插件 prettier、vs配置中的formatOnSave属性要关闭、安装Eslint插件, 并配置保存时自动修复
      'prettier/prettier': 'warn' // Prettier 格式化问题显示为警告
    }
  },

  // 6.配置顺序说明
  configPrettier // 必须在最后，禁用与 Prettier 冲突的规则
])
