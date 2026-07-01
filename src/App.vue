<!--
  @fileoverview Vue 应用根组件：响应式 Element Plus 国际化 + 路由加载条 + <router-view>
-->

<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { computed, ref } from 'vue'
import router from '@/router'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import { useI18n } from '@/composables/useI18n'

const { locale } = useI18n()

/** Element Plus 组件库 locale 跟随应用语言响应式切换 */
const elLocale = computed(() => (locale.value === 'zh' ? zhCn : en))

/** 控制顶部进度条的显示/隐藏：true 加载中，false 渲染完成 */
const isLoading = ref(false)

router.beforeEach(() => {
  isLoading.value = true
})

// 延迟 300ms 隐藏加载条：避免闪烁过快，给用户视觉反馈感知页面切换
router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})
</script>

<template>
  <div>
    <!-- 路由加载进度条：v-show 保留 DOM 仅切换 display，固定顶部、z-index 最高 -->
    <div v-show="isLoading" class="router-loading-bar"></div>

    <el-config-provider :locale="elLocale">
      <!-- 错误边界：捕获路由组件渲染/生命周期错误，提供降级 UI 与重试入口 -->
      <ErrorBoundary>
        <router-view></router-view>
      </ErrorBoundary>
    </el-config-provider>
  </div>
</template>

<style scoped>
/* 路由加载进度条：3px 高度，多色渐变，1.5s 流动动画，z-index 9999 确保最顶层 */
.router-loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(
    90deg,
    #409eff,
    /* 主色蓝 */ #67c23a,
    /* 成功色绿 */ #e6a23c,
    /* 警告色黄 */ #f56c6c,
    /* 危险色红 */ #409eff
  );
  background-size: 200% 100%;
  animation: loading-gradient 1.5s ease infinite;
  z-index: 9999;
}

@keyframes loading-gradient {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
</style>
