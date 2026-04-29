<!--
  @fileoverview Vue 应用根组件
  @description 应用的最外层组件，负责全局配置和路由容器渲染
  @author Vue3 Big Event Admin Team
  @version 1.0.0

  @remarks
  本组件提供：
  - Element Plus 中文语言包配置
  - 路由切换时的顶部加载进度条动画
  - <router-view> 容器用于渲染当前路由匹配的组件

  @example
  在 main.ts 中作为根组件挂载：
  ```typescript
  const app = createApp(App)
  app.mount('#app')
  ```
-->

<script setup lang="ts">
/**
 * Element Plus 中文语言包
 * @description 配置所有 Element Plus 组件的默认文本为中文
 *
 * 影响范围：
 * - 分页组件：上一页/下一页/共 X 条
 * - 表格组件：暂无数据/确定/取消
 * - 消息提示：操作成功/操作失败
 * - 日期选择器：今天/昨天/本月等
 */
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import { ref } from 'vue'
import router from '@/router'

/**
 * 路由加载状态
 * @type {Ref<boolean>}
 * @description 控制顶部进度条的显示/隐藏
 *
 * @remarks
 * - true: 显示加载进度条（路由切换中）
 * - false: 隐藏进度条（页面渲染完成）
 */
const isLoading = ref(false)

/**
 * 路由前置守卫钩子
 * @description 在每次路由跳转开始时显示加载条
 *
 * @see {@link module:@/router} 全局前置守卫（权限验证）
 */
router.beforeEach(() => {
  isLoading.value = true
})

/**
 * 路由后置守卫钩子
 * @description 在路由跳转完成后延迟隐藏加载条（提升用户体验）
 *
 * @remarks
 * 延迟 300ms 的原因：
 * - 避免 loading 条闪烁过快
 * - 给用户视觉反馈，感知到页面切换
 * - 等待 DOM 渲染完成
 */
router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})
</script>

<template>
  <div>
    <!--
      路由加载进度条
      使用 v-show 控制显示（保留 DOM，仅切换 display）
      固定在页面顶部，z-index 最高确保可见
    -->
    <div v-show="isLoading" class="router-loading-bar"></div>

    <!--
      Element Plus 全局配置 Provider
      :locale 属性设置中文语言包
      包裹所有子组件以应用配置
    -->
    <el-config-provider :locale="zhCn">
      <!--
        路由视图容器
        根据 URL 动态渲染匹配的路由组件
        由 vue-router 自动管理
      -->
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<style scoped>
/**
 * 路由加载进度条样式
 * @description 固定在顶部的渐变动画进度条
 *
 * 视觉效果：
 * - 高度: 3px
 * - 渐变色: 蓝 → 绿 → 黄 → 红 → 蓝（循环）
 * - 动画: 左右流动效果（1.5秒循环）
 * - 层级: 9999（确保在最顶层）
 */
.router-loading-bar {
  /** 固定定位（不随滚动） */
  position: fixed;
  /** 顶部对齐 */
  top: 0;
  /** 左侧对齐 */
  left: 0;
  /** 占满整个宽度 */
  width: 100%;
  /** 进度条高度 */
  height: 3px;
  /** 多色渐变背景 */
  background: linear-gradient(
    90deg,
    #409eff,  /* Element Plus 主色蓝 */
    #67c23a,  /* 成功色绿 */
    #e6a23c,  /* 警告色黄 */
    #f56c6c,  /* 危险色红 */
    #409eff   /* 循环回蓝色 */
  );
  /** 背景尺寸（用于实现流动动画） */
  background-size: 200% 100%;
  /** 流动动画：1.5秒循环，缓动函数 ease */
  animation: loading-gradient 1.5s ease infinite;
  /** 最高层级 */
  z-index: 9999;
}

/**
 * 加载渐变动画关键帧
 * @description 通过移动背景位置实现流动效果
 */
@keyframes loading-gradient {
  /** 起始位置 */
  0% {
    background-position: 0% 50%;
  }
  /** 结束位置（向右偏移 200%） */
  100% {
    background-position: 200% 50%;
  }
}
</style>
