/**
 * @fileoverview useRequest Composable 单元测试
 * @description 测试通用请求封装的 loading/data/error 状态管理与回调
 */

import { describe, it, expect, vi } from 'vitest'
import { useRequest } from '../useRequest'

describe('useRequest 通用请求封装', () => {
  describe('执行控制', () => {
    it('immediate: true 应立即执行请求', async () => {
      const fn = vi.fn().mockResolvedValue({ code: 0 })
      const { data, loading } = useRequest(fn, { immediate: true })

      expect(fn).toHaveBeenCalledTimes(1)
      await vi.waitFor(() => {
        expect(data.value).toEqual({ code: 0 })
        expect(loading.value).toBe(false)
      })
    })

    it('immediate: false 不应执行请求', () => {
      const fn = vi.fn()
      useRequest(fn, { immediate: false })
      expect(fn).not.toHaveBeenCalled()
    })

    it('execute 应手动触发请求并更新 data', async () => {
      const fn = vi.fn().mockResolvedValue(42)
      const { data, execute } = useRequest(fn, { immediate: false })

      await execute()
      expect(fn).toHaveBeenCalledTimes(1)
      expect(data.value).toBe(42)
    })

    it('refresh 应使用上次参数重新执行', async () => {
      const fn = vi.fn().mockResolvedValue('ok')
      const { execute, refresh } = useRequest<
        (s: string) => Promise<string>,
        [string]
      >(fn, {
        immediate: false
      })

      await execute('param1')
      expect(fn).toHaveBeenCalledWith('param1')
      await refresh()
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenLastCalledWith('param1')
    })
  })

  describe('状态管理', () => {
    it('loading 应在请求期间为 true，完成后为 false', async () => {
      const fn = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve('ok'), 10))
        )
      const { loading, execute } = useRequest(fn, { immediate: false })

      expect(loading.value).toBe(false)
      const promise = execute()
      expect(loading.value).toBe(true)
      await promise
      expect(loading.value).toBe(false)
    })

    it('initialData 应作为 data 的初始值', () => {
      const fn = vi.fn()
      const { data } = useRequest(fn, { immediate: false, initialData: [] })
      expect(data.value).toEqual([])
    })
  })

  describe('回调处理', () => {
    it('onSuccess 应在请求成功后被调用', async () => {
      const onSuccess = vi.fn()
      const fn = vi.fn().mockResolvedValue('result')
      const { execute } = useRequest(fn, { immediate: false, onSuccess })

      await execute()
      expect(onSuccess).toHaveBeenCalledWith('result')
    })

    it('onError 应在请求失败后被调用', async () => {
      const onError = vi.fn()
      const fn = vi.fn().mockRejectedValue(new Error('网络错误'))
      const { execute, error } = useRequest(fn, { immediate: false, onError })

      await execute()
      expect(onError).toHaveBeenCalledWith(expect.any(Error))
      expect(error.value).toBeInstanceOf(Error)
      expect(error.value?.message).toBe('网络错误')
    })

    it('请求失败时 data 应保持原值不变', async () => {
      const fn = vi
        .fn()
        .mockResolvedValueOnce('first')
        .mockRejectedValueOnce(new Error('fail'))
      const { data, execute } = useRequest(fn, { immediate: false })

      await execute()
      expect(data.value).toBe('first')

      await execute()
      expect(data.value).toBe('first') // 失败后仍为上次的值
    })
  })
})
