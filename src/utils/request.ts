/**
 * @fileoverview Axios HTTP 请求封装模块
 * @description 基于 axios 创建统一的 HTTP 请求实例，配置拦截器处理认证和错误
 * @author Vue3 Big Event Admin Team
 * @version 1.0.0
 *
 * @remarks
 * 本模块提供：
 * - 统一的 axios 实例（baseURL、超时配置）
 * - 请求拦截器：自动附加 JWT Token
 * - 响应拦截器：统一错误处理、401 自动跳转登录
 *
 * @example
 * ```typescript
 * import request from '@/utils/request'
 *
 * // GET 请求
 * const res = await request.get('/api/users')
 *
 * // POST 请求
 * const res = await request.post('/api/login', { username, password })
 * ```
 */

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse
} from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

/** API 基础地址（后端服务地址） */
const baseURL = 'http://big-event-vue-api-t.itheima.net'

/**
 * Axios 实例
 * @description 创建带有统一配置的 axios 实例
 *
 * @property {string} baseURL - API 基础路径
 * @property {number} timeout - 请求超时时间（毫秒）
 */
const instance: AxiosInstance = axios.create({
  baseURL,
  /** 请求超时时间：10秒 */
  timeout: 10000
})

// ==================== 请求拦截器 ====================

/**
 * 请求拦截器
 * @description 在每个请求发送前自动附加认证 Token
 *
 * @param {InternalAxiosRequestConfig} config - 请求配置对象
 * @returns {InternalAxiosRequestConfig} 修改后的配置（含 Authorization 头）
 *
 * @remarks
 * 工作流程：
 * 1. 从 Pinia Store 获取当前用户的 Token
 * 2. 如果 Token 存在，添加到请求头 `Authorization` 字段
 * 3. 返回修改后的配置继续请求
 *
 * @example
 * // 自动添加后的请求头：
 * // { Authorization: 'Bearer xxx.yyy.zzz' }
 */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    /** 获取用户状态管理实例 */
    const useStore = useUserStore()

    /** 如果 Token 存在，附加到请求头 */
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }

    return config
  },
  /**
   * 请求错误处理
   * @param {any} err - 错误对象
   * @returns {Promise<never>} 拒绝的 Promise（传递给调用方）
   */
  (err: any) => Promise.reject(err)
)

// ==================== 响应拦截器 ====================

/**
 * 响应拦截器（成功响应）
 * @description 统一处理后端返回的业务状态码
 *
 * @param {AxiosResponse} res - axios 响应对象
 * @returns {AxiosResponse} 成功响应（code === 0）
 * @throws {Promise} 业务错误（code !== 0）
 *
 * @remarks
 * 后端响应格式约定：
 * - code: 0 表示成功
 * - code: 非 0 表示业务错误
 * - message: 错误描述信息
 */
instance.interceptors.response.use(
  (res: AxiosResponse) => {
    /**
     * 检查业务状态码
     * code === 0 表示操作成功，直接返回响应
     */
    if (res.data.code === 0) {
      return res
    }

    /**
     * 业务逻辑错误处理
     * 显示后端返回的错误消息
     */
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },

  /**
   * 响应拦截器（失败响应）
   * @description 处理 HTTP 层面的错误（网络问题、401 等）
   *
   * @param {any} err - 错误对象（包含 response, message 等属性）
   * @returns {Promise<never>} 拒绝的 Promise
   *
   * @remarks
   * 特殊处理：
   * - 401 未授权：自动跳转到登录页
   * - 其他错误：显示通用错误提示
   */
  (err: any) => {
    /**
     * 401 未授权处理
     * Token 过期或无效时，跳转到登录页重新登录
     */
    if (err.response?.status === 401) {
      router.push('/login')
    }

    /**
     * 通用错误提示
     * 优先显示后端消息，其次 axios 消息，最后使用默认文本
     */
    ElMessage.error(err.response?.data?.message || err.message || '服务异常')
    return Promise.reject(err)
  }
)

// ==================== 导出 ====================

/** 默认导出：axios 实例（用于发起请求） */
export default instance

/** 导出基础地址（供其他模块使用） */
export { baseURL }
