/**
 * @fileoverview 轻量国际化 Composable（零依赖）
 * @description 自实现的响应式 i18n，支持中英文切换与 localStorage 持久化
 * @version 1.0.0
 *
 * @remarks
 * **设计要点：**
 * - 模块级单例 `locale`，多组件共享同一语言状态
 * - `t()` 函数内部访问 `locale.value`，在模板中调用即建立响应式依赖，
 *   语言切换后模板自动重新渲染
 * - 语言包采用扁平 key（如 `login.title`），避免路径解析开销
 *
 * @example
 * ```typescript
 * const { t, locale, setLocale } = useI18n()
 * // 模板：{{ t('login.title') }}
 * // 切换：setLocale('en')
 * ```
 */

import { ref } from 'vue'
import zh from '@/locales/zh'
import en from '@/locales/en'

export type Locale = 'zh' | 'en'

/** 语言包集合 */
const messages: Record<Locale, Record<string, string>> = { zh, en }

/** 全局语言状态（模块级单例） */
const locale = ref<Locale>(
  (localStorage.getItem('big-event-locale') as Locale) || 'zh'
)

/**
 * 翻译函数
 * @param key - 语言包 key（如 'login.title'）
 * @returns 翻译后的文本，未命中时返回 key 本身
 */
export const t = (key: string): string => {
  return messages[locale.value][key] ?? key
}

/**
 * 切换语言
 * @param l - 目标语言
 */
export const setLocale = (l: Locale): void => {
  locale.value = l
  localStorage.setItem('big-event-locale', l)
}

/**
 * 国际化 Composable
 * @returns { t, locale, setLocale } 翻译函数 + 当前语言 + 切换方法
 */
export function useI18n() {
  return { t, locale, setLocale }
}
