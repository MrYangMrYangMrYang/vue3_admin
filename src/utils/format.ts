/**
 * @fileoverview 日期格式化工具函数（基于 dayjs）
 */

import { dayjs } from 'element-plus'

/**
 * 格式化日期为中文格式 "YYYY年MM月DD日"
 * @param time 待格式化的日期（ISO 字符串、Date 对象）
 */
export const formatTime = (time: string | Date): string =>
  dayjs(time).format('YYYY年MM月DD日')
