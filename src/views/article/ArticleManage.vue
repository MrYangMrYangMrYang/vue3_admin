<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import { artGetListService, artDelService } from '@/api/article'
import { formatTime, getErrorMessage } from '@/utils/format'
import { useTable, useI18n } from '@/composables'
import type { ArticleDetail } from '@/types'
import SkeletonTable from '@/components/SkeletonTable.vue'

const { t } = useI18n()

/** 文章发布状态常量（值与后端 API 约定一致） */
const STATE_PUBLISHED = '已发布'
const STATE_DRAFT = '草稿'

/** 组件名（供 keep-alive include 匹配，缓存列表页状态） */
defineOptions({ name: 'article-manage' })

const route = useRoute()

/** 首次加载使用骨架屏，后续刷新用 v-loading */
const isFirstLoad = ref(true)

// 从 URL query 读取初始筛选状态（支持浏览器刷新恢复、链接分享）
const urlCateId = (route.query.cate_id as string) || ''
const urlState = (route.query.state as string) || ''
const urlPageNum = parseInt(route.query.pagenum as string) || 1
const urlPageSize = parseInt(route.query.pagesize as string) || 5

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
  initialParams: {
    cate_id: urlCateId,
    state: urlState,
    pagenum: urlPageNum
  } as Record<string, string | number>,
  initialPageSize: urlPageSize
})

/** params → URL query 延迟同步（请求完成后再更新 URL，彻底避免竞态） */
const syncURL = () => {
  const p = params.value
  const q = new URLSearchParams()
  if (p.pagenum > 1) q.set('pagenum', String(p.pagenum))
  if (p.pagesize !== 5) q.set('pagesize', String(p.pagesize))
  if (p.cate_id) q.set('cate_id', p.cate_id)
  if (p.state) q.set('state', p.state)
  const qs = q.toString()
  history.replaceState(null, '', route.path + (qs ? '?' + qs : ''))
}

watch(loading, (val) => {
  if (!val) {
    isFirstLoad.value = false
    syncURL()
  }
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
  } catch {
    // 用户取消删除
    return
  }

  try {
    await artDelService(row.id)
    ElMessage.success(t('article.deleteSuccess'))
    getArticleList()
  } catch (err: unknown) {
    ElMessage.error(getErrorMessage(err, t('article.deleteFailed')))
  }
}

const selectedRows = ref<ArticleDetail[]>([])

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
  } catch {
    // 用户取消批量删除
    return
  }

  const results = await Promise.allSettled(
    selectedRows.value.map((row) => artDelService(row.id))
  )
  const successCount = results.filter((r) => r.status === 'fulfilled').length
  const failCount = results.length - successCount

  if (failCount === 0) {
    ElMessage.success(t('article.batchDeleteSuccess', { count: successCount }))
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
}

const onSuccess = (type: string) => {
  if (type === 'add') {
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
          <el-option
            :label="t('article.published')"
            :value="STATE_PUBLISHED"
          ></el-option>
          <el-option
            :label="t('article.draft')"
            :value="STATE_DRAFT"
          ></el-option>
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
            <el-tag :type="row.state === STATE_PUBLISHED ? 'success' : 'info'">
              {{
                row.state === STATE_PUBLISHED
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

.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
