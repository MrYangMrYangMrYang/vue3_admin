/**
 * @fileoverview 用户模块 API（注册、登录、信息/头像/密码管理）
 */

import request from '@/utils/request'
import type {
  RegisterData,
  LoginData,
  UpdateUserInfoData,
  UpdatePasswordData,
  ApiResponse,
  UserInfo,
  LoginResponseData
} from '@/types'

/**
 * 用户注册服务
 * @param data 注册表单数据（username, password, repassword）
 * @returns 注册结果（成功时 data 为 null）
 */
export const userRegisterService = (
  data: RegisterData
): Promise<ApiResponse<null>> => request.post('/api/reg', data)

/**
 * 用户登录服务
 * @param data 登录表单数据（username, password）
 * @returns 包含 JWT Token 的响应对象
 */
export const userLoginService = (
  data: LoginData
): Promise<ApiResponse<LoginResponseData>> => request.post('/api/login', data)

/**
 * 获取当前登录用户信息
 * @returns 包含用户详细信息（id, username, nickname, email, user_pic）
 */
export const userGetInfoService = (): Promise<ApiResponse<UserInfo>> =>
  request.get('/my/userinfo')

/**
 * 更新用户基本信息（昵称、邮箱，不可修改用户名）
 * @param data 待更新的用户信息（id, nickname, email）
 */
export const userUpdateInfoService = (
  data: UpdateUserInfoData
): Promise<ApiResponse<null>> => request.put('/my/userinfo', data)

/**
 * 更新用户头像
 * @remarks 此接口仅接受 URL 字符串，文件上传通常由前端直接上传到 OSS/COS
 * @param avatar 头像图片的 URL 或 Base64 编码字符串
 */
export const userUpdateAvatarService = (
  avatar: string
): Promise<ApiResponse<null>> => request.patch('/my/update/avatar', { avatar })

/**
 * 修改用户密码
 * @param data 密码修改表单（old_pwd, new_pwd, re_pwd）
 */
export const userUpdatePasswordService = (
  data: UpdatePasswordData
): Promise<ApiResponse<null>> => request.patch('/my/updatepwd', data)
