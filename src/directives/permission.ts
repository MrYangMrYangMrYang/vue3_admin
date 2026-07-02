/**
 * @fileoverview v-permission 自定义指令
 * @description 根据用户权限控制 DOM 元素的显示/移除
 * @version 1.0.0
 *
 * @example
 * ```html
 * <!-- 单一权限 -->
 * <el-button v-permission="'article:delete'">删除</el-button>
 *
 * <!-- 任一权限（OR 逻辑）：argument = 'any' -->
 * <el-button v-permission:any="['article:create', 'article:edit']">编辑</el-button>
 *
 * <!-- 全部权限（AND 逻辑）：argument = 'all' -->
 * <el-button v-permission:all="['admin:access', 'article:delete']">批量删除</el-button>
 * ```
 */

import type { Directive, DirectiveBinding } from 'vue'
import { usePermissionStore } from '@/stores'
import type { PermissionCode } from '@/types'

/** 指令挂载/更新时的回调 */
const checkPermission = (el: HTMLElement, binding: DirectiveBinding): void => {
  const store = usePermissionStore()
  const { value, arg } = binding

  // 空值视为允许（不做权限控制）
  if (!value) return

  let allowed = false

  if (Array.isArray(value)) {
    // 数组模式：arg 决定 OR/AND 逻辑，默认 OR
    if (arg === 'all') {
      allowed = store.hasAllPermissions(...(value as PermissionCode[]))
    } else {
      allowed = store.hasAnyPermission(...(value as PermissionCode[]))
    }
  } else {
    // 单一权限码
    allowed = store.hasPermission(value as PermissionCode)
  }

  if (!allowed) {
    el.parentNode?.removeChild(el)
  }
}

/**
 * v-permission 指令
 *
 * @remarks
 * - 无权限时调用 el.parentNode.removeChild(el) 从 DOM 中移除元素
 * - 使用 removeChild 而非 display:none，避免占用布局空间，且无法通过 DevTools 恢复
 * - 权限数据来自 usePermissionStore，响应式更新由 store 驱动
 */
const vPermission: Directive<HTMLElement, PermissionCode | PermissionCode[]> = {
  mounted(el, binding) {
    checkPermission(el, binding)
  },
  updated(el, binding) {
    // 仅在值变化时重新检查（防止重复移除已删除的节点）
    if (binding.value !== binding.oldValue) {
      checkPermission(el, binding)
    }
  }
}

export default vPermission
