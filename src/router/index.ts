/**
 * @fileoverview Vue Router 路由配置文件
 * @description 定义应用的所有页面路由、导航守卫和权限控制逻辑
 * @author Vue3 Big Event Admin Team
 * @version 1.0.0
 *
 * @remarks
 * 本模块负责：
 * - 路由表定义（登录页、布局页、子页面）
 * - 路由懒加载（代码分割，优化首屏加载）
 * - 全局前置守卫（Token 认证检查）
 *
 * **路由结构：**
 * ```
 * /login              → 登录页（公开）
 * /                   → 布局容器（需认证）
 *   /article/manage   → 文章管理
 *   /article/channel  → 分类管理
 *   /user/profile     → 个人资料
 *   /user/avatar      → 头像设置
 *   /user/password    → 密码修改
 * ```
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores'

/**
 * Vue Router 实例
 * @description 使用 HTML5 History 模式创建路由实例
 */
const router = createRouter({
  /**
   * 路由模式：HTML5 History API
   * @description 使用 pushState/state 实现无刷新导航（URL 更美观）
   * 需要服务器配置 fallback 到 index.html
   */
  history: createWebHistory(import.meta.env.BASE_URL),

  /**
   * 路由表定义
   * @type {RouteRecordRaw[]}
   * @description 所有页面的路由规则集合
   */
  routes: [
    // ==================== 公开页面 ====================

    /**
     * 登录页面路由
     * @route /login
     * @public 无需认证即可访问
     * @component LoginPage.vue
     */
    {
      /** URL 路径 */
      path: '/login',
      /** 懒加载组件（按需加载，减小初始包体积） */
      component: () => import('@/views/login/LoginPage.vue')
    },

    // ==================== 需认证的页面 ====================

    /**
     * 主布局容器路由
     * @route /
     * @authenticated 需要有效 Token 才能访问
     * @component LayoutContainer.vue
     * @children 包含所有业务子页面
     */
    {
      /** 根路径（匹配所有非 /login 的路径） */
      path: '/',
      /** 布局组件（包含侧边栏、顶部导航等） */
      component: () => import('@/views/layout/LayoutContainer.vue'),

      /**
       * 子路由列表
       * @description 嵌套在布局容器内的页面
       */
      children: [
        /**
         * 文章管理页面
         * @route /article/manage
         * @description 文章的增删改查操作界面
         */
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },

        /**
         * 文章分类管理页面
         * @route /article/channel
         * @description 文章分类/频道的 CRUD 操作
         */
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },

        /**
         * 用户个人资料页面
         * @route /user/profile
         * @description 编辑昵称、邮箱等基本信息
         */
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },

        /**
         * 用户头像设置页面
         * @route /user/avatar
         * @description 上传和更换用户头像
         */
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },

        /**
         * 密码修改页面
         * @route /user/password
         * @description 修改当前用户的登录密码
         */
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ] as RouteRecordRaw[]
    }
  ] as RouteRecordRaw[]
})

// ==================== 导航守卫 ====================

/**
 * 全局前置守卫
 * @description 在每次路由跳转前执行权限验证
 *
 * @param {RouteLocationNormalized} to - 目标路由对象
 * @returns {string | void} 返回路径字符串表示重定向，void 表示放行
 *
 * @remarks
 * **认证逻辑：**
 * 1. 检查 Pinia Store 中是否存在 Token
 * 2. 如果没有 Token 且目标不是登录页 → 重定向到 /login
 * 3. 其他情况 → 放行（允许访问）
 *
 * @example
 * // 访问 /article/manage 时：
 * // - 有 Token → 正常进入文章管理页
 * // - 无 Token → 重定向到 /login
 */
router.beforeEach((to) => {
  /** 获取用户状态管理实例 */
  const useStore = useUserStore()

  /**
   * 权限检查
   * 条件：无 Token 且 目标不是登录页
   */
  if (!useStore.token && to.path !== '/login') {
    return '/login'  // 重定向到登录页
  }
})

/** 导出路由实例供 main.ts 使用 */
export default router
