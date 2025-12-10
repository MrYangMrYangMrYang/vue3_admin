<!-- 局部组件：文章分类的编辑和添加子组件(dialog 组件)  -->
<script setup>
// nextTick 是 Vue 提供的一个方法，用于在 DOM 更新完成后执行回调函数。它解决了数据更新后，DOM 尚未同步更新的问题，确保操作的是最新的 DOM。
import { ref, nextTick } from 'vue'
import { artEditChannelService, artAddChannelService } from '@/api/article.js'

const formModel = ref({ cate_name: '', cate_alias: '' })
const dialogVisible = ref(false) //定义弹层阀门
const form = ref() // 通过ref标识获取element表单实例

// 子组件对外暴露一个方法 open，基于open传来的参数，区分添加还是编辑
// open({})  => 表单无需渲染，说明是添加
// open({ id, cate_name, ... })  => 表单需要渲染，说明是编辑
// open调用后，可以打开弹窗
// 定义用于提交的form数据对象
const open = async (obj) => {
  dialogVisible.value = true
  // 等待弹层完全渲染
  await nextTick()
  // 如果是编辑则回显数据，如果是添加则重置表单内容
  formModel.value = { ...obj }
  // clearValidate() => Element Plus 表单组件提供的方法 => 清除表单的验证状态
  form.value?.clearValidate()
}

// 表单的添加和编辑
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
//定义子传父的监听事件函数
const emit = defineEmits(['success'])
// 表单提交
const onSubmit = async () => {
  // 预校验
  await form.value.validate()
  if (formModel.value.id) {
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  // 成功后提交事件函数，通知父组件更新数据
  emit('success')
}

// 子组件向外暴露的方法
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
    width="30%"
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
