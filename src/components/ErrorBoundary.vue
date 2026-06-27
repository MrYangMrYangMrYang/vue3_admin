<script setup lang="ts">
/**
 * 错误边界组件
 * @description 捕获子孙组件在渲染、生命周期、事件处理中抛出的错误，
 * 防止整个应用白屏，并提供降级 UI 与重试入口
 *
 * @remarks
 * - 使用 `onErrorCaptured` 钩子捕获错误并返回 `false` 阻止向 `app.config.errorHandler` 冒泡
 * - 错误状态下渲染友好的提示界面，用户可点击"重试"恢复
 * - 建议包裹在 `<router-view>` 外层，以覆盖所有路由级组件
 */
import { ref, onErrorCaptured } from 'vue'

/** 当前捕获到的错误（null 表示正常） */
const error = ref<Error | null>(null)

/**
 * 错误捕获钩子
 * @param err - 抛出的错误对象
 * @returns {boolean} 返回 false 阻止错误继续向上冒泡，避免触发全局 errorHandler 重复处理
 */
onErrorCaptured((err) => {
  error.value = err instanceof Error ? err : new Error(String(err))
  return false
})

/** 重置错误状态，重新渲染插槽内容 */
const reset = () => {
  error.value = null
}
</script>

<template>
  <div v-if="error" class="error-boundary">
    <el-result icon="error" title="页面渲染异常" :sub-title="error.message">
      <template #extra>
        <el-button type="primary" @click="reset">重试</el-button>
      </template>
    </el-result>
  </div>
  <slot v-else />
</template>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>
