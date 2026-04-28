import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '../../api/user'

/**
 * 用户状态仓库
 * 管理用户的身份令牌（Token）和个人基本信息
 */
export const useUserStore = defineStore(
  'big-user',
  () => {
    // --- 状态 (State) ---
    const token = ref('') // 用户登录令牌
    const user = ref({}) // 用户详细信息（包含 ID、用户名、昵称、邮箱、头像等）

    // --- 动作 (Actions) ---

    /**
     * 设置/更新 Token
     * @param {String} newToken
     */
    const setToken = (newToken) => {
      token.value = newToken
    }

    /**
     * 移除 Token（用于退出登录）
     */
    const removeToken = () => {
      token.value = ''
    }

    /**
     * 从服务器获取并更新用户信息
     */
    const getUser = async () => {
      const res = await userGetInfoService()
      user.value = res.data.data
    }

    /**
     * 手动设置用户信息
     * @param {Object} obj
     */
    const setUser = (obj) => {
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
  {
    // 开启持久化存储（默认存入 localStorage）
    persist: true
  }
)
