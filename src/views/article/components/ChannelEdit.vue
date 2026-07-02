<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { artEditChannelService, artAddChannelService } from '@/api/article'
import { ChannelFormData } from '@/types'
import { useI18n } from '@/composables'
import { getErrorMessage } from '@/utils/format'

const { t } = useI18n()

const EMPTY_FORM: ChannelFormData = { cate_name: '', cate_alias: '' }

const formModel = ref<ChannelFormData>({ ...EMPTY_FORM })
const dialogVisible = ref(false)
const form = ref()

const open = async (obj: ChannelFormData | null) => {
  // 先设置数据再打开 Dialog，避免渲染时 formModel 处于不确定状态
  formModel.value = obj ? { ...obj } : { ...EMPTY_FORM }
  dialogVisible.value = true
  await nextTick()
  form.value?.clearValidate()
}

const rules = computed(() => ({
  cate_name: [
    { required: true, message: t('channel.nameRequired'), trigger: 'blur' },
    {
      pattern: /^\S{2,7}$/,
      message: t('channel.namePattern'),
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: t('channel.aliasRequired'), trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{2,15}$/,
      message: t('channel.aliasPattern'),
      trigger: 'blur'
    }
  ]
}))

const emit = defineEmits(['success'])

const onSubmit = async () => {
  // 校验失败时表单自身已展示错误提示，静默返回
  try {
    await form.value.validate()
  } catch {
    return
  }

  try {
    if (formModel.value.id) {
      await artEditChannelService(formModel.value)
      ElMessage.success(t('channel.editSuccess'))
    } else {
      await artAddChannelService(formModel.value)
      ElMessage.success(t('channel.addSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } catch (err: unknown) {
    ElMessage.error(getErrorMessage(err, t('channel.addFailed')))
  }
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? t('channel.editTitle') : t('channel.addTitle')"
    width="400px"
    class="channel-dialog"
  >
    <el-form
      ref="form"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item :label="t('channel.nameLabel')" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          :placeholder="t('channel.namePlaceholder')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="t('channel.aliasLabel')" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          :placeholder="t('channel.aliasPlaceholder')"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          t('common.cancel')
        }}</el-button>
        <el-button type="primary" @click="onSubmit">{{
          t('channel.confirm')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
