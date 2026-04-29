/**
 * @fileoverview 用户模块 API 接口
 * @description 封装所有与用户相关的后端 API 请求（注册、登录、信息管理等）
 * @author Vue3 Big Event Admin Team
 * @version 1.0.0
 *
 * @remarks
 * 本模块包含以下功能：
 * - 用户注册（POST /api/reg）
 * - 用户登录（POST /api/login）
 * - 获取用户信息（GET /my/userinfo）
 * - 更新用户信息（PUT /my/userinfo）
 * - 更新用户头像（PATCH /my/update/avatar）
 * - 修改密码（PATCH /my/updatepwd）
 *
 * 所有接口均使用统一的 axios 实例（@/utils/request），
 * 自动处理 Token 认证和错误响应。
 *
 * @example
 * ```typescript
 * import { userLoginService, userGetInfoService } from '@/api/user'
 *
 * // 登录
 * const res = await userLoginService({ username: 'admin', password: '123456' })
 * const token = res.data.data.token
 *
 * // 获取用户信息
 * const userInfo = await userGetInfoService()
 * console.log(userInfo.data.data.nickname)
 * ```
 */

import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type {
  RegisterData,
  LoginData,
  UpdateUserInfoData,
  UpdatePasswordData,
  ApiResponse,
  UserInfo,
  LoginResponseData
} from '@/types'

// ==================== 认证相关 ====================

/**
 * 用户注册服务
 * @description 向后端提交新用户注册请求
 *
 * @param {RegisterData} data - 注册表单数据
 * @param {string} data.username - 用户名（2-10个非空字符）
 * @param {string} data.password - 密码（6-15个非空字符）
 * @param {string} data.repassword - 确认密码
 *
 * @returns {Promise<AxiosResponse<ApiResponse<null>>>} 注册结果（成功时 data 为 null）
 *
 * @throws {Error} 用户名已存在、密码格式不正确等业务错误
 *
 * @example
 * ```typescript
 * try {
 *   const res = await userRegisterService({
 *     username: 'newuser',
 *     password: '123456',
 *     repassword: '123456'
 *   })
 *   console.log('注册成功')
 * } catch (err) {
 *   // 处理注册失败（如用户名已存在）
 * }
 * ```
 *
 * @see {@link https://apifox.com/apidoc/xxx} API 文档链接（如有）
 */
export const userRegisterService = (
  data: RegisterData
): Promise<AxiosResponse<ApiResponse<null>>> =>
  request.post('/api/reg', data)

/**
 * 用户登录服务
 * @description 验证用户凭证并返回 JWT Token
 *
 * @param {LoginData} data - 登录表单数据
 * @param {string} data.username - 登录用户名
 * @param {string} data.password - 登录密码
 *
 * @returns {Promise<AxiosResponse<ApiResponse<LoginResponseData>>>}
 * 包含 JWT Token 的响应对象
 *
 * @throws {Error} 用户名或密码错误、账号被禁用等
 *
 * @example
 * ```typescript
 * const res = await userLoginService({
 *   username: 'admin',
 *   password: '123456'
 * })
 *
 * // 提取 Token 并存储到 Pinia Store
 * const token = res.data.data.token
 * userStore.setToken(token)
 * ```
 */
export const userLoginService = (
  data: LoginData
): Promise<AxiosResponse<ApiResponse<LoginResponseData>>> =>
  request.post('/api/login', data)

// ==================== 用户信息管理 ====================

/**
 * 获取当前登录用户信息
 * @description 从后端获取用户的个人资料（需携带有效 Token）
 *
 * @returns {Promise<AxiosResponse<ApiResponse<UserInfo>>>}
 * 包含用户详细信息的响应（id, username, nickname, email, user_pic）
 *
 * @throws {Error} 未登录或 Token 过期（401）
 *
 * @example
 * ```typescript
 * const res = await userGetInfoService()
 * const { nickname, email, avatar } = res.data.data
 * ```
 */
export const userGetInfoService = (): Promise<
  AxiosResponse<ApiResponse<UserInfo>>
> => request.get('/my/userinfo')

/**
 * 更新用户基本信息
 * @description 修改当前用户的昵称和邮箱（不可修改用户名）
 *
 * @param {UpdateUserInfoData} data - 待更新的用户信息
 * @param {number} data.id - 用户 ID
 * @param {string} data.nickname - 新昵称（2-7个字符）
 * @param {string} data.email - 新邮箱地址
 *
 * @returns {Promise<AxiosResponse<ApiResponse<null>>>} 更新结果
 *
 * @throws {Error} 邮箱格式不正确、昵称已被占用等
 *
 * @example
 * ```typescript
 * await userUpdateInfoService({
 *   id: 1,
 *   nickname: '新昵称',
 *   email: 'new@example.com'
 * })
 * ElMessage.success('更新成功')
 * ```
 */
export const userUpdateInfoService = (
  data: UpdateUserInfoData
): Promise<AxiosResponse<ApiResponse<null>>> =>
  request.put('/my/userinfo', data)

// ==================== 头像和密码管理 ====================

/**
 * 更新用户头像
 * @description 上传新的头像图片 URL 到服务器
 *
 * @param {string} avatar - 头像图片的 URL 或 Base64 编码字符串
 *
 * @returns {Promise<AxiosResponse<ApiResponse<null>>>} 上传结果
 *
 * @remarks
 * 注意：此接口仅接受 URL 字符串，文件上传通常由前端直接上传到 OSS/COS。
 *
 * @example
 * ```typescript
 * // 假设已通过其他方式获取到图片 URL
 * await userUpdateAvatarService('https://cdn.example.com/avatar.jpg')
 * ElMessage.success('头像更新成功')
 * ```
 */
export const userUpdateAvatarService = (
  avatar: string
): Promise<AxiosResponse<ApiResponse<null>>> =>
  request.patch('/my/update/avatar', { avatar })

/**
 * 修改用户密码
 * @description 验证旧密码并设置新密码
 *
 * @param {UpdatePasswordData} data - 密码修改表单
 * @param {string} data.old_pwd - 当前密码（必须正确）
 * @param {string} data.new_pwd - 新密码（6-15个字符）
 * @param {string} data.re_pwd - 确认新密码
 *
 * @returns {Promise<AxiosResponse<ApiResponse<null>>>} 修改结果
 *
 * @throws {Error} 当前密码错误、新密码格式不正确等
 *
 * @example
 * ```typescript
 * try {
 *   await userUpdatePasswordService({
 *     old_pwd: 'oldpassword123',
 *     new_pwd: 'newpassword456',
 *     re_pwd: 'newpassword456'
 *   })
 *   ElMessage.success('密码修改成功，请重新登录')
 *   router.push('/login')
 * } catch {
 *   ElMessage.error('原密码错误或新密码格式不正确')
 * }
 * ```
 */
export const userUpdatePasswordService = (
  data: UpdatePasswordData
): Promise<AxiosResponse<ApiResponse<null>>> =>
  request.patch('/my/updatepwd', data)
