<script setup lang="ts">
/**
 * @fileoverview 角色管理页面
 * @description 角色列表展示，支持新增、编辑、删除角色（需 role:manage 权限）
 */
import { ref, onMounted } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { roleGetListService, roleDeleteService } from '@/api/role'
import { useI18n } from '@/composables/useI18n'
import type { Role } from '@/types'
import RoleEdit from './components/RoleEdit.vue'
import PageContainer from '@/components/PageContainer.vue'

const { t } = useI18n()

const list = ref<Role[]>([])
const loading = ref(false)

const getList = async (): Promise<void> => {
  loading.value = true
  try {
    const res = await roleGetListService()
    list.value = res.data
  } catch {
    // 错误提示已在拦截器处理
  } finally {
    loading.value = false
  }
}

const roleEdit = ref<InstanceType<typeof RoleEdit>>()

const onAddRole = () => {
  roleEdit.value?.open()
}

const onEditRole = (row: Role) => {
  roleEdit.value?.openEdit(row)
}

const onDeleteRole = async (row: Role) => {
  try {
    await ElMessageBox.confirm(
      t('role.deleteConfirm'),
      t('common.deleteConfirm'),
      {
        type: 'warning',
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel')
      }
    )
  } catch {
    return
  }
  try {
    await roleDeleteService(row.id)
    ElMessage.success(t('role.deleteSuccess'))
    getList()
  } catch {
    // 错误提示已在拦截器处理
  }
}

const onSuccess = () => {
  getList()
}

onMounted(() => {
  getList()
})
</script>

<template>
  <PageContainer :title="t('role.title')">
    <template #extra>
      <el-button type="primary" v-permission="'role:manage'" @click="onAddRole">
        {{ t('role.addRole') }}
      </el-button>
    </template>

    <RoleEdit ref="roleEdit" @success="onSuccess" />

    <el-table
      v-loading="loading"
      :data="list"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column type="index" width="60" :label="'#'" />
      <el-table-column prop="name" :label="t('role.name')" width="150" />
      <el-table-column prop="label" :label="t('role.label')" width="150" />
      <el-table-column
        prop="description"
        :label="t('role.description')"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column :label="t('role.permissions')" min-width="250">
        <template #default="{ row }">
          <el-tag
            v-for="perm in row.permissions"
            :key="perm"
            size="small"
            style="margin: 2px"
          >
            {{ perm }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('article.actionsColumn')"
        width="150"
        fixed="right"
      >
        <template #default="{ row }">
          <el-tooltip
            v-permission="'role:manage'"
            :content="t('role.editRole')"
            placement="top"
          >
            <el-button
              :icon="Edit"
              circle
              plain
              type="primary"
              :aria-label="t('role.editRole')"
              @click="onEditRole(row)"
            />
          </el-tooltip>
          <el-tooltip
            v-permission="'role:manage'"
            :content="t('role.deleteRole')"
            placement="top"
          >
            <el-button
              :icon="Delete"
              circle
              plain
              type="danger"
              :aria-label="t('role.deleteRole')"
              @click="onDeleteRole(row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </PageContainer>
</template>
