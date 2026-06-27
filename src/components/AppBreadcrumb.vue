<script setup lang="ts">
/**
 * 面包屑导航组件
 * @description 基于当前路由 meta.title 渲染，首页 / 当前页两级结构
 *
 * @remarks
 * - 第一级固定为"首页"，指向 /article/channel
 * - 第二级显示当前页标题（i18n key），当前页即首页时仅显示一级
 */
import { useRoute } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { computed } from 'vue'

const route = useRoute()
const { t } = useI18n()

/** 当前页标题（i18n 翻译后），首页时不显示第二级 */
const currentTitle = computed(() => {
  const titleKey = route.meta.title as string | undefined
  if (!titleKey || route.name === 'article-channel') return ''
  return t(titleKey)
})
</script>

<template>
  <el-breadcrumb separator="/" class="app-breadcrumb">
    <el-breadcrumb-item :to="{ path: '/article/channel' }">
      {{ t('common.home') }}
    </el-breadcrumb-item>
    <el-breadcrumb-item v-if="currentTitle">{{
      currentTitle
    }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
.app-breadcrumb {
  font-size: 14px;
}
</style>
