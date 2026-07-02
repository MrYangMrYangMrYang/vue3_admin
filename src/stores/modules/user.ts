/**
 * @fileoverview 用户状态管理模块（Pinia Store）
 * 管理 Token、用户信息，启用 localStorage 持久化。
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userGetInfoService } from '../../api/user'
import { usePermissionStore } from './permission'
import type { UserInfo } from '@/types'

/** 未登录/用户尚未加载时的安全回退值 */
const EMPTY_USER: UserInfo = {
  id: 0,
  username: '',
  nickname: '',
  email: '',
  user_pic: null,
  role: '',
  permissions: []
}

export const useUserStore = defineStore(
  'big-user',
  () => {
    /** JWT Token，初始值为空字符串（未登录）；通过 persist 自动持久化；由 axios 拦截器附加到 Authorization 头 */
    const token = ref<string>('')

    /**
     * 当前登录用户信息
     * - null → 未登录或尚未拉取用户资料
     * - UserInfo → 已登录且有有效用户数据
     */
    const user = ref<UserInfo | null>(null)

    /** 安全获取用户显示名：已登录返回昵称/用户名，未登录返回空字符串 */
    const displayName = computed(() => {
      if (!user.value) return ''
      return user.value.nickname || user.value.username
    })

    /** 安全获取用户头像：已登录返回头像 URL，未登录返回 null */
    const avatar = computed(() => user.value?.user_pic ?? null)

    /** 登录成功后保存 JWT Token */
    const setToken = (newToken: string): void => {
      token.value = newToken
    }

    /** 退出登录时清空 Token、用户信息和权限（触发持久化插件删除 localStorage） */
    const removeToken = (): void => {
      token.value = ''
      user.value = null
      usePermissionStore().clearPermissions()
    }

    /**
     * 从后端 API 获取最新用户资料并更新本地状态与权限
     * @throws 未登录或 Token 过期时抛出 401 错误
     */
    const getUser = async (): Promise<void> => {
      const res = await userGetInfoService()
      user.value = res.data
      // 将用户权限同步到 PermissionStore
      if (res.data.permissions) {
        usePermissionStore().setPermissions(res.data.permissions)
      }
    }

    /** 直接设置用户状态（通常用于编辑个人信息后的本地同步） */
    const setUser = (obj: UserInfo): void => {
      user.value = obj
    }

    return {
      token,
      setToken,
      removeToken,
      user,
      displayName,
      avatar,
      getUser,
      setUser
    }
  },
  // 注意：敏感信息（如密码）不应存入此 Store
  {
    persist: true
  }
)
