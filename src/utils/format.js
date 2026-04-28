/**
 * 数据格式化工具模块
 */
import { dayjs } from 'element-plus'

/**
 * 格式化时间字符串
 * @param {String|Date} time - 原始日期时间
 * @returns {String} 格式化后的日期字符串 (YYYY年MM月DD日)
 */
export const formatTime = (time) => dayjs(time).format('YYYY年MM月DD日')
