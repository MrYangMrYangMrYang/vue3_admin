<script setup lang="ts">
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
  Moon,
  Menu
} from '@element-plus/icons-vue'
import avatar from '@/assets/default-avatar.png'
import { useUserStore } from '@/stores'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { useI18n } from '@/composables/useI18n'
import type { Locale } from '@/composables/useI18n'
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'

const isCollapse = ref(false)
/** 移动端侧边栏浮层开关 */
const mobileOpen = ref(false)
/** 是否为移动端（< 768px） */
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) mobileOpen.value = false
}
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const userStore = useUserStore()

const { isDark, toggleTheme } = useTheme()
const { t, locale, setLocale } = useI18n()

onMounted(async () => {
  // 失败时（如 401）由 request 拦截器统一处理跳转，此处静默捕获避免未处理 Promise 拒绝
  try {
    await userStore.getUser()
  } catch {
    // 静默处理：错误提示与跳转已在 request 拦截器中完成
  }
})

const router = useRouter()

const handleCommand = async (key: string) => {
  if (key === 'logout') {
    // 用户取消时静默返回（reject 不应冒泡到全局 errorHandler）
    try {
      await ElMessageBox.confirm(
        t('common.logoutConfirm'),
        t('common.confirm'),
        {
          type: 'warning',
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel')
        }
      )
    } catch {
      return
    }
    userStore.removeToken()
    ElMessage.success({
      message: t('common.logoutSuccess'),
      duration: 1500,
      grouping: true
    })
    router.push('/login')
  } else {
    router.push(`/user/${key}`)
    mobileOpen.value = false
  }
}

const onLocaleChange = (l: Locale) => setLocale(l)

/** 菜单导航后关闭移动端浮层 */
const onMenuSelect = () => {
  if (isMobile.value) mobileOpen.value = false
}
</script>

<template>
  <el-container class="layout-container">
    <!-- 移动端遮罩 -->
    <div
      v-if="isMobile && mobileOpen"
      class="mobile-overlay"
      @click="mobileOpen = false"
    ></div>

    <!-- 侧边栏：移动端绝对定位浮层，桌面端正常流 -->
    <el-aside
      :class="{
        'aside-mobile': isMobile,
        'aside-mobile--open': isMobile && mobileOpen
      }"
      :width="isCollapse || isMobile ? '64px' : '200px'"
    >
      <div
        class="el-aside__logo"
        :class="{ 'is-collapse': isCollapse || isMobile }"
      ></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
        :collapse="isCollapse || isMobile"
        :collapse-transition="false"
        role="navigation"
        aria-label="主导航"
        @select="onMenuSelect"
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
          <!-- 桌面端：折叠按钮 -->
          <el-icon
            v-if="!isMobile"
            class="collapse-btn"
            :aria-label="isCollapse ? '展开侧边栏' : '折叠侧边栏'"
            @click="isCollapse = !isCollapse"
          >
            <component :is="isCollapse ? Expand : Fold" />
          </el-icon>
          <!-- 移动端：汉堡菜单 -->
          <el-icon
            v-else
            class="collapse-btn"
            aria-label="打开菜单"
            @click="mobileOpen = true"
          >
            <Menu />
          </el-icon>
          <div class="user-info">
            {{ t('menu.manager') }}：<strong>{{
              userStore.displayName
            }}</strong>
          </div>
        </div>
        <div class="header-actions">
          <el-dropdown placement="bottom-end" @command="onLocaleChange">
            <el-button text class="icon-btn" aria-label="切换语言">
              {{ locale === 'zh' ? '中' : 'EN' }}
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh">{{
                  t('locale.zh')
                }}</el-dropdown-item>
                <el-dropdown-item command="en">{{
                  t('locale.en')
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-tooltip
            :content="isDark ? t('theme.light') : t('theme.dark')"
            placement="bottom"
          >
            <el-button
              text
              class="icon-btn"
              :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'"
              @click="toggleTheme"
            >
              <el-icon :size="18">
                <component :is="isDark ? Sunny : Moon" />
              </el-icon>
            </el-button>
          </el-tooltip>
          <el-dropdown placement="bottom-end" @command="handleCommand">
            <span class="el-dropdown__box" aria-label="用户菜单">
              <el-avatar :src="userStore.avatar || avatar" />
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
        <AppBreadcrumb class="breadcrumb-bar" />
        <!-- keep-alive 缓存列表页，保留分页与搜索状态 -->
        <router-view v-slot="{ Component }">
          <keep-alive :include="['article-manage', 'article-channel']">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
      <el-footer>{{ t('common.footer') }}</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #232323;
    transition: width var(--transition-normal);
    z-index: 100;

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

  /* 移动端侧边栏：绝对定位浮层 */
  .aside-mobile {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    transform: translateX(-100%);
    transition: transform var(--transition-normal);
    box-shadow: none;

    &--open {
      transform: translateX(0);
      box-shadow: 4px 0 16px rgba(0, 0, 0, 0.15);
    }
  }

  .el-header {
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
        flex-shrink: 0;
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

  .el-main {
    overflow-x: auto;
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: var(--el-text-color-secondary, #666);
  }

  .breadcrumb-bar {
    margin-bottom: 16px;
  }
}

/* 移动端遮罩 */
.mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: rgba(0, 0, 0, 0.4);
}

/* ─── 响应式断点 ───────────────────────────────────────── */

/* < 768px：移动端 */
@media (max-width: 767px) {
  .layout-container {
    .el-header {
      padding: 0 12px;
      .user-info {
        display: none;
      }
      .header-actions {
        gap: 2px;
        .icon-btn {
          padding: 4px 6px;
        }
      }
    }
    .el-main {
      padding: 12px;
    }
    .el-footer {
      font-size: 12px;
      padding: 10px;
    }
    .breadcrumb-bar {
      margin-bottom: 8px;
    }
  }
}

/* 768-1024px：平板端，侧边栏默认折叠 */
@media (min-width: 768px) and (max-width: 1023px) {
  .layout-container {
    .el-main {
      padding: 16px;
    }
  }
}
</style>
