/**
 * @fileoverview 角色管理 API 接口
 * @description 角色的增删改查、权限码查询
 */

import request from '@/utils/request'
import type { ApiResponse, Role, RoleFormData, PermissionCode } from '@/types'

/**
 * 获取所有角色列表
 * @returns 角色数组
 */
export const roleGetListService = (): Promise<ApiResponse<Role[]>> =>
  request.get('/admin/roles')

/**
 * 获取所有可用权限码
 * @returns 权限码列表（含 code、label、group）
 */
export const roleGetPermissionsService = (): Promise<
  ApiResponse<{ code: PermissionCode; label: string; group: string }[]>
> => request.get('/admin/permissions')

/**
 * 创建新角色
 * @param data - 角色数据
 */
export const roleCreateService = (
  data: RoleFormData
): Promise<ApiResponse<Role>> => request.post('/admin/roles', data)

/**
 * 更新角色
 * @param id - 角色 ID
 * @param data - 更新的角色数据
 */
export const roleUpdateService = (
  id: number,
  data: Partial<RoleFormData>
): Promise<ApiResponse<null>> => request.put(`/admin/roles/${id}`, data)

/**
 * 删除角色
 * @param id - 角色 ID
 */
export const roleDeleteService = (id: number): Promise<ApiResponse<null>> =>
  request.delete(`/admin/roles/${id}`)
