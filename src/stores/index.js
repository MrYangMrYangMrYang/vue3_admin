// pinia 独立维护
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
// pinia持久化
pinia.use(persist)

export default pinia

// Pinia 仓库统一管理
// 接收所有子模块的按需导出
export * from './modules/user'
export * from './modules/counter'

// import { useUserStore } from './modules/user'
// export { useUserStore }
// import { useCountStore } from './modules/counter'
// export { useCountStore }
