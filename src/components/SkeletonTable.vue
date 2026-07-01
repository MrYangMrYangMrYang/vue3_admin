<script setup lang="ts">
/**
 * 表格骨架屏组件
 * @description 在表格数据加载时展示占位骨架，提升感知性能
 *
 * @example
 * ```html
 * <SkeletonTable v-if="loading" :rows="5" :cols="4" />
 * <el-table v-else ... />
 * ```
 */
defineProps({
  /** 骨架行数 */
  rows: { type: Number, default: 5 },
  /** 骨架列数 */
  cols: { type: Number, default: 4 },
  /** 是否包含复选框列 */
  checkbox: { type: Boolean, default: false }
})
</script>

<template>
  <div class="skeleton-table" aria-busy="true" aria-label="加载中">
    <div v-for="row in rows" :key="row" class="skeleton-row">
      <div v-if="checkbox" class="skeleton-cell skeleton-cell--checkbox">
        <div class="skeleton-bar skeleton-bar--sm" />
      </div>
      <div v-for="col in cols" :key="col" class="skeleton-cell">
        <div
          class="skeleton-bar"
          :style="{ width: 60 + Math.random() * 35 + '%' }"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skeleton-table {
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: var(--border-radius-base, 8px);
  overflow: hidden;
}

.skeleton-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter, #ebeef5);

  &:last-child {
    border-bottom: none;
  }
}

.skeleton-cell {
  flex: 1;
  min-width: 0;

  &--checkbox {
    flex: 0 0 32px;
  }
}

.skeleton-bar {
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--el-fill-color-light, #f0f2f5) 25%,
    var(--el-fill-color, #e8eaed) 50%,
    var(--el-fill-color-light, #f0f2f5) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;

  &--sm {
    width: 16px;
    height: 16px;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
