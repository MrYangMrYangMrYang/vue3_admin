/**
 * @fileoverview 日期格式化 & 错误提取工具函数（基于 dayjs）
 */

import { dayjs } from 'element-plus'

/**
 * 格式化日期为中文格式 "YYYY年MM月DD日"
 * @param time 待格式化的日期（ISO 字符串、Date 对象）
 */
export const formatTime = (time: string | Date): string =>
  dayjs(time).format('YYYY年MM月DD日')

/**
 * 从各类 catch 到的未知类型中安全提取可读的错误消息
 * 覆盖 Error 实例、string、包含 message 属性的对象等常见场景
 *
 * @param err - catch 块捕获的未知类型错误
 * @param fallback - 无法提取时的默认消息
 * @returns 可展示的用户友好错误消息
 */
export const getErrorMessage = (
  err: unknown,
  fallback = '操作失败'
): string => {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as Record<string, unknown>).message)
  }
  return fallback
}
