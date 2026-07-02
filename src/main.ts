/**
 * @fileoverview Vue 应用入口：创建应用实例 + 注册 Pinia/Router + 挂载全局错误处理器
 */

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './stores'

import '@/styles/main.scss'

// Element Plus 暗色主题 CSS 变量：提供 html.dark 作用域下的组件暗色变量覆盖
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

// 全局错误处理器：捕获未被 ErrorBoundary 拦截的组件级错误（渲染、生命周期、事件处理）
// 开发环境输出结构化日志便于调试；生产环境可在此接入错误上报服务（Sentry / 自建埋点）
app.config.errorHandler = (err, _instance, info) => {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error('[全局错误]', info, err)
  }
}

app.use(pinia)
app.use(router)

app.mount('#app')
