/**
 * @fileoverview 请求取消管理模块
 *
 * 设计目标：用户切换路由时，取消上一个页面未完成的 GET 请求，避免无意义的网络消耗与状态污染。
 * 仅管理 GET 请求（页面级数据请求），不管理 POST/PUT/DELETE 等写操作。
 *
 * 工作流程：
 * 1. 请求拦截器调用 `addPending` 注册 controller
 * 2. 响应拦截器调用 `removePending` 清理已完成的请求
 * 3. 路由前置守卫调用 `cancelAllPending` 取消所有未完成请求
 */

import type { InternalAxiosRequestConfig } from 'axios'

/** pending 请求池：key 为自增 ID，value 为 AbortController */
const pendingMap = new Map<string, AbortController>()

/** 自增 ID 生成器，保证每个请求 key 唯一 */
let requestId = 0

/** 挂载在 config 上的 pending key 字段名 */
const PENDING_KEY = '_pendingKey'

/**
 * 注册请求到 pending 池（仅 GET 请求）；为请求注入 AbortController signal
 */
export const addPending = (config: InternalAxiosRequestConfig): void => {
  // 仅管理 GET 请求，避免误取消写操作
  if (config.method !== 'get') return

  const key = String(++requestId)
  const controller = new AbortController()
  config.signal = controller.signal
  ;(config as InternalAxiosRequestConfig & { _pendingKey?: string })[
    PENDING_KEY
  ] = key
  pendingMap.set(key, controller)
}

/**
 * 从 pending 池移除已完成的请求
 */
export const removePending = (config: InternalAxiosRequestConfig): void => {
  const key = (config as InternalAxiosRequestConfig & { _pendingKey?: string })[
    PENDING_KEY
  ]
  if (key) {
    pendingMap.delete(key)
  }
}

/**
 * 取消所有未完成的 GET 请求
 * 路由切换时调用，abort 后会触发 axios ERR_CANCELED 错误
 */
export const cancelAllPending = (): void => {
  if (pendingMap.size === 0) return
  pendingMap.forEach((controller) => controller.abort())
  pendingMap.clear()
}
