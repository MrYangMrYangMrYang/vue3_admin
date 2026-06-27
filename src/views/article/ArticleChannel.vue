<script setup lang="ts">
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import ChannelEdit from './components/ChannelEdit.vue'
import { ArticleChannel as ArticleChannelType } from '@/types'

/** 组件名（供 keep-alive include 匹配，缓存列表页状态） */
defineOptions({ name: 'article-channel' })

const channelList = ref<ArticleChannelType[]>([])
const loading = ref(true) // 初始为 true，避免空状态闪烁

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()

const dialog = ref()

const onEditChannel = (row: ArticleChannelType, _index?: number) => {
  dialog.value.open(row)
}

const onAddChannel = () => {
  dialog.value.open({} as ArticleChannelType)
}

const onDelChannel = async (row: ArticleChannelType, _index?: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该分类吗？删除后该分类下的文章将变为"未分类"。',
      '删除确认',
      {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }
    )
    await artDelChannelService(row.id)
    ElMessage.success({ message: '删除成功', duration: 1500 })
    getChannelList()
  } catch {
    // 用户取消删除
  }
}

const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel" type="primary">添加分类</el-button>
    </template>

    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>

    <el-table
      v-loading="loading"
      :data="channelList"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="cate_name"
        label="分类名称"
        min-width="150"
      ></el-table-column>
      <el-table-column
        prop="cate_alias"
        label="分类别名"
        min-width="150"
      ></el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="{ row, $index }">
          <el-tooltip content="编辑分类" placement="top">
            <el-button
              :icon="Edit"
              circle
              plain
              type="primary"
              @click="onEditChannel(row, $index)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除分类" placement="top">
            <el-button
              :icon="Delete"
              circle
              plain
              type="danger"
              @click="onDelChannel(row, $index)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
  </page-container>
</template>

<style lang="scss" scoped></style>
