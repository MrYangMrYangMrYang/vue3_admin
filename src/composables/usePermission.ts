/**
 * @fileoverview usePermission 权限检查 Composable
 * @description 在 <script setup> 中使用权限检查的响应式封装
 * @version 1.0.0
 *
 * @example
 * ```typescript
 * const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission()
 * if (hasPermission('article:delete')) { ... }
 * ```
 */

import { usePermissionStore } from '@/stores'
import type { PermissionCode } from '@/types'

export function usePermission() {
  const store = usePermissionStore()

  return {
    /** 当前用户权限码列表 */
    permissions: store.permissions,
    /** 是否为超级管理员 */
    isAdmin: store.isAdmin,
    /** 检查是否拥有某个权限 */
    hasPermission: (code: PermissionCode) => store.hasPermission(code),
    /** 检查是否拥有任一权限（OR） */
    hasAnyPermission: (...codes: PermissionCode[]) =>
      store.hasAnyPermission(...codes),
    /** 检查是否拥有全部权限（AND） */
    hasAllPermissions: (...codes: PermissionCode[]) =>
      store.hasAllPermissions(...codes)
  }
}
