<script setup lang="ts">
/**
 * @fileoverview 角色编辑弹窗组件
 * @description 创建/编辑角色，分配权限码（多选 checkbox 组）
 */
import { ref, computed } from 'vue'
import { roleGetPermissionsService } from '@/api/role'
import { useI18n } from '@/composables/useI18n'
import type { Role, RoleFormData, PermissionCode } from '@/types'

const { t } = useI18n()

const emit = defineEmits<{
  success: []
}>()

/** 弹窗标题 */
const dialogTitle = ref('')
/** 弹窗可见性 */
const dialogVisible = ref(false)
/** 是否编辑模式 */
const isEdit = ref(false)
/** 当前编辑的角色 ID（新增时为 undefined） */
const editId = ref<number>()
/** 表单数据 */
const form = ref<RoleFormData>({
  name: '',
  label: '',
  description: '',
  permissions: []
})
/** 所有可用权限码 */
const allPermissions = ref<
  { code: PermissionCode; label: string; group: string }[]
>([])

/** 按 group 分组的权限码列表 */
const permissionGroups = computed(() => {
  const map = new Map<string, typeof allPermissions.value>()
  for (const p of allPermissions.value) {
    const list = map.get(p.group) || []
    list.push(p)
    map.set(p.group, list)
  }
  return [...map.entries()]
})

/** 打开新增弹窗 */
const open = async (): Promise<void> => {
  dialogTitle.value = t('role.addRole')
  isEdit.value = false
  editId.value = undefined
  form.value = { name: '', label: '', description: '', permissions: [] }
  dialogVisible.value = true
  await fetchPermissions()
}

/** 打开编辑弹窗 */
const openEdit = async (row: Role): Promise<void> => {
  dialogTitle.value = t('role.editRole')
  isEdit.value = true
  editId.value = row.id
  form.value = {
    name: row.name,
    label: row.label,
    description: row.description || '',
    permissions: [...row.permissions]
  }
  dialogVisible.value = true
  await fetchPermissions()
}

/** 加载可用权限码列表 */
const fetchPermissions = async (): Promise<void> => {
  if (allPermissions.value.length) return
  try {
    const res = await roleGetPermissionsService()
    allPermissions.value = res.data
  } catch {
    // 静默处理
  }
}

/** 选中/取消所有权限码 */
const toggleAll = (group: string, checked: boolean) => {
  const codes = allPermissions.value
    .filter((p) => p.group === group)
    .map((p) => p.code)
  if (checked) {
    codes.forEach((c) => {
      if (!form.value.permissions.includes(c)) form.value.permissions.push(c)
    })
  } else {
    form.value.permissions = form.value.permissions.filter(
      (c) => !codes.includes(c)
    )
  }
}

/** 判断某个分组是否全选 */
const isGroupAllChecked = (group: string): boolean => {
  const codes = allPermissions.value
    .filter((p) => p.group === group)
    .map((p) => p.code)
  return codes.every((c) => form.value.permissions.includes(c))
}

const loading = ref(false)

/** 提交表单 */
const onSubmit = async (): Promise<void> => {
  if (!form.value.name || !form.value.label) return
  loading.value = true
  try {
    // 动态导入 API，避免循环依赖
    const { roleCreateService, roleUpdateService } = await import('@/api/role')
    if (isEdit.value && editId.value) {
      await roleUpdateService(editId.value, form.value)
    } else {
      await roleCreateService(form.value)
    }
    ElMessage.success(
      isEdit.value ? t('role.updateSuccess') : t('role.createSuccess')
    )
    dialogVisible.value = false
    emit('success')
  } catch {
    // 错误提示已在拦截器处理
  } finally {
    loading.value = false
  }
}

defineExpose({ open, openEdit })
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="560px"
    destroy-on-close
  >
    <el-form
      :model="form"
      label-width="90px"
      :disabled="loading"
      @submit.prevent="onSubmit"
    >
      <el-form-item :label="t('role.name')" required>
        <el-input
          v-model="form.name"
          :placeholder="t('role.namePlaceholder')"
          :disabled="isEdit"
        />
      </el-form-item>
      <el-form-item :label="t('role.label')" required>
        <el-input
          v-model="form.label"
          :placeholder="t('role.labelPlaceholder')"
        />
      </el-form-item>
      <el-form-item :label="t('role.description')">
        <el-input
          v-model="form.description"
          :placeholder="t('role.descPlaceholder')"
        />
      </el-form-item>
      <el-form-item :label="t('role.permissions')">
        <div class="permission-groups">
          <div
            v-for="[group, perms] in permissionGroups"
            :key="group"
            class="perm-group"
          >
            <el-checkbox
              :model-value="isGroupAllChecked(group)"
              :label="group"
              @change="(val: boolean) => toggleAll(group, val)"
            />
            <div class="perm-children">
              <el-checkbox
                v-for="p in perms"
                :key="p.code"
                :model-value="form.permissions.includes(p.code)"
                :label="p.label"
                @change="
                  (val: boolean) => {
                    if (val) {
                      if (!form.permissions.includes(p.code))
                        form.permissions.push(p.code)
                    } else {
                      form.permissions = form.permissions.filter(
                        (c) => c !== p.code
                      )
                    }
                  }
                "
              />
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">{{
        t('common.cancel')
      }}</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">
        {{ t('common.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.permission-groups {
  max-height: 300px;
  overflow-y: auto;
  width: 100%;

  .perm-group {
    margin-bottom: 12px;

    .perm-children {
      margin-left: 24px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px 16px;
    }
  }
}
</style>
