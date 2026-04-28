/**
 * 路由管理模块
 * 负责定义路由规则、配置路由模式以及全局路由守卫
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

/**
 * 创建路由实例
 * 使用 HTML5 History 模式
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录页 - 采用路由懒加载
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },

    // 首页布局容器 - 包含侧边栏和头部，作为所有管理页面的父路由
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      // 子路由配置
      children: [
        {
          path: '/article/manage', // 文章管理
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel', // 文章分类
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile', // 个人详情
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar', // 更换头像
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password', // 重置密码
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

/**
 * 全局前置守卫 (登录访问拦截)
 * 逻辑：
 * 1. 如果没有 token 且试图访问非登录页，则强制重定向到 /login
 * 2. 否则，允许正常访问
 */
router.beforeEach((to) => {
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
})

export default router
