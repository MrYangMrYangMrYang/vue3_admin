/**
 * @fileoverview Pinia 状态管理入口文件
 * @description 创建并配置 Pinia 实例，注册持久化插件，统一导出所有 Store 模块
 * @author Vue3 Big Event Admin Team
 * @version 1.1.0
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
 *             └─ useUserStore (用户认证)
 * ```
 *
 * @see {@link module:@/stores/modules/user} 用户状态管理文档
 */

import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

/**
 * Pinia 状态管理实例
 * @description 全局唯一的 Pinia 实例，包含持久化插件
 */
const pinia = createPinia()

/**
 * 注册数据持久化插件
 * @description 为 Pinia 启用 localStorage 自动存储功能
 *
 * @remarks
 * **工作原理：**
 * 1. 检测 Store 配置中的 `persist: true` 选项
 * 2. 自动将 state 序列化为 JSON 存储到 localStorage
 * 3. 页面刷新时自动从 localStorage 恢复状态
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
 */
pinia.use(persist)

export default pinia

// ==================== Store 模块统一导出 ====================

/**
 * 用户状态管理 Store
 * @description 处理用户认证、Token 管理、个人信息等核心功能
 *
 * @see {@link module:./modules/user} 完整 API 文档
 */
export * from './modules/user'
