/**
 * @fileoverview Vue 应用入口文件
 * @description 应用程序的启动入口，负责初始化 Vue 实例并挂载全局插件
 * @author Vue3 Big Event Admin Team
 * @version 1.0.0
 *
 * @remarks
 * 初始化顺序：
 * 1. 创建 Vue 应用实例 (createApp)
 * 2. 注册 Pinia 状态管理插件
 * 3. 注册 Vue Router 路由插件
 * 4. 导入全局样式（Element Plus 变量覆盖）
 * 5. 挂载应用到 DOM (#app)
 */

import { createApp } from 'vue'

/** 根组件（包含 <router-view>） */
import App from './App.vue'

/** 路由实例（含导航守卫） */
import router from './router'

/** Pinia 状态管理实例（含持久化插件） */
import pinia from './stores'

/**
 * 全局样式导入
 * @description 包含：
 * - Element Plus 主题变量自定义
 * - 全局 CSS 重置
 * - 通用工具类
 * - 项目级样式变量
 */
import '@/assets/main.scss'

/**
 * 创建 Vue 应用实例
 * @type {App<Element>}
 * @description 使用根组件 App.vue 创建应用
 */
const app = createApp(App)

/**
 * 注册 Pinia 插件
 * @description 启用响应式状态管理和数据持久化
 *
 * @see {@link module:@/stores} Store 模块文档
 */
app.use(pinia)

/**
 * 注册 Vue Router 插件
 * @description 启用基于 URL 的组件渲染和导航功能
 *
 * @see {@link module:@/router} 路由配置文档
 */
app.use(router)

/**
 * 挂载应用
 * @description 将 Vue 实例挂载到 index.html 中的 #app 元素
 * 触发应用生命周期钩子的执行（onMounted 等）
 */
app.mount('#app')
