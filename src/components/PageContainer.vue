<script setup>
/**
 * 全局页面容器组件 (基于 ElCard)
 * 用于统一后台页面的边距、圆角以及头部布局
 *
 * Props:
 * @param {String} title - 页面标题 (必填)
 *
 * Slots:
 * @slot extra - 头部右侧的额外区域 (通常用于放置按钮)
 * @slot default - 页面主体内容
 */
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>

<template>
  <el-card class="page-container">
    <!-- 头部区域：包含标题和额外操作按钮 -->
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div class="extra">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>

    <!-- 内容区域 -->
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
