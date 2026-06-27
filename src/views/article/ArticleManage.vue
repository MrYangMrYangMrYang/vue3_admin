<script setup lang="ts">
/**
 * 文章管理页面
 * 包含文章列表展示、搜索过滤、分页查询以及文章的添加、编辑、删除操作
 *
 * @remarks
 * 使用 useTable composable 封装分页列表逻辑，消除重复样板代码
 */
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import { artGetListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/format'
import { useTable } from '@/composables'
import type { ArticleDetail } from '@/types'

/**
 * 分页列表管理
 * @description useTable 自动管理 list/total/loading/params 与分页/搜索/重置逻辑
 */
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

const articleEdit = ref() // ArticleEdit 组件实例引用

/**
 * 添加文章
 */
const onAddArticle = () => {
  articleEdit.value.open({})
}

/**
 * 编辑文章
 * @param {ArticleDetail} row - 当前行数据
 */
const onEditArticle = (row: ArticleDetail) => {
  articleEdit.value.open(row)
}

/**
 * 删除文章
 * @param {ArticleDetail} row - 当前行数据
 */
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

/**
 * 子组件操作成功后的回调
 * @param {string} type - 操作类型 (add/edit)
 */
const onSuccess = (type: string) => {
  if (type === 'add') {
    // 添加成功，计算并跳转到最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  // 重新加载当前页数据
  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
    <!-- 封装的抽屉组件 -->
    <ArticleEdit ref="articleEdit" @success="onSuccess"></ArticleEdit>

    <!-- 表单区域 -->
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

    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading" border stripe>
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

    <!-- 分页区域 -->
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
</style>
