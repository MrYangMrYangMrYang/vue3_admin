/**
 * @fileoverview format.ts 工具函数单元测试
 * @description 测试 formatTime 日期格式化函数的各种输入场景
 */

import { describe, it, expect } from 'vitest'
import { formatTime, getErrorMessage } from '../format'

describe('formatTime 日期格式化函数', () => {
  describe('正常输入', () => {
    it('应正确格式化 ISO 日期字符串', () => {
      expect(formatTime('2024-01-15')).toBe('2024年01月15日')
    })

    it('应正确格式化带时间的 ISO 字符串', () => {
      expect(formatTime('2024-06-20T08:30:00')).toBe('2024年06月20日')
    })

    it('应正确格式化 Date 对象', () => {
      // new Date(2024, 0, 15) → 2024年1月15日（月份从 0 开始）
      expect(formatTime(new Date(2024, 0, 15))).toBe('2024年01月15日')
    })

    it('应正确格式化带时间的 Date 对象', () => {
      expect(formatTime(new Date(2024, 5, 20, 8, 30, 0))).toBe('2024年06月20日')
    })
  })

  describe('边界情况', () => {
    it('应正确处理年初第一天', () => {
      expect(formatTime('2024-01-01')).toBe('2024年01月01日')
    })

    it('应正确处理年末最后一天', () => {
      expect(formatTime('2024-12-31')).toBe('2024年12月31日')
    })

    it('应正确处理闰年 2 月 29 日', () => {
      // 2024 是闰年
      expect(formatTime('2024-02-29')).toBe('2024年02月29日')
    })

    it('应正确处理平年 2 月 28 日', () => {
      // 2023 是平年
      expect(formatTime('2023-02-28')).toBe('2023年02月28日')
    })
  })

  describe('格式化规则', () => {
    it('月份应补零为两位数', () => {
      expect(formatTime('2024-03-05')).toBe('2024年03月05日')
    })

    it('日期应补零为两位数', () => {
      expect(formatTime('2024-10-07')).toBe('2024年10月07日')
    })

    it('双位数月份和日期不应补零', () => {
      expect(formatTime('2024-11-25')).toBe('2024年11月25日')
    })
  })
})

describe('getErrorMessage 错误消息提取函数', () => {
  it('应从 Error 实例提取 message', () => {
    expect(getErrorMessage(new Error('网络超时'))).toBe('网络超时')
  })

  it('应从纯字符串返回原值', () => {
    expect(getErrorMessage('请求失败')).toBe('请求失败')
  })

  it('应从含 message 属性的普通对象提取', () => {
    expect(getErrorMessage({ message: '服务器错误', code: 500 })).toBe(
      '服务器错误'
    )
  })

  it('无法提取时应返回默认 fallback 值', () => {
    expect(getErrorMessage(null)).toBe('操作失败')
  })

  it('无法提取时应返回自定义 fallback 值', () => {
    expect(getErrorMessage(undefined, '自定义错误')).toBe('自定义错误')
  })

  it('应处理空对象', () => {
    expect(getErrorMessage({})).toBe('操作失败')
  })

  it('应处理数字类型', () => {
    expect(getErrorMessage(404, '未知错误')).toBe('未知错误')
  })
})
