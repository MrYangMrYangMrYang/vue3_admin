/**
 * @fileoverview Vue Router 路由配置：路由表 + 懒加载 + 全局前置守卫（Token 认证 + RBAC 权限）
 *
 * 路由结构：
 *   /login              → 登录页（公开）
 *   /                   → 布局容器（需认证）
 *     /article/manage   → 文章管理（需 article:read）
 *     /article/channel  → 分类管理（需 channel:read）
 *     /user/profile     → 个人资料（需 user:profile）
 *     /user/avatar      → 头像设置（需 user:profile）
 *     /user/password    → 密码修改（需 user:profile）
 *     /role/manage      → 角色管理（需 role:manage）
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore, usePermissionStore } from '@/stores'
import { cancelAllPending } from '@/utils/requestCancel'
import { ElMessage } from 'element-plus'

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
          meta: { title: 'menu.articleManage', permission: 'article:read' }
        },

        {
          path: '/article/channel',
          name: 'article-channel',
          component: () => import('@/views/article/ArticleChannel.vue'),
          meta: { title: 'menu.articleChannel', permission: 'channel:read' }
        },

        {
          path: '/user/profile',
          name: 'user-profile',
          component: () => import('@/views/user/UserProfile.vue'),
          meta: { title: 'menu.profile', permission: 'user:profile' }
        },

        {
          path: '/user/avatar',
          name: 'user-avatar',
          component: () => import('@/views/user/UserAvatar.vue'),
          meta: { title: 'menu.avatar', permission: 'user:profile' }
        },

        {
          path: '/user/password',
          name: 'user-password',
          component: () => import('@/views/user/UserPassword.vue'),
          meta: { title: 'menu.password', permission: 'user:profile' }
        },

        {
          path: '/role/manage',
          name: 'role-manage',
          component: () => import('@/views/role/RoleManage.vue'),
          meta: { title: 'menu.roleManage', permission: 'role:manage' }
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

// 全局前置守卫
router.beforeEach(async (to) => {
  // 路由切换时取消上一个页面未完成的 GET 请求
  cancelAllPending()

  const userStore = useUserStore()

  // 未登录访问非登录页 → 跳转登录
  if (!userStore.token && to.path !== '/login') {
    return '/login'
  }

  // 已登录访问登录页 → 跳转首页（防止浏览器回退到登录页）
  if (userStore.token && to.path === '/login') {
    return false
  }

  // RBAC 权限检查
  const permRequired = to.meta.permission as string | undefined

  if (import.meta.env.DEV)
    console.log(
      '[守卫]',
      to.path,
      'perm:',
      permRequired,
      'token:',
      !!userStore.token
    )
  if (permRequired) {
    const permStore = usePermissionStore()

    // 权限尚未加载（如刚登录后），主动拉取用户信息
    if (!permStore.permissions.length) {
      if (userStore.user?.permissions?.length) {
        // 从持久化的 user 数据快速恢复（刷新页面场景）
        permStore.setPermissions(userStore.user.permissions)
      } else if (userStore.token) {
        // token 存在但用户信息未加载（登录后场景），等待拉取
        try {
          await userStore.getUser()
        } catch {
          // 拉取失败，放行让页面尝试渲染，若为 401 拦截器已清除 token
        }
      }
    }

    if (import.meta.env.DEV)
      console.log(
        '[守卫] perms:',
        permStore.permissions,
        ' has:',
        permStore.hasPermission(permRequired)
      )
    if (!permStore.hasPermission(permRequired)) {
      ElMessage.warning('您没有权限访问此页面')
      return false
    }
  }
})

export default router
