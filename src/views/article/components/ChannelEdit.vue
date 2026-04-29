<!-- 局部组件：文章分类的编辑和添加子组件(dialog 组件)  -->
<script setup lang="ts">
/**
 * 文章分类编辑/添加弹窗组件
 * 用于处理分类的创建和更新
 */
// nextTick 是 Vue 提供的一个方法，用于在 DOM 更新完成后执行回调函数。它解决了数据更新后，DOM 尚未同步更新的问题，确保操作的是最新的 DOM。
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

// 表单校验规则
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

// 定义组件自定义事件
const emit = defineEmits(['success'])

/**
 * 表单提交处理
 */
const onSubmit = async () => {
  // 提交前的预校验
  await form.value.validate()
  if (formModel.value.id) {
    // 编辑分类
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    // 添加分类
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功')
  }
  // 关闭弹窗并通知父组件刷新列表
  dialogVisible.value = false
  emit('success')
}

// 暴露 open 方法给父组件调用
defineExpose({
  open
})
</script>

<!-- Dialog 组件需要设置 model-value / v-model 属性，它接收 Boolean，当为 true 时显示 Dialog。 -->
<!-- 组件分为两个部分：body 和 footer，footer 为一个具名插槽。 title 属性用于定义标题，它是可选的，默认值为空。 -->
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
