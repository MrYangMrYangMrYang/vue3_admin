/**
 * @fileoverview Vue Router 路由配置：路由表 + 懒加载 + 全局前置守卫（Token 认证）
 *
 * 路由结构：
 *   /login              → 登录页（公开）
 *   /                   → 布局容器（需认证）
 *     /article/manage   → 文章管理
 *     /article/channel  → 分类管理
 *     /user/profile     → 个人资料
 *     /user/avatar      → 头像设置
 *     /user/password    → 密码修改
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores'
import { cancelAllPending } from '@/utils/requestCancel'

const router = createRouter({
  // HTML5 History 模式：URL 更美观，但需服务器配置 fallback 到 index.html
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },

    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),

      children: [
        {
          path: '/article/manage',
          name: 'article-manage',
          component: () => import('@/views/article/ArticleManage.vue'),
          meta: { title: 'menu.articleManage' }
        },

        {
          path: '/article/channel',
          name: 'article-channel',
          component: () => import('@/views/article/ArticleChannel.vue'),
          meta: { title: 'menu.articleChannel' }
        },

        {
          path: '/user/profile',
          name: 'user-profile',
          component: () => import('@/views/user/UserProfile.vue'),
          meta: { title: 'menu.profile' }
        },

        {
          path: '/user/avatar',
          name: 'user-avatar',
          component: () => import('@/views/user/UserAvatar.vue'),
          meta: { title: 'menu.avatar' }
        },

        {
          path: '/user/password',
          name: 'user-password',
          component: () => import('@/views/user/UserPassword.vue'),
          meta: { title: 'menu.password' }
        },

        // 404 兜底路由：必须放在 children 最后
        {
          path: '/:pathMatch(.*)*',
          name: 'not-found',
          component: () => import('@/views/NotFound.vue'),
          meta: { title: 'common.notFound' }
        }
      ] as RouteRecordRaw[]
    }
  ] as RouteRecordRaw[]
})

// 全局前置守卫：无 Token 且目标不是登录页 → 重定向到 /login
router.beforeEach((to) => {
  // 路由切换时取消上一个页面未完成的 GET 请求，避免无意义网络消耗与状态污染
  cancelAllPending()

  const useStore = useUserStore()

  if (!useStore.token && to.path !== '/login') {
    return '/login'
  }
})

export default router
