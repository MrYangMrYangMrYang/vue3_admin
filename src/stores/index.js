/**
 * Pinia 状态管理中心
 * 1. 负责 Pinia 实例的创建与初始化
 * 2. 挂载持久化插件 pinia-plugin-persistedstate
 * 3. 统一导出所有的 Store 模块，方便在组件中直接 import { useXxxStore } from '@/stores'
 */
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 使用持久化插件
pinia.use(persist)

export default pinia

// 导出所有子仓库模块，实现统一入口管理
export * from './modules/user'
export * from './modules/counter'
