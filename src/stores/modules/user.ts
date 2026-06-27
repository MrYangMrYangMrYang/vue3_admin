/**
 * @fileoverview 用户状态管理模块（Pinia Store）
 * 管理 Token、用户信息，启用 localStorage 持久化。
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '../../api/user'
import type { UserInfo } from '@/types'

export const useUserStore = defineStore('big-user', () => {
  /** JWT Token，初始值为空字符串（未登录）；通过 persist 自动持久化；由 axios 拦截器附加到 Authorization 头 */
  const token = ref<string>('')

  /** 当前登录用户信息，初始值为空对象，需调用 getUser() 获取实际数据 */
  const user = ref<UserInfo>({} as UserInfo)

  /** 登录成功后保存 JWT Token */
  const setToken = (newToken: string): void => {
    token.value = newToken
  }

  /** 退出登录时清空 Token（触发持久化插件删除 localStorage） */
  const removeToken = (): void => {
    token.value = ''
  }

  /**
   * 从后端 API 获取最新用户资料并更新本地状态
   * @throws 未登录或 Token 过期时抛出 401 错误
   */
  const getUser = async (): Promise<void> => {
    const res = await userGetInfoService()
    user.value = res.data.data
  }

  /** 直接更新用户状态（通常用于编辑个人信息后的本地同步） */
  const setUser = (obj: UserInfo): void => {
    user.value = obj
  }

  return {
    token,
    setToken,
    removeToken,
    user,
    getUser,
    setUser
  }
},
// 注意：敏感信息（如密码）不应存入此 Store
{
  persist: true
})
