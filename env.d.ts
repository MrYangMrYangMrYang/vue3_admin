/**
 * @fileoverview 全局类型声明文件
 * @description 为 Vue 单文件组件、Element Plus 全局组件提供 TypeScript 类型支持
 * @author Vue3 Big Event Admin Team
 * @version 1.0.0
 *
 * @remarks
 * 本文件声明了：
 * - *.vue 文件的模块类型（DefineComponent）
 * - Element Plus 自动导入的全局组件类型（ElMessage, ElMessageBox 等）
 */

/// <reference types="vite/client" />

/**
 * Vue 单文件组件模块声明
 * @description 将 .vue 文件识别为 Vue 组件，提供完整的类型推断
 *
 * @example
 * ```typescript
 * import MyComponent from './MyComponent.vue'
 * // MyComponent 类型为 DefineComponent<object, object, unknown>
 * ```
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

/**
 * Element Plus 全局组件类型声明
 * @description 声明自动导入的 Element Plus 组件，避免 "找不到名称" 错误
 *
 * @global
 * @property {typeof ElMessage} ElMessage - 消息提示组件
 * @property {typeof ElMessageBox} ElMessageBox - 消息弹框组件
 * @property {typeof ElLoading} ElLoading - 加载指令组件
 * @property {typeof ElNotification} ElNotification - 通知组件
 */
declare global {
  const ElMessage: typeof import('element-plus')['ElMessage']
  const ElMessageBox: typeof import('element-plus')['ElMessageBox']
  const ElLoading: typeof import('element-plus')['ElLoading']
  const ElNotification: typeof import('element-plus')['ElNotification']
}

export {}
