/**
 * @fileoverview Axios HTTP 请求封装（拦截器处理认证/错误/重试/取消）
 */

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse
} from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'
import type { UserInfo } from '@/types'
import { addPending, removePending } from './requestCancel'

/** 扩展 axios 请求配置：追加重试计数字段，用于网络错误/5xx 自动重试 */
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    /** 已重试次数 */
    _retryCount?: number
  }
}

/** GET 请求最大重试次数 */
const MAX_RETRY = 2

/** API 基础地址，通过 Vite 环境变量注入，区分开发/生产环境 */
const baseURL = import.meta.env.VITE_API_BASE_URL

const instance: AxiosInstance = axios.create({
  baseURL,
  /** 请求超时时间：10秒 */
  timeout: 10000
})

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const useStore = useUserStore()

    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }

    // 注册到 pending 池（仅 GET 请求），支持路由切换时取消
    addPending(config)

    return config
  },
  (err: unknown) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res: AxiosResponse) => {
    // 请求完成，从 pending 池移除
    removePending(res.config)

    // 后端约定 code === 0 表示操作成功
    if (res.data.code === 0) {
      return res
    }

    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },

  (err: unknown) => {
    const axiosErr = err as {
      code?: string
      config?: InternalAxiosRequestConfig
      response?: { status: number; data?: { message?: string } }
      message?: string
    }
    // 路由切换取消的请求：静默处理，不弹错误提示
    if (axiosErr.code === 'ERR_CANCELED') {
      return Promise.reject(err)
    }

    if (axiosErr.config) {
      removePending(axiosErr.config)
    }

    // GET 请求自动重试：网络错误（无 response）或 5xx 时指数退避（1s / 2s）
    // 仅 GET 请求，避免写操作重复提交；最多重试 MAX_RETRY 次
    const config = axiosErr.config
    const response = axiosErr.response
    const isRetryable =
      config?.method === 'get' &&
      (config._retryCount ?? 0) < MAX_RETRY &&
      (!response || response.status >= 500)

    if (isRetryable) {
      config._retryCount = (config._retryCount ?? 0) + 1
      const delay = 1000 * config._retryCount
      return new Promise((resolve) => {
        setTimeout(() => resolve(instance(config)), delay)
      })
    }

    // 401 未授权：必须同时清除 token 和 user，避免残留过期数据导致下次进入仍显示旧用户
    if (axiosErr.response?.status === 401) {
      const userStore = useUserStore()
      userStore.removeToken()
      userStore.setUser({} as UserInfo)
      router.push('/login')
    }

    ElMessage.error(
      axiosErr.response?.data?.message || axiosErr.message || '服务异常'
    )
    return Promise.reject(err)
  }
)

export default instance

export { baseURL }
