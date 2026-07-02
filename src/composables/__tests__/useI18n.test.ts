/**
 * @fileoverview useI18n.ts 国际化 Composable 单元测试
 * @description 测试翻译函数 t()、语言切换 setLocale()、参数插值、localStorage 持久化
 *
 * @remarks
 * useI18n 使用模块级单例（locale ref），测试间必须 vi.resetModules()
 * 并在导入前预设好 localStorage，因为模块顶层代码在 import 时即执行
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/locales/zh', () => ({
  default: {
    'login.title': '登录到工作台',
    'login.submit': '登录',
    'article.batchSelected': '已选择 {count} 项',
    'menu.logout': '退出登录'
  }
}))

vi.mock('@/locales/en', () => ({
  default: {
    'login.title': 'Sign in to Workspace',
    'login.submit': 'Sign In',
    'article.batchSelected': '{count} selected',
    'menu.logout': 'Logout'
  }
}))

describe('useI18n 国际化', () => {
  beforeEach(() => {
    vi.resetModules()
    localStorage.clear()
  })

  describe('翻译函数 t()', () => {
    it('应从中文默认翻译 login.title', async () => {
      const { t } = await import('../useI18n')
      expect(t('login.title')).toBe('登录到工作台')
    })

    it('切换到英文后应正确翻译', async () => {
      const { t, setLocale } = await import('../useI18n')
      setLocale('en')
      expect(t('login.title')).toBe('Sign in to Workspace')
    })

    it('未知 key 应返回原 key', async () => {
      const { t } = await import('../useI18n')
      expect(t('nonexistent.key')).toBe('nonexistent.key')
    })
  })

  describe('参数插值', () => {
    it('应正确替换单个参数 {count}', async () => {
      const { t } = await import('../useI18n')
      expect(t('article.batchSelected', { count: 5 })).toBe('已选择 5 项')
    })

    it('英文环境下参数插值应正确', async () => {
      const { t, setLocale } = await import('../useI18n')
      setLocale('en')
      expect(t('article.batchSelected', { count: 10 })).toBe('10 selected')
    })
  })

  describe('语言切换', () => {
    it('默认应为中文 zh', async () => {
      const { useI18n } = await import('../useI18n')
      const { locale } = useI18n()
      expect(locale.value).toBe('zh')
    })

    it('setLocale 应切换到英文并更新 ref', async () => {
      const { useI18n, setLocale } = await import('../useI18n')
      const { locale } = useI18n()
      setLocale('en')
      expect(locale.value).toBe('en')
    })
  })

  describe('持久化', () => {
    it('切换语言后应写入 localStorage', async () => {
      const { setLocale } = await import('../useI18n')
      setLocale('en')
      expect(localStorage.getItem('big-event-locale')).toBe('en')
    })

    it('从 localStorage 读取已保存的语言偏好', async () => {
      localStorage.setItem('big-event-locale', 'en')
      const { useI18n } = await import('../useI18n')
      const { locale } = useI18n()
      expect(locale.value).toBe('en')
    })
  })
})
