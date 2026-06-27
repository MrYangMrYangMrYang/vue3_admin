<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { artEditChannelService, artAddChannelService } from '@/api/article'
import { ChannelFormData } from '@/types'

const formModel = ref<ChannelFormData>({ cate_name: '', cate_alias: '' })
const dialogVisible = ref(false)
const form = ref()

const open = async (obj: ChannelFormData) => {
  dialogVisible.value = true
  await nextTick()
  formModel.value = { ...obj }
  form.value?.clearValidate()
}

const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{2,7}$/,
      message: '必须是2-7位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{2,15}$/,
      message: '必须是2-15位的字母或数字',
      trigger: 'blur'
    }
  ]
}

const emit = defineEmits(['success'])

const onSubmit = async () => {
  await form.value.validate()
  if (formModel.value.id) {
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  emit('success')
}

defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
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
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          placeholder="请输入分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="请输入分类别名"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
