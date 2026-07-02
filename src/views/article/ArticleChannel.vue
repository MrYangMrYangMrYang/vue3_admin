<script setup lang="ts">
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import ChannelEdit from './components/ChannelEdit.vue'
import { ArticleChannel as ArticleChannelType } from '@/types'
import { useI18n } from '@/composables'
import { getErrorMessage } from '@/utils/format'
import SkeletonTable from '@/components/SkeletonTable.vue'

const { t } = useI18n()

/** 组件名（供 keep-alive include 匹配，缓存列表页状态） */
defineOptions({ name: 'article-channel' })

const channelList = ref<ArticleChannelType[]>([])
const loading = ref(true)
const isFirstLoad = ref(true)

const getChannelList = async () => {
  loading.value = true
  try {
    const res = await artGetChannelsService()
    channelList.value = res.data
  } catch (err: unknown) {
    ElMessage.error(getErrorMessage(err, t('channel.loadFailed')))
  } finally {
    loading.value = false
    isFirstLoad.value = false
  }
}
getChannelList()

const dialog = ref()

const onEditChannel = (row: ArticleChannelType, _index?: number) => {
  dialog.value.open(row)
}

const onAddChannel = () => {
  dialog.value.open(null)
}

const onDelChannel = async (row: ArticleChannelType, _index?: number) => {
  try {
    await ElMessageBox.confirm(
      t('channel.deleteConfirm'),
      t('channel.deleteTitle'),
      {
        type: 'warning',
        confirmButtonText: t('channel.delete'),
        cancelButtonText: t('channel.cancel')
      }
    )
  } catch {
    // 用户取消删除，静默返回
    return
  }

  try {
    await artDelChannelService(row.id)
    ElMessage.success({ message: t('channel.deleteSuccess'), duration: 1500 })
    getChannelList()
  } catch (err: unknown) {
    ElMessage.error(getErrorMessage(err, t('channel.deleteFailed')))
  }
}

const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <page-container :title="t('channel.title')">
    <template #extra>
      <el-button
        v-permission="'channel:manage'"
        @click="onAddChannel"
        type="primary"
      >
        {{ t('channel.addChannel') }}
      </el-button>
    </template>

    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>

    <SkeletonTable v-if="isFirstLoad && loading" :rows="4" :cols="3" />
    <el-table
      v-else
      v-loading="loading"
      :data="channelList"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="index"
        :label="t('channel.indexColumn')"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="cate_name"
        :label="t('channel.nameColumn')"
        min-width="150"
      ></el-table-column>
      <el-table-column
        prop="cate_alias"
        :label="t('channel.aliasColumn')"
        min-width="150"
      ></el-table-column>
      <el-table-column
        :label="t('channel.actionsColumn')"
        width="150"
        align="center"
        fixed="right"
      >
        <template #default="{ row, $index }">
          <el-tooltip
            v-permission="'channel:manage'"
            :content="t('channel.editChannel')"
            placement="top"
          >
            <el-button
              :icon="Edit"
              circle
              plain
              type="primary"
              :aria-label="t('channel.editChannel')"
              @click="onEditChannel(row, $index)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            v-permission="'channel:manage'"
            :content="t('channel.deleteChannel')"
            placement="top"
          >
            <el-button
              :icon="Delete"
              circle
              plain
              type="danger"
              :aria-label="t('channel.deleteChannel')"
              @click="onDelChannel(row, $index)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty :description="t('channel.noData')"></el-empty>
      </template>
    </el-table>
  </page-container>
</template>

<style lang="scss" scoped></style>
