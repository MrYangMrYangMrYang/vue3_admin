<script setup lang="ts">
import { ref, watch } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import { artGetListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/format'
import { useTable, useI18n } from '@/composables'
import type { ArticleDetail } from '@/types'
import SkeletonTable from '@/components/SkeletonTable.vue'

const { t } = useI18n()

/** 组件名（供 keep-alive include 匹配，缓存列表页状态） */
defineOptions({ name: 'article-manage' })

/** 首次加载使用骨架屏，后续刷新用 v-loading */
const isFirstLoad = ref(true)

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

// 首次加载完成 → 关闭骨架屏，后续切换回 v-loading
watch(loading, (val) => {
  if (!val) isFirstLoad.value = false
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
      t('article.deleteConfirm'),
      t('article.deleteTitle'),
      {
        confirmButtonText: t('article.delete'),
        cancelButtonText: t('article.cancel'),
        type: 'warning'
      }
    )
    await artDelService(row.id)
    ElMessage.success(t('article.deleteSuccess'))
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
      t('article.batchDeleteConfirm', { count: selectedRows.value.length }),
      t('article.batchDeleteTitle'),
      {
        confirmButtonText: t('article.delete'),
        cancelButtonText: t('article.cancel'),
        type: 'warning'
      }
    )
    const results = await Promise.allSettled(
      selectedRows.value.map((row) => artDelService(row.id))
    )
    const successCount = results.filter((r) => r.status === 'fulfilled').length
    const failCount = results.length - successCount
    if (failCount === 0) {
      ElMessage.success(
        t('article.batchDeleteSuccess', { count: successCount })
      )
    } else {
      ElMessage.warning(
        t('article.batchDeletePartial', {
          success: successCount,
          fail: failCount
        })
      )
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
  <page-container :title="t('article.title')">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">
        {{ t('article.addArticle') }}
      </el-button>
    </template>
    <ArticleEdit ref="articleEdit" @success="onSuccess"></ArticleEdit>

    <el-form inline class="search-form">
      <el-form-item :label="t('article.categoryLabel')">
        <ChannelSelect v-model="params.cate_id" width="200px"></ChannelSelect>
      </el-form-item>
      <el-form-item :label="t('article.statusLabel')">
        <el-select
          v-model="params.state"
          :placeholder="t('article.statusLabel')"
          style="width: 200px"
        >
          <el-option :label="t('article.published')" value="已发布"></el-option>
          <el-option :label="t('article.draft')" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">{{
          t('article.search')
        }}</el-button>
        <el-button @click="onReset" type="info" plain>{{
          t('article.reset')
        }}</el-button>
      </el-form-item>
    </el-form>

    <div class="batch-bar" v-if="selectedRows.length > 0">
      <span class="batch-count">
        {{ t('article.batchSelected', { count: selectedRows.length }) }}
      </span>
      <el-button type="danger" :icon="Delete" @click="onBatchDelete">
        {{ t('article.batchDelete') }}
      </el-button>
    </div>

    <SkeletonTable v-if="isFirstLoad && loading" :rows="5" :cols="5" checkbox />
    <div v-else class="table-wrapper">
      <el-table
        :data="articleList"
        v-loading="loading"
        border
        stripe
        @selection-change="selectedRows = $event"
      >
        <el-table-column type="selection" width="48" />
        <el-table-column :label="t('article.titleColumn')" min-width="200">
          <template #default="{ row }">
            <el-link type="primary" :underline="false">{{ row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('article.categoryColumn')"
          prop="cate_name"
          width="120"
        ></el-table-column>
        <el-table-column :label="t('article.pubDateColumn')" width="180">
          <template #default="{ row }">
            {{ formatTime(row.pub_date) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('article.statusColumn')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.state === '已发布' ? 'success' : 'info'">
              {{
                row.state === '已发布'
                  ? t('article.published')
                  : t('article.draft')
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('article.actionsColumn')"
          width="120"
          fixed="right"
        >
          <template #default="{ row }">
            <el-tooltip :content="t('article.editArticle')" placement="top">
              <el-button
                circle
                plain
                type="primary"
                :icon="Edit"
                :aria-label="t('article.editArticle')"
                @click="onEditArticle(row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip :content="t('article.deleteArticle')" placement="top">
              <el-button
                circle
                plain
                type="danger"
                :icon="Delete"
                :aria-label="t('article.deleteArticle')"
                @click="onDeleteArticle(row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

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

/* 表格容器：小屏时横向滚动 */
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
