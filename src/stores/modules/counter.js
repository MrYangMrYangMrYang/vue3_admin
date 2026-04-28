import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 数字计数器仓库 (示例模块)
 * 用于演示 Pinia 的基本用法
 */
export const useCountStore = defineStore('big-count', () => {
  const count = ref(100) // 计数状态

  /**
   * 增加计数值
   * @param {Number} n - 增加的数值
   */
  const add = (n) => {
    count.value += n
  }

  return {
    count,
    add
  }
})
