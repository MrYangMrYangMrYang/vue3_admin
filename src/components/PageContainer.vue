<!-- 全局组件：通用框架子组件(Card 组件) -->
<script setup>
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>

<!-- Card 组件由header、body 和 footer组成(header和footer是可选的,他们两个的内容都取决于具名插槽) -->
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div class="extra">
          <!-- 具名插槽定制按钮 -->
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <!-- 默认插槽显示内容 -->
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
