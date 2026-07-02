/**
 * @fileoverview Composables 统一导出
 * @description 集中导出所有可复用组合式函数，供组件按需引入
 * @version 1.0.0
 *
 * @example
 * ```typescript
 * import { useRequest, useTable } from '@/composables'
 * ```
 */

export { useRequest } from './useRequest'
export type { UseRequestOptions, UseRequestReturn } from './useRequest'

export { useTable } from './useTable'
export type { UseTableOptions, UseTableReturn, PageParams } from './useTable'

export { useI18n } from './useI18n'
export type { Locale } from './useI18n'

export { usePermission } from './usePermission'
