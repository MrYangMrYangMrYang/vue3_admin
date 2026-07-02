/**
 * @fileoverview 权限状态管理（Pinia Store）
 * @description 管理当前用户的权限码列表，提供 hasPermission / hasRole 等检查方法
 * @version 1.0.0
 *
 * @remarks
 * - 权限数据不持久化（每次刷新从 /my/userinfo 重新获取）
 * - 支持通配符 `*` = 所有权限
 * - removeToken 时自动清空权限
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PermissionCode } from '@/types'

export const usePermissionStore = defineStore('permission', () => {
  /** 当前用户的权限码平铺数组 */
  const permissions = ref<PermissionCode[]>([])

  /** 设置权限码列表（登录后或 getUser 成功后调用） */
  const setPermissions = (perms: PermissionCode[]): void => {
    permissions.value = perms
  }

  /** 清空权限（退出登录时调用） */
  const clearPermissions = (): void => {
    permissions.value = []
  }

  /** 是否拥有超级管理员权限 */
  const isAdmin = computed(() => permissions.value.includes('*'))

  /**
   * 检查是否拥有某个权限
   * @param code - 权限码（如 article:create）
   * @returns true 表示拥有该权限
   *
   * @remarks
   * 超级管理员 (permissions 含 '*') 对所有权限码返回 true
   */
  const hasPermission = (code: PermissionCode): boolean => {
    return isAdmin.value || permissions.value.includes(code)
  }

  /**
   * 检查是否拥有任一权限（OR 逻辑）
   * @param codes - 权限码列表
   */
  const hasAnyPermission = (...codes: PermissionCode[]): boolean => {
    if (isAdmin.value) return true
    return codes.some((code) => permissions.value.includes(code))
  }

  /**
   * 检查是否拥有全部权限（AND 逻辑）
   * @param codes - 权限码列表
   */
  const hasAllPermissions = (...codes: PermissionCode[]): boolean => {
    if (isAdmin.value) return true
    return codes.every((code) => permissions.value.includes(code))
  }

  return {
    permissions,
    isAdmin,
    setPermissions,
    clearPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  }
})
