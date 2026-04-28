/**
 * Axios 网络请求模块
 * 负责统一配置请求基地址、超时时间、请求/响应拦截器
 */
import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

// API 请求基地址
const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  baseURL,
  timeout: 10000 // 请求超时时间 (10秒)
})

/**
 * 请求拦截器
 * 在请求发送前统一注入 Authorization Token
 */
instance.interceptors.request.use(
  (config) => {
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

/**
 * 响应拦截器
 * 统一处理业务逻辑成功/失败，以及 HTTP 错误状态码
 */
instance.interceptors.response.use(
  (res) => {
    // 业务逻辑成功 (code 为 0)
    if (res.data.code === 0) {
      return res
    }
    // 业务逻辑失败 (如：用户名已存在、密码错误等)
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // 处理特定的 HTTP 错误码
    // 401 权限不足 或 Token 过期，强制跳转到登录页
    if (err.response?.status === 401) {
      router.push('/login')
    }

    // 通用的错误提示
    ElMessage.error(err.response?.data?.message || err.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
