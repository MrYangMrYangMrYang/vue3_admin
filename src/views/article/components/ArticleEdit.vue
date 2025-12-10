<!-- 局部组件：文章管理的编辑和添加子组件(Drawer 抽屉组件)  -->
<script setup>
import { ref, nextTick } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
// 引入适配vue3的富文本编辑器:vue-quill
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishService,
  artGetDetailService,
  artEditService
} from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'

// 控制抽屉显示隐藏
const visibleDrawer = ref(false)
// 表单引用
const form = ref()
// 准备默认数据
const formModel = ref({
  title: '', // 标题
  cate_id: '', // 分类id
  cover_img: '', // 封面图片 file 对象
  content: '', // string 内容
  state: '' // 状态
})
// 表单校验规则
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    {
      min: 2,
      max: 15,
      pattern: /^\S{2,15}$/,
      message: '标题必须是2到15位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_id: [
    { required: true, message: '请选择文章分类', trigger: ['blur', 'change'] }
  ],
  cover_img: [{ required: true, message: '请上传文章封面', trigger: 'change' }],
  content: [
    {
      required: true,
      validator: (rule, value, callback) => {
        // replace() 用于在字符串中搜索指定的值或正则表达式，并返回一个新的字符串，其中的匹配项被替换为指定的替换值。为了替换所有匹配项，可以使用带有 g 修饰符的正则表达式
        // trim() 用于删除字符串的头尾空白符(空白符包括：空格、制表符 tab、换行符等)，然后返回移除头尾空格的字符串
        const textContent = value ? value.replace(/<[^>]*>/g, '').trim() : '' // 去除 HTML 标签后验证纯文本内容
        if (!textContent) {
          callback(new Error('请输入文章内容'))
        } else if (textContent.length < 2) {
          callback(new Error('文章内容至少需要2个字符'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 图片上传
const imgUrl = ref('') // 创建一个响应式变量 imgUrl，用于存储图片预览的 URL
const onSelectFile = (uploadFile) => {
  // URL.createObjectURL() 方法为文件创建一个临时的本地 URL 用于图片预览
  imgUrl.value = URL.createObjectURL(uploadFile.raw) // uploadFile.raw 是原生的 File 对象
  // 立刻将图片对象，存入 formModel.value.cover_img 将来用于提交
  formModel.value.cover_img = uploadFile.raw
  // 手动触发封面图片的校验
  nextTick(() => {
    form.value?.validateField('cover_img')
  })
}
// 这种方案更适合处理较大的图片文件或需要直接上传 File 对象的场景。
// 与使用 FileReader 相比
// 性能更好：不需要读取文件内容，直接创建引用
// 内存友好：适合处理大文件
// 上传方便：直接使用 File 对象，无需额外处理
// 注意事项 : 在组件卸载或不需要时应清理对象 URL=> URL.revokeObjectURL(imgUrl.value)

// 将网络图片地址转换为 File 对象的函数
async function imageUrlToFileObject(imageUrl, filename) {
  try {
    // 使用 Axios 下载图片数据
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    // 将下载的数据转换成 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })
    // 创建 File 对象
    const file = new File([blob], filename, {
      type: response.headers['content-type']
    })
    return file
  } catch (error) {
    ElMessage.error(error)
    return null
  }
}

// 提交
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  await form.value.validate()
  // 将已发布还是草稿状态，存入 formModel
  formModel.value.state = state
  // 注意：当前接口，需要的是 formData 对象
  // 通过循环将数据对象 => 转换成 => formData对象
  const fd = new FormData()
  for (const key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 发请求
  if (formModel.value.id) {
    // 编辑操作
    await artEditService(fd)
    ElMessage.success('修改成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 添加操作
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    // 通知到父组件，添加成功了
    emit('success', 'add')
  }
}

// 组件对外暴露一个方法 open，基于open传来的参数，区分添加还是编辑
// open({})  => 表单无需渲染，说明是添加
// open({ id, ..., ... })  => 表单需要渲染，说明是编辑
// open调用后，可以打开抽屉
const editor = ref()
const open = async (obj) => {
  visibleDrawer.value = true
  // 等待抽屉完全渲染
  await nextTick()
  // 如果是编辑，需要基于 row.id 发送请求，获取编辑对应的详情数据，进行回显
  if (obj.id) {
    const res = await artGetDetailService(obj.id)
    formModel.value = res.data.data
    // 图片需要单独处理回显
    imgUrl.value = baseURL + formModel.value.cover_img
    // 注意：提交给后台，需要的数据格式，是file对象格式
    // 需要将网络图片地址 => 转换成 file对象，存储起来, 将来便于提交
    const file = await imageUrlToFileObject(
      imgUrl.value,
      formModel.value.cover_img
    )
    formModel.value.cover_img = file
  } else {
    // 如果是添加则重置表单
    formModel.value = { obj }
    // 非表单字段的图片路径和富文本内容需要手动重置
    imgUrl.value = ''
    editor.value?.setHTML('')
    // 彻底重置表单数据并清除残留的验证状态
    form.value?.resetFields()
  }
}

// 富文本内容的变化监听
const onEditorChange = () => {
  // 内容改变后实时进行验证
  form.value?.validateField('content')
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <ChannelSelect v-model="formModel.cate_id" width="100%"></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭 element-plus 的自动上传，不需要配置 action 等参数
             只需要做前端的本地预览图片即可，无需在提交前上传图标
             语法：URL.createObjectURL(...) 创建本地预览的地址，用来预览上传的图片
        -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <!-- v-model:xxx - 带参数的双向绑定 => 绑定对象或指定属性，这里绑定的是formModel的content属性 -->
        <div class="editor">
          <quill-editor
            ref="editor"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
            @update:content="onEditorChange"
            placeholder="请输入文章内容..."
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
