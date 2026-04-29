/**
 * @fileoverview 计数器状态管理 Store
 * @description 使用 Composition API 定义的计数器状态仓库（示例模块）
 * @author Vue3 Big Event Admin Team
 * @version 1.0.0
 *
 * @remarks
 * 本 Store 用于演示 Pinia 的基本用法：
 * - 响应式状态定义 (ref)
 * - Actions 方法定义
 * - 状态和方法的导出
 *
 * **使用场景：**
 * - 学习 Pinia Composition API 风格
 * - 作为新 Store 模板的参考
 * - 测试状态管理功能
 *
 * @example
 * ```typescript
 * // 在组件中使用
 * import { useCountStore } from '@/stores'
 *
 * const countStore = useCountStore()
 *
 * // 读取状态
 * console.log(countStore.count)  // 100
 *
 * // 调用方法
 * countStore.add(5)
 * console.log(countStore.count)  // 105
 * ```
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 计数器状态管理 Store
 * @description 使用 Composition API 定义的状态仓库
 *
 * @property {Ref<number>} count - 计数值（初始值 100）
 * @property {Function} add - 增加计数值的方法
 *
 * @returns {Object} 包含 count 状态和 add 方法的对象
 */
export const useCountStore = defineStore(
  /** Store 唯一标识符 */
  'big-count',

  /**
   * Setup 函数（Composition API 风格）
   * @returns {Object} 状态和方法的集合
   */
  () => {
    // ==================== State（响应式状态） ====================

    /**
     * 计数器状态
     * @type {Ref<number>}
     * @description 存储当前计数值的响应式变量
     *
     * @remarks
     * - 初始值为 100（演示用）
     * - 使用 ref 包装确保响应式
     * - 可在模板中直接使用 {{ count }}
     */
    const count = ref<number>(100)

    // ==================== Actions（操作方法） ====================

    /**
     * 增加计数值
     * @description 将当前计数值增加指定数量
     *
     * @param {number} n - 要增加的数量（可为正负数）
     * @returns {void} 无返回值
     *
     * @example
     * ```typescript
     * const store = useCountStore()
     *
     * // 增加 10
     * store.add(10)      // count: 110
     *
     * // 减少 5（传入负数）
     * store.add(-5)      // count: 105
     * ```
     *
     * @throws {TypeError} 当 n 不是数字时可能抛出类型错误
     */
    const add = (n: number): void => {
      count.value += n
    }

    // ==================== 返回对象 ====================

    /**
     * Store 公开接口
     * @description 返回需要暴露给外部访问的状态和方法
     *
     * @returns {Object}
     * @property {Ref<number>} count - 计数值（响应式）
     * @property {Function} add - 增加计数的方法
     */
    return {
      /** 当前计数值 */
      count,
      /** 增加计数的方法 */
      add
    }
  },

  // ==================== Store 配置 ====================
  // 注意：此 Store 未启用持久化（仅用于演示）
)
