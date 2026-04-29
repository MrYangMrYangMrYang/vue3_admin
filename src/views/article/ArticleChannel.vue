<script setup lang="ts">
/**
 * 文章分类管理页面
 * 用于展示文章分类列表，并提供添加、编辑、删除分类的功能
 */
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import ChannelEdit from './components/ChannelEdit.vue'
import { ArticleChannel as ArticleChannelType } from '@/types'

const channelList = ref<ArticleChannelType[]>([])
const loading = ref(true) // 初始为 true，避免空状态闪烁

/**
 * 获取所有文章分类列表并更新数据
 */
const getChannelList = async () => {
  // 开启加载动画
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  // 关闭加载动画
  loading.value = false
}
getChannelList()

// 通过ref标识获取子组件实例
const dialog = ref()

const onEditChannel = (row: ArticleChannelType, _index?: number) => {
  dialog.value.open(row)
}

/**
 * 添加文章分类
 */
const onAddChannel = () => {
  dialog.value.open({} as ArticleChannelType)
}

/**
 * 删除文章分类
 */
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
    // 捕获异常，用户取消删除
  }
}

/**
 * 子组件操作成功后的回调函数
 * 用于重新渲染分类列表
 */
const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <!-- 封装的通用框架子组件 -->
  <page-container title="文章分类">
    <!-- 具名插槽显示的按钮 -->
    <template #extra>
      <el-button @click="onAddChannel" type="primary">添加分类</el-button>
    </template>

    <!-- 以下为默认插槽显示的内容 -->
    <!-- 封装的dialog 子组件 -->
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>

    <!-- Table 组件显示内容 -->
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

      <!-- 非空判断 -->
      <!-- Table 组件的插槽名为empty时(数据为空时)可以自定义空内容 -->
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
  </page-container>
</template>

<style lang="scss" scoped></style>
