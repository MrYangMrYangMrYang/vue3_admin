<script setup lang="ts">
/**
 * 后台布局容器组件
 * 包含侧边栏菜单、顶部导航头、用户信息展示、以及二级路由出口
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
  Fold
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import type { UserInfo } from '@/types'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const isCollapse = ref(false) // 侧边栏折叠状态
const userStore = useUserStore()

onMounted(() => {
  // 页面加载后，自动获取最新的用户信息
  userStore.getUser()
})

const router = useRouter()

/**
 * 处理顶部下拉菜单的点击命令
 * @param {string} key - 命令关键字 (profile/avatar/password/logout)
 */
const handleCommand = async (key: string) => {
  if (key === 'logout') {
    // 退出登录：弹出确认框
    await ElMessageBox.confirm('你确认要进行退出么', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })
    // 清除 Token 和用户信息
    userStore.removeToken()
    userStore.setUser({} as UserInfo)
    // 退出登录成功提示
    ElMessage.success({
      message: '已安全退出登录',
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
</script>

<template>
  <!-- 
    el-menu 整个菜单组件
      :default-active="$route.path"  配置默认高亮的菜单项
      router  el-menu中的router属性开启后，el-menu-item 的 index 就是点击跳转的路径

    el-menu-item 菜单项
      index="/article/channel" 配置的是访问的跳转路径，配合default-active的值，实现高亮
  -->
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
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>

        <el-sub-menu index="/user">
          <!-- 多级菜单的标题 - 具名插槽 title -->
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>

          <!-- 展开的内容 - 默认插槽 -->
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
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
            管理人员：<strong>{{
              userStore.user.nickname || userStore.user.username
            }}</strong>
          </div>
        </div>
        <div class="header-actions">
          <el-dropdown placement="bottom-end" @command="handleCommand">
            <span class="el-dropdown__box">
              <el-avatar :src="userStore.user.user_pic || avatar" />
              <el-icon><CaretBottom /></el-icon>
            </span>
            <!-- 折叠的下拉部分 -->
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile" :icon="User"
                  >基本资料</el-dropdown-item
                >
                <el-dropdown-item command="avatar" :icon="Crop"
                  >更换头像</el-dropdown-item
                >
                <el-dropdown-item command="password" :icon="EditPen"
                  >重置密码</el-dropdown-item
                >
                <el-dropdown-item command="logout" :icon="SwitchButton"
                  >退出登录</el-dropdown-item
                >
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
    background-color: #fff;
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
        color: #606266;
        transition: color var(--transition-fast);
        &:hover {
          color: #409eff;
        }
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .el-dropdown__box {
      display: flex;
      align-items: center;
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
    color: #666;
  }
}
</style>
