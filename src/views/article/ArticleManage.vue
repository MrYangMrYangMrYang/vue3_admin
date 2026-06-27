<script setup lang="ts">
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import { artGetListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/format'
import { useTable } from '@/composables'
import type { ArticleDetail } from '@/types'

/** 组件名（供 keep-alive include 匹配，缓存列表页状态） */
defineOptions({ name: 'article-manage' })

// useTable 自动管理 list/total/loading/params 与分页/搜索/重置逻辑
const {
  list: articleList,
  total,
  loading,
  params,
  getList: getArticleList,
  onSizeChange,
  onCurrentChange,
  onSearch,
  onReset
} = useTable<
  { pagenum: number; pagesize: number; cate_id: string; state: string },
  ArticleDetail
>(artGetListService, {
  initialParams: { cate_id: '', state: '' },
  initialPageSize: 5
})

const articleEdit = ref()

const onAddArticle = () => {
  articleEdit.value.open({})
}

const onEditArticle = (row: ArticleDetail) => {
  articleEdit.value.open(row)
}

const onDeleteArticle = async (row: ArticleDetail) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这篇文章吗？删除后无法恢复。',
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await artDelService(row.id)
    ElMessage.success('删除成功')
    getArticleList()
  } catch {
    // 取消删除或请求失败
  }
}

const selectedRows = ref<ArticleDetail[]>([])

// 后端 API 无批量删除接口，用 Promise.allSettled 并发调用单个删除
const onBatchDelete = async () => {
  if (selectedRows.value.length === 0) return
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 篇文章吗？删除后无法恢复。`,
      '批量删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    const results = await Promise.allSettled(
      selectedRows.value.map((row) => artDelService(row.id))
    )
    const successCount = results.filter((r) => r.status === 'fulfilled').length
    const failCount = results.length - successCount
    if (failCount === 0) {
      ElMessage.success(`成功删除 ${successCount} 篇文章`)
    } else {
      ElMessage.warning(`成功 ${successCount} 篇，失败 ${failCount} 篇`)
    }
    selectedRows.value = []
    getArticleList()
  } catch {
    // 用户取消批量删除
  }
}

const onSuccess = (type: string) => {
  if (type === 'add') {
    // 添加成功，跳转到最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
    <ArticleEdit ref="articleEdit" @success="onSuccess"></ArticleEdit>

    <el-form inline class="search-form">
      <el-form-item label="文章分类:">
        <ChannelSelect v-model="params.cate_id" width="200px"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态:">
        <el-select
          v-model="params.state"
          placeholder="请选择状态"
          style="width: 200px"
        >
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset" type="info" plain>重置</el-button>
      </el-form-item>
    </el-form>

    <div class="batch-bar" v-if="selectedRows.length > 0">
      <span class="batch-count">已选择 {{ selectedRows.length }} 项</span>
      <el-button type="danger" :icon="Delete" @click="onBatchDelete">
        批量删除
      </el-button>
    </div>

    <el-table
      :data="articleList"
      v-loading="loading"
      border
      stripe
      @selection-change="selectedRows = $event"
    >
      <el-table-column type="selection" width="48" />
      <el-table-column label="文章标题" min-width="200">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="分类"
        prop="cate_name"
        width="120"
      ></el-table-column>
      <el-table-column label="发表时间" width="180">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.state === '已发布' ? 'success' : 'info'">
            {{ row.state }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-tooltip content="编辑文章" placement="top">
            <el-button
              circle
              plain
              type="primary"
              :icon="Edit"
              @click="onEditArticle(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除文章" placement="top">
            <el-button
              circle
              plain
              type="danger"
              :icon="Delete"
              @click="onDeleteArticle(row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: center"
    />
  </page-container>
</template>

<style lang="scss" scoped>
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  :deep(.el-form-item) {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
.batch-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  padding: 10px 16px;
  background: var(--el-fill-color-light, #f5f7fa);
  border-radius: 4px;
  .batch-count {
    color: var(--el-text-color-regular, #606266);
    font-size: 14px;
  }
}
</style>
