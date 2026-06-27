<script setup lang="ts">
/**
 * 404 页面
 * @description 路由未匹配时显示的兜底页面，提供返回首页入口
 */
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const router = useRouter()
const { t } = useI18n()

/** 返回首页（文章分类页） */
const goHome = () => router.push('/article/channel')
</script>

<template>
  <div class="not-found">
    <el-result
      icon="warning"
      :title="t('common.notFound')"
      :sub-title="t('common.notFoundDesc')"
    >
      <template #extra>
        <el-button type="primary" @click="goHome">{{
          t('common.backHome')
        }}</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>
