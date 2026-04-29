/**
 * @fileoverview 日期格式化工具函数
 * @description 提供统一的日期/时间格式化功能，基于 dayjs 库
 * @author Vue3 Big Event Admin Team
 * @version 1.0.0
 *
 * @example
 * ```typescript
 * import { formatTime } from '@/utils/format'
 *
 * const formatted = formatTime('2024-01-15')
 * // 输出: '2024年01月15日'
 * ```
 */

import { dayjs } from 'element-plus'

/**
 * 格式化日期为中文格式
 * @description 将日期字符串或 Date 对象转换为 "YYYY年MM月DD日" 格式
 *
 * @param {string | Date} time - 待格式化的日期（支持 ISO 字符串、Date 对象、时间戳）
 * @returns {string} 格式化后的日期字符串（如 "2024年01月15日"）
 *
 * @example
 * ```typescript
 * // 使用 ISO 字符串
 * formatTime('2024-01-15T08:00:00Z')
 * // => '2024年01月15日'
 *
 * // 使用 Date 对象
 * formatTime(new Date(2024, 0, 15))
 * // => '2024年01月15日'
 *
 * // 使用时间戳
 * formatTime(1705276800000)
 * // => '2024年01月15日' (TypeScript 需显式转换)
 * ```
 *
 * @see {@link https://dayjs.golang.cn/docs/zh-CN/display/format} dayjs 格式化文档
 */
export const formatTime = (time: string | Date): string =>
  dayjs(time).format('YYYY年MM月DD日')
