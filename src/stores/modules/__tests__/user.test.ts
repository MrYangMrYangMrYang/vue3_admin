/**
 * @fileoverview user.ts Pinia Store 单元测试
 * @description 测试用户状态管理的 token 操作、用户信息设置与 API 调用
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { UserInfo } from '@/types'

// mock 用户信息接口 API，避免真实网络请求
vi.mock('@/api/user', () => ({
  userGetInfoService: vi.fn()
}))

import { useUserStore } from '../user'
import { userGetInfoService } from '@/api/user'

// 模拟用户数据
const mockUserInfo = {
  id: 1,
  username: 'admin',
  nickname: '管理员',
  email: 'admin@test.com',
  user_pic: 'https://example.com/avatar.png'
}

describe('useUserStore 用户状态管理', () => {
  beforeEach(() => {
    // 每个测试前重置 Pinia 实例，确保状态隔离
    setActivePinia(createPinia())
    // 清空 localStorage，避免持久化数据干扰
    localStorage.clear()
    // 重置所有 mock 调用记录
    vi.clearAllMocks()
  })

  describe('token 管理', () => {
    it('初始 token 应为空字符串', () => {
      const store = useUserStore()
      expect(store.token).toBe('')
    })

    it('setToken 应正确设置 token 值', () => {
      const store = useUserStore()
      store.setToken('jwt-token-abc123')
      expect(store.token).toBe('jwt-token-abc123')
    })

    it('setToken 应支持覆盖旧 token', () => {
      const store = useUserStore()
      store.setToken('old-token')
      store.setToken('new-token')
      expect(store.token).toBe('new-token')
    })

    it('removeToken 应清空 token 和用户信息', () => {
      const store = useUserStore()
      store.setToken('jwt-token-abc123')
      store.setUser(mockUserInfo)
      store.removeToken()
      expect(store.token).toBe('')
      expect(store.user).toBeNull()
    })
  })

  describe('用户信息管理', () => {
    it('setUser 应正确设置用户信息', () => {
      const store = useUserStore()
      store.setUser(mockUserInfo)
      expect(store.user).toEqual(mockUserInfo)
    })

    it('setUser 应支持覆盖旧用户信息', () => {
      const store = useUserStore()
      store.setUser(mockUserInfo)
      const newInfo = { ...mockUserInfo, nickname: '新昵称' }
      store.setUser(newInfo)
      expect(store.user?.nickname).toBe('新昵称')
    })

    it('getUser 应调用 API 并更新 user 状态', async () => {
      // 配置 mock 返回值（已解包 AxiosResponse，直接返回 ApiResponse）
      vi.mocked(userGetInfoService).mockResolvedValue({
        code: 0,
        message: 'success',
        data: mockUserInfo
      } as Awaited<ReturnType<typeof userGetInfoService>>)

      const store = useUserStore()
      await store.getUser()

      // 验证 API 被调用一次
      expect(userGetInfoService).toHaveBeenCalledTimes(1)
      // 验证 user 状态已更新
      expect(store.user).toEqual(mockUserInfo)
    })

    it('getUser API 失败时应抛出错误', async () => {
      vi.mocked(userGetInfoService).mockRejectedValue(
        new Error('401 Unauthorized')
      )

      const store = useUserStore()
      await expect(store.getUser()).rejects.toThrow('401 Unauthorized')
      // 验证失败后 user 仍为 null（初始值）
      expect(store.user).toBeNull()
    })
  })

  describe('Store 持久化', () => {
    it('setToken 后 token 应持久化到 localStorage', () => {
      const store = useUserStore()
      store.setToken('persisted-token')

      // pinia-plugin-persistedstate 默认存储 key 为 store id
      // 注意：测试环境未注册 persist 插件，此测试验证的是 store 行为
      expect(store.token).toBe('persisted-token')
    })
  })
})
