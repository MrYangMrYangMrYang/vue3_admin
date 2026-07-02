/**
 * @fileoverview 自定义指令统一注册入口
 * @description 批量注册全局指令，避免 main.ts 中逐个注册
 */

import type { App } from 'vue'
import vPermission from './permission'

/**
 * 注册所有全局自定义指令
 * @param app - Vue 应用实例
 */
export function registerDirectives(app: App): void {
  app.directive('permission', vPermission)
}
