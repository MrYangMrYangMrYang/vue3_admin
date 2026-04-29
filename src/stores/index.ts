/**
 * @fileoverview Pinia 状态管理入口文件
 * @description 创建并配置 Pinia 实例，注册持久化插件，统一导出所有 Store 模块
 * @author Vue3 Big Event Admin Team
 * @version 1.0.0
 *
 * @remarks
 * 本模块是状态管理的核心入口，负责：
 * - 创建 Pinia 实例（全局唯一）
 * - 注册数据持久化插件（localStorage）
 * - 统一导出所有 Store 模块（便于组件导入）
 *
 * **架构设计：**
 * ```
 * main.ts
 *   └─ app.use(pinia)  ← 导入本文件
 *        │
 *        ├─ 创建 Pinia 实例 + 持久化插件
 *        │
 *        └─ 导出所有 Store 模块：
 *             ├─ useUserStore (用户认证)
 *             └─ useCountStore (计数器示例)
 * ```
 *
 * **使用方式：**
 * ```typescript
 * // 方式1：导入 pinia 实例（用于 main.ts）
 * import pinia from '@/stores'
 * app.use(pinia)
 *
 * // 方式2：直接导入 Store（用于组件）
 * import { useUserStore } from '@/stores'
 * const userStore = useUserStore()
 * ```
 *
 * @see {@link module:@/stores/modules/user} 用户状态管理文档
 * @see {@link module:@/stores/modules/counter} 计数器示例文档
 */

import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

/**
 * Pinia 状态管理实例
 * @description 全局唯一的 Pinia 实例，包含持久化插件
 *
 * @type {Pinia}
 * @property {Function} use - Vue 插件安装方法
 * @property {Object} state - 全局状态树（运行时生成）
 *
 * @remarks
 * - 在 main.ts 中通过 `app.use(pinia)` 安装
 * - 安装后可在任意组件中使用 `useXxxStore()`
 * - 所有子 Store 共享此实例的配置（如持久化）
 */
const pinia = createPinia()

/**
 * 注册数据持久化插件
 * @description 为 Pinia 启用 localStorage 自动存储功能
 *
 * @param {Object} persist - pinia-plugin-persistedstate 插件实例
 *
 * @remarks
 * **工作原理：**
 * 1. 检测 Store 配置中的 `persist: true` 选项
 * 2. 自动将 state 序列化为 JSON 存储到 localStorage
 * 3. 页面刷新时自动从 localStorage 恢复状态
 *
 * **影响范围：**
 * - 仅对配置了 `persist: true` 的 Store 生效
 * - 当前项目：user Store（token 持久化）
 * - counter Store 未启用（演示用，无需持久化）
 *
 * **存储格式：**
 * ```json
 * {
 *   "big-user": {
 *     "token": "eyJhbGciOiJIUzI1NiIs...",
 *     "user": { "id": 1, "username": "admin" }
 *   }
 * }
 * ```
 *
 * @example
 * // 在 user Store 中启用：
 * export const useUserStore = defineStore('big-user', () => {
 *   const token = ref('')
 *   return { token }
 * }, {
 *   persist: true  // ← 自动持久化到 localStorage
 * })
 */
pinia.use(persist)

/**
 * 默认导出 Pinia 实例
 * @description 供 main.ts 中 app.use(pinia) 使用
 *
 * @exports {Pinia} pinia - 配置好的 Pinia 实例
 */
export default pinia

// ==================== Store 模块统一导出 ====================

/**
 * 用户状态管理 Store
 * @description 处理用户认证、Token 管理、个人信息等核心功能
 *
 * @exports {Function} useUserStore - 用户 Store 工厂函数
 *
 * @property {string} token - JWT 认证令牌（持久化）
 * @property {UserInfo} user - 当前登录用户信息
 * @property {Function} setToken - 设置 Token
 * @property {Function} removeToken - 清除 Token
 * @property {Function} getUser - 获取用户信息
 * @property {Function} setUser - 设置用户信息
 *
 * @example
 * ```typescript
 * import { useUserStore } from '@/stores'
 *
 * const userStore = useUserStore()
 *
 * // 登录后保存 Token
 * userStore.setToken(res.data.token)
 *
 * // 获取当前用户名
 * console.log(userStore.user.username)
 * ```
 *
 * @see {@link module:./modules/user} 完整 API 文档
 */
export * from './modules/user'

/**
 * 计数器状态管理 Store（示例）
 * @description 演示 Pinia Composition API 基本用法的学习模块
 *
 * @exports {Function} useCountStore - 计数器 Store 工厂函数
 *
 * @property {number} count - 计数值（初始值 100）
 * @property {Function} add - 增加计数值的方法
 *
 * @example
 * ```typescript
 * import { useCountStore } from '@/stores'
 *
 * const countStore = useCountStore()
 *
 * // 增加计数
 * countStore.add(10)
 * console.log(countStore.count)  // 110
 * ```
 *
 * @see {@link module:./modules/counter} 完整 API 文档
 * @remarks 此模块仅用于演示和学习，非业务功能
 */
export * from './modules/counter'
