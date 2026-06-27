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
 * Vite 自定义环境变量类型声明
 * @description 为以 VITE_ 前缀的自定义环境变量提供 TypeScript 类型支持
 *
 * @remarks
 * 通过 interface 声明合并扩展 vite/client 内置的 ImportMetaEnv 接口，
 * 使 `import.meta.env.VITE_XXX` 在 IDE 中获得类型提示与自动补全。
 */
interface ImportMetaEnv {
  /** API 基础地址（后端服务地址），见 .env.development / .env.production */
  readonly VITE_API_BASE_URL: string
  /** 应用部署基础路径（默认 '/'，部署到子路径时配置，如 '/admin/'） */
  readonly VITE_BASE_PATH: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv
}

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
  const ElMessage: (typeof import('element-plus'))['ElMessage']
  const ElMessageBox: (typeof import('element-plus'))['ElMessageBox']
  const ElLoading: (typeof import('element-plus'))['ElLoading']
  const ElNotification: (typeof import('element-plus'))['ElNotification']
}

export {}
