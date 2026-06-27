/**
 * @fileoverview useRequest 通用请求 Composable
 * @description 封装异步请求的 loading / data / error 状态管理，消除组件内重复样板代码
 * @version 1.0.0
 *
 * @example
 * ```typescript
 * const { data, loading, error, execute } = useRequest(fetchUserList, {
 *   immediate: true,
 *   onSuccess: (data) => console.log('加载成功', data)
 * })
 * ```
 */

import { ref, type Ref } from 'vue'

/**
 * useRequest 配置项
 */
interface UseRequestOptions<T> {
  /** 是否立即执行一次（默认 false） */
  immediate?: boolean
  /** 初始数据（避免首次加载前 data 为 undefined） */
  initialData?: T
  /** 请求成功回调 */
  onSuccess?: (data: T) => void | Promise<void>
  /** 请求失败回调 */
  onError?: (error: Error) => void
}

/**
 * useRequest 返回值
 */
interface UseRequestReturn<T, A extends unknown[]> {
  /** 响应数据 */
  data: Ref<T | undefined>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 错误信息（无错误时为 null） */
  error: Ref<Error | null>
  /** 执行请求（可传参覆盖默认参数） */
  execute: (...args: A) => Promise<T | undefined>
  /** 重新执行上次请求（语义化别名） */
  refresh: () => Promise<T | undefined>
}

/**
 * 通用请求 Composable
 * @description 封装异步请求的状态管理，自动维护 loading/error/data
 *
 * @param fn - 异步请求函数
 * @param options - 配置项
 * @returns 状态与控制方法
 *
 * @example
 * ```typescript
 * // 1. 基本用法
 * const { data, loading, execute } = useRequest(artGetChannelsService)
 *
 * // 2. 立即执行
 * const { data: list, loading } = useRequest(artGetChannelsService, {
 *   immediate: true,
 *   initialData: []
 * })
 *
 * // 3. 带参数
 * const { execute } = useRequest((id: number) => getUserById(id))
 * execute(1) // 传入参数
 * ```
 */
export function useRequest<T, A extends unknown[] = unknown[]>(
  fn: (...args: A) => Promise<T>,
  options: UseRequestOptions<T> = {}
): UseRequestReturn<T, A> {
  const data = ref<T | undefined>(options.initialData) as Ref<T | undefined>
  const loading = ref(false)
  const error = ref<Error | null>(null)

  /** 最近一次调用的参数（供 refresh 使用） */
  let lastArgs: A | undefined

  const execute = async (...args: A): Promise<T | undefined> => {
    lastArgs = args
    loading.value = true
    error.value = null
    try {
      const result = await fn(...args)
      data.value = result
      await options.onSuccess?.(result)
      return result
    } catch (err) {
      const e = err as Error
      error.value = e
      options.onError?.(e)
      return undefined
    } finally {
      loading.value = false
    }
  }

  // immediate 为 true 时立即执行一次
  if (options.immediate) {
    execute(...([] as unknown as A))
  }

  return {
    data,
    loading,
    error,
    execute,
    refresh: () => execute(...((lastArgs ?? []) as A))
  }
}
