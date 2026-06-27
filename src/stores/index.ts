/**
 * @fileoverview Pinia 状态管理入口：创建实例 + 注册持久化插件 + 统一导出 Store 模块
 */

import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 启用 localStorage 持久化：检测 Store 配置中的 persist: true，自动序列化/恢复 state
pinia.use(persist)

export default pinia

export * from './modules/user'
