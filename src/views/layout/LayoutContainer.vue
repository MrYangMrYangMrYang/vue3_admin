<script setup lang="ts">
/**
 * 后台布局容器组件
 * 包含侧边栏菜单、顶部导航头、用户信息展示、以及二级路由出口
 * 支持暗色/亮色主题切换与中英文语言切换
 */
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom,
  Expand,
  Fold,
  Sunny,
  Moon
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import type { UserInfo } from '@/types'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { useI18n } from '@/composables/useI18n'
import type { Locale } from '@/composables/useI18n'

const isCollapse = ref(false) // 侧边栏折叠状态
const userStore = useUserStore()

// 主题与语言
const { isDark, toggleTheme } = useTheme()
const { t, locale, setLocale } = useI18n()

onMounted(async () => {
  // 页面加载后，自动获取最新的用户信息
  // 失败时（如 401）由 request 拦截器统一处理跳转，此处静默捕获避免未处理 Promise 拒绝
  try {
    await userStore.getUser()
  } catch {
    // 静默处理：错误提示与跳转已在 request 拦截器中完成
  }
})

const router = useRouter()

/**
 * 处理顶部下拉菜单的点击命令
 * @param {string} key - 命令关键字 (profile/avatar/password/logout)
 */
const handleCommand = async (key: string) => {
  if (key === 'logout') {
    // 退出登录：弹出确认框
    await ElMessageBox.confirm(t('common.logoutConfirm'), t('common.confirm'), {
      type: 'warning',
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel')
    })
    // 清除 Token 和用户信息
    userStore.removeToken()
    userStore.setUser({} as UserInfo)
    // 退出登录成功提示
    ElMessage.success({
      message: t('common.logoutSuccess'),
      duration: 1500,
      grouping: true
    })
    // 跳转到登录页
    router.push('/login')
  } else {
    // 跳转到对应的个人中心子页面
    router.push(`/user/${key}`)
  }
}

/** 切换语言 */
const onLocaleChange = (l: Locale) => setLocale(l)
</script>

<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="el-aside__logo" :class="{ 'is-collapse': isCollapse }"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>{{ t('menu.articleChannel') }}</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>{{ t('menu.articleManage') }}</span>
        </el-menu-item>

        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>{{ t('menu.userCenter') }}</span>
          </template>

          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>{{ t('menu.profile') }}</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>{{ t('menu.avatar') }}</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>{{ t('menu.password') }}</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
            <component :is="isCollapse ? Expand : Fold" />
          </el-icon>
          <div class="user-info">
            {{ t('menu.manager') }}：<strong>{{
              userStore.user.nickname || userStore.user.username
            }}</strong>
          </div>
        </div>
        <div class="header-actions">
          <!-- 语言切换 -->
          <el-dropdown placement="bottom-end" @command="onLocaleChange">
            <el-button text class="icon-btn">
              {{ locale === 'zh' ? '中' : 'EN' }}
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh">{{ t('locale.zh') }}</el-dropdown-item>
                <el-dropdown-item command="en">{{ t('locale.en') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- 主题切换 -->
          <el-tooltip :content="isDark ? t('theme.light') : t('theme.dark')" placement="bottom">
            <el-button text class="icon-btn" @click="toggleTheme">
              <el-icon :size="18">
                <component :is="isDark ? Sunny : Moon" />
              </el-icon>
            </el-button>
          </el-tooltip>
          <!-- 用户下拉 -->
          <el-dropdown placement="bottom-end" @command="handleCommand">
            <span class="el-dropdown__box">
              <el-avatar :src="userStore.user.user_pic || avatar" />
              <el-icon><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile" :icon="User">{{
                  t('menu.profile')
                }}</el-dropdown-item>
                <el-dropdown-item command="avatar" :icon="Crop">{{
                  t('menu.avatar')
                }}</el-dropdown-item>
                <el-dropdown-item command="password" :icon="EditPen">{{
                  t('menu.password')
                }}</el-dropdown-item>
                <el-dropdown-item command="logout" :icon="SwitchButton">{{
                  t('menu.logout')
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <!-- 二级路由出口 -->
        <router-view></router-view>
      </el-main>
      <el-footer>大事件 ©2025 Created by MrYang</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
    transition: width var(--transition-normal);
    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
      transition: all var(--transition-normal);
      &.is-collapse {
        background-size: 40px auto;
        height: 60px;
      }
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    /* 适配暗色模式：使用 Element Plus 背景变量 */
    background-color: var(--el-bg-color, #fff);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    z-index: 10;

    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;

      .collapse-btn {
        font-size: 20px;
        cursor: pointer;
        color: var(--el-text-color-regular, #606266);
        transition: color var(--transition-fast);
        &:hover {
          color: #409eff;
        }
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      .icon-btn {
        padding: 6px 10px;
        font-weight: 600;
        color: var(--el-text-color-regular, #606266);
      }
    }
    .el-dropdown__box {
      display: flex;
      align-items: center;
      cursor: pointer;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }
      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: var(--el-text-color-secondary, #666);
  }
}
</style>
