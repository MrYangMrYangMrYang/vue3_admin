/**
 * @fileoverview 主题切换 Composable（暗色/亮色）
 * @description 零依赖实现的主题管理，基于 localStorage 持久化 + html.dark class 切换
 * @version 1.0.0
 *
 * @remarks
 * **设计要点：**
 * - 模块级单例 `isDark`，多组件共享同一状态
 * - 首次读取 localStorage，无记录时跟随系统 `prefers-color-scheme`
 * - 模块加载即同步 class，避免首屏闪烁（FOUC）
 * - Element Plus 暗色主题由 dark/css-vars.css 提供，切换 html.dark 即生效
 *
 * @example
 * ```typescript
 * const { isDark, toggleTheme } = useTheme()
 * // 模板：<el-switch :model-value="isDark" @change="toggleTheme" />
 * ```
 */

import { ref, watch } from 'vue'

const STORAGE_KEY = 'big-event-theme'
type ThemeMode = 'light' | 'dark'

/**
 * 判断初始主题：localStorage 优先，其次跟随系统偏好
 */
const getInitialTheme = (): ThemeMode => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/** 全局主题状态（模块级单例） */
const isDark = ref<boolean>(getInitialTheme() === 'dark')

// 模块加载时立即同步 class，避免首屏闪烁
document.documentElement.classList.toggle('dark', isDark.value)

// 监听变化：同步 class + 持久化
watch(isDark, (dark) => {
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
})

/**
 * 主题切换 Composable
 * @returns { isDark, toggleTheme } 当前是否暗色 + 切换方法
 */
export function useTheme() {
  /** 切换亮/暗主题 */
  const toggleTheme = (): void => {
    isDark.value = !isDark.value
  }

  return { isDark, toggleTheme }
}
