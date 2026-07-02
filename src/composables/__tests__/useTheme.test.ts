/**
 * @fileoverview useTheme.ts 主题切换 Composable 单元测试
 * @description 测试暗色/亮色模式切换、localStorage 持久化、html class 同步
 * @vitest-environment jsdom
 *
 * @remarks
 * useTheme 使用模块级单例（isDark ref + watch），测试间必须 vi.resetModules()
 * 并在导入前预设好 localStorage 与 matchMedia，因为模块顶层代码在 import 时即执行
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'

const STORAGE_KEY = 'big-event-theme'

describe('useTheme 主题切换', () => {
  beforeEach(() => {
    vi.resetModules()
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false }))
    )
  })

  describe('初始状态', () => {
    it('无 localStorage 记录时默认亮色主题', async () => {
      const { useTheme } = await import('../useTheme')
      const { isDark } = useTheme()
      expect(isDark.value).toBe(false)
    })

    it('跟随系统暗色偏好', async () => {
      vi.stubGlobal(
        'matchMedia',
        vi.fn(() => ({ matches: true }))
      )
      const { useTheme } = await import('../useTheme')
      const { isDark } = useTheme()
      expect(isDark.value).toBe(true)
    })

    it('localStorage 存储 dark 时初始为暗色', async () => {
      localStorage.setItem(STORAGE_KEY, 'dark')
      const { useTheme } = await import('../useTheme')
      const { isDark } = useTheme()
      expect(isDark.value).toBe(true)
    })
  })

  describe('主题切换', () => {
    it('toggleTheme 应从亮色切换到暗色', async () => {
      const { useTheme } = await import('../useTheme')
      const { isDark, toggleTheme } = useTheme()
      toggleTheme()
      await nextTick()
      expect(isDark.value).toBe(true)
    })

    it('toggleTheme 应从暗色切换回亮色', async () => {
      const { useTheme } = await import('../useTheme')
      const { isDark, toggleTheme } = useTheme()
      toggleTheme() // → dark
      await nextTick()
      toggleTheme() // → light
      await nextTick()
      expect(isDark.value).toBe(false)
    })
  })

  describe('html class 同步', () => {
    it('切换到暗色时应添加 html.dark class', async () => {
      const { useTheme } = await import('../useTheme')
      const { toggleTheme } = useTheme()
      toggleTheme()
      await nextTick()
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('切换到亮色时应移除 html.dark class', async () => {
      const { useTheme } = await import('../useTheme')
      const { toggleTheme } = useTheme()
      toggleTheme() // → dark
      await nextTick()
      toggleTheme() // → light
      await nextTick()
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('持久化', () => {
    it('切换暗色后应写入 localStorage', async () => {
      const { useTheme } = await import('../useTheme')
      const { toggleTheme } = useTheme()
      toggleTheme()
      await nextTick()
      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark')
    })

    it('从暗色切回亮色应更新 localStorage 为 light', async () => {
      const { useTheme } = await import('../useTheme')
      const { toggleTheme } = useTheme()
      toggleTheme() // → dark
      await nextTick()
      toggleTheme() // → light
      await nextTick()
      expect(localStorage.getItem(STORAGE_KEY)).toBe('light')
    })
  })
})
