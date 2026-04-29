/**
 * @fileoverview 用户状态管理模块（Pinia Store）
 * @description 管理用户的认证状态、Token 和个人信息
 * @author Vue3 Big Event Admin Team
 * @version 1.0.0
 *
 * @remarks
 * 本模块使用 Pinia 的 Composition API 风格定义用户状态管理：
 *
 * **核心功能：**
 * - Token 管理：存储、清除 JWT Token
 * - 用户信息：获取、更新当前登录用户资料
 * - 数据持久化：自动保存到 localStorage（刷新不丢失）
 *
 * **使用方式：**
 * ```typescript
 * import { useUserStore } from '@/stores'
 *
 * const userStore = useUserStore()
 *
 * // 设置 Token（登录后）
 * userStore.setToken('jwt-token-xxx')
 *
 * // 获取用户信息
 * await userStore.getUser()
 * console.log(userStore.user.nickname)
 *
 * // 退出登录
 * userStore.removeToken()
 * ```
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '../../api/user'
import type { UserInfo } from '@/types'

/**
 * 用户状态管理 Store
 * @description 使用 Composition API 定义的用户状态仓库
 *
 * @property {string} token - JWT 认证令牌（持久化存储）
 * @property {UserInfo} user - 当前用户信息对象
 * @property {Function} setToken - 设置 Token 方法
 * @property {Function} removeToken - 清除 Token 方法
 * @property {Function} getUser - 从服务器获取用户信息
 * @property {Function} setUser - 手动设置用户信息
 */
export const useUserStore = defineStore(
  /** Store 唯一标识符 */
  'big-user',

  /**
   * Setup 函数（Composition API 风格）
   * @returns {Object} 状态和方法的集合
   */
  () => {
    // ==================== State（响应式状态） ====================

    /**
     * JWT Token 状态
     * @type {Ref<string>}
     * @description 存储后端返回的认证令牌，用于后续请求的身份验证
     *
     * @remarks
     * - 初始值为空字符串（未登录状态）
     * - 通过 persist 插件自动持久化到 localStorage
     * - 每次请求时由 axios 拦截器自动附加到 Authorization 头
     */
    const token = ref<string>('')

    /**
     * 用户信息状态
     * @type {Ref<UserInfo>}
     * @description 当前登录用户的个人资料数据
     *
     * @remarks
     * 包含字段：
     * - id: 用户 ID
     * - username: 登录账号
     * - nickname: 显示昵称
     * - email: 邮箱地址
     * - user_pic: 头像 URL
     *
     * 初始值为空对象，需调用 getUser() 获取实际数据
     */
    const user = ref<UserInfo>({} as UserInfo)

    // ==================== Actions（操作方法） ====================

    /**
     * 设置认证 Token
     * @description 登录成功后保存 JWT Token 到状态中
     *
     * @param {string} newToken - 后端返回的 JWT Token 字符串
     * @returns {void}
     *
     * @example
     * ```typescript
     * // 登录成功后调用
     * const res = await loginApi({ username, password })
     * userStore.setToken(res.data.data.token)
     * ```
     *
     * @see {@link module:@/api/user.userLoginService} 登录接口
     */
    const setToken = (newToken: string): void => {
      token.value = newToken
    }

    /**
     * 清除认证 Token
     * @description 用户退出登录时清空 Token（触发持久化插件删除 localStorage）
     *
     * @returns {void}
     *
     * @example
     * ```typescript
     * // 退出登录流程
     * userStore.removeToken()
     * router.push('/login')
     * ```
     */
    const removeToken = (): void => {
      token.value = ''
    }

    /**
     * 获取当前用户信息
     * @description 从后端 API 获取最新用户资料并更新本地状态
     *
     * @returns {Promise<void>} 异步操作完成
     * @throws {Error} 未登录或 Token 过期时抛出错误（401）
     *
     * @async
     *
     * @example
     * ```typescript
     * // 在路由守卫或页面初始化时调用
     * onMounted(async () => {
     *   try {
     *     await userStore.getUser()
     *     console.log('欢迎回来，' + userStore.user.nickname)
     *   } catch (err) {
     *     // Token 过期，跳转登录页
     *     router.push('/login')
     *   }
     * })
     * ```
     *
     * @see {@link module:@/api/user.userGetInfoService} 获取用户信息接口
     */
    const getUser = async (): Promise<void> => {
      const res = await userGetInfoService()
      user.value = res.data.data
    }

    /**
     * 手动设置用户信息
     * @description 直接更新用户状态（通常用于编辑个人信息后的本地同步）
     *
     * @param {UserInfo} obj - 完整的用户信息对象
     * @param {number} obj.id - 用户 ID
     * @param {string} obj.username - 用户名
     * @param {string} obj.nickname - 昵称
     * @param {string} obj.email - 邮箱
     * @param {string | null} obj.user_pic - 头像 URL
     * @returns {void}
     *
     * @example
     * ```typescript
     * // 更新资料成功后同步本地状态
     * await updateUserInfoApi(formData)
     * userStore.setUser({
     *   ...userStore.user,
     *   nickname: '新昵称',
     *   email: 'new@email.com'
     * })
     * ```
     */
    const setUser = (obj: UserInfo): void => {
      user.value = obj
    }

    // ==================== 返回公共接口 ====================
    return {
      /** Token 状态 */
      token,
      /** 设置 Token */
      setToken,
      /** 清除 Token */
      removeToken,
      /** 用户信息状态 */
      user,
      /** 获取用户信息 */
      getUser,
      /** 设置用户信息 */
      setUser
    }
  },

  // ==================== Store 配置 ====================
  {
    /**
     * 启用数据持久化
     * @description 使用 pinia-plugin-persistedstate 自动将 state 保存到 localStorage
     *
     * @remarks
     * 持久化的字段：
     * - token: JWT 令牌（刷新页面后仍保持登录状态）
     * - user: 用户信息（避免重复请求）
     *
     * 注意：敏感信息（如密码）不应存入此 Store
     */
    persist: true
  }
)
