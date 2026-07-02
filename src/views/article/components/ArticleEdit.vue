<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishService,
  artGetDetailService,
  artEditService
} from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'
import { useI18n } from '@/composables'
import { getErrorMessage } from '@/utils/format'

const { t } = useI18n()

const visibleDrawer = ref(false)
const form = ref()

interface ArticleFormModel {
  id?: number
  title: string
  cate_id: string | number
  cover_img: string | File
  content: string
  state: string
}

const formModel = ref<ArticleFormModel>({
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
})

const rules = computed(() => ({
  title: [
    { required: true, message: t('article.titleRequired'), trigger: 'blur' },
    {
      min: 2,
      max: 15,
      pattern: /^\S{2,15}$/,
      message: t('article.titlePattern'),
      trigger: 'blur'
    }
  ],
  cate_id: [
    {
      required: true,
      message: t('article.categoryRequired'),
      trigger: ['blur', 'change']
    }
  ],
  cover_img: [
    { required: true, message: t('article.coverRequired'), trigger: 'change' }
  ],
  content: [
    {
      required: true,
      validator: (
        _rule: unknown,
        value: string,
        callback: (error?: Error) => void
      ) => {
        const textContent = value ? value.replace(/<[^>]*>/g, '').trim() : ''
        if (!textContent) {
          callback(new Error(t('article.contentRequired')))
        } else if (textContent.length < 2) {
          callback(new Error(t('article.contentMin')))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}))

const imgUrl = ref('')

const onSelectFile = (uploadFile: UploadFile) => {
  if (!uploadFile.raw) return
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
  nextTick(() => {
    form.value?.validateField('cover_img')
  })
}

async function imageUrlToFileObject(
  imageUrl: string,
  filename: string
): Promise<File | null> {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })
    const file = new File([blob], filename, {
      type: response.headers['content-type']
    })
    return file
  } catch {
    ElMessage.error(t('article.imageConvertFailed'))
    return null
  }
}

const emit = defineEmits(['success'])

const publishing = ref(false)

const onPublish = async (state: string) => {
  try {
    await form.value.validate()
  } catch {
    return
  }

  formModel.value.state = state

  const fd = new FormData()
  fd.append('title', formModel.value.title)
  fd.append('cate_id', String(formModel.value.cate_id))
  fd.append('content', formModel.value.content)
  fd.append('state', formModel.value.state)
  if (formModel.value.cover_img instanceof File) {
    fd.append('cover_img', formModel.value.cover_img)
  } else {
    fd.append('cover_img', formModel.value.cover_img as string)
  }

  publishing.value = true
  try {
    if (formModel.value.id) {
      fd.append('id', String(formModel.value.id))
      await artEditService(fd)
      ElMessage.success(t('article.editSuccess'))
      visibleDrawer.value = false
      emit('success', 'edit')
    } else {
      await artPublishService(fd)
      ElMessage.success(t('article.addSuccess'))
      visibleDrawer.value = false
      emit('success', 'add')
    }
  } catch (err: unknown) {
    ElMessage.error(getErrorMessage(err, t('article.publishFailed')))
  } finally {
    publishing.value = false
  }
}

const editor = ref()

const open = async (obj: Partial<ArticleFormModel>) => {
  visibleDrawer.value = true
  await nextTick()

  if (obj.id) {
    const res = await artGetDetailService(obj.id!)
    const data = res.data
    // 先保留原始 URL 作为 cover_img 兜底值，imageUrlToFileObject 失败时不丢
    formModel.value = {
      id: data.id,
      title: data.title,
      cate_id: data.cate_id,
      cover_img: data.cover_img,
      content: data.content,
      state: data.state
    }
    imgUrl.value = baseURL + data.cover_img
    const file = await imageUrlToFileObject(imgUrl.value, data.cover_img)
    if (file) {
      formModel.value.cover_img = file
    }
  } else {
    formModel.value = {
      title: '',
      cate_id: '',
      cover_img: '',
      content: '',
      state: ''
    }
    imgUrl.value = ''
    editor.value?.setHTML('')
    form.value?.resetFields()
  }
}

const onEditorChange = () => {
  form.value?.validateField('content')
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? t('article.editTitle') : t('article.addTitle')"
    direction="rtl"
    size="50%"
    class="article-drawer"
  >
    <el-form :model="formModel" :rules="rules" ref="form" label-width="100px">
      <el-form-item :label="t('article.titleColumn')" prop="title">
        <el-input
          v-model="formModel.title"
          :placeholder="t('article.titlePlaceholder')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="t('article.category')" prop="cate_id">
        <ChannelSelect v-model="formModel.cate_id" width="100%"></ChannelSelect>
      </el-form-item>
      <el-form-item :label="t('article.coverLabel')" prop="cover_img">
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
      <el-form-item :label="t('article.contentLabel')" prop="content">
        <div class="editor">
          <quill-editor
            ref="editor"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
            @update:content="onEditorChange"
            :placeholder="t('article.contentPlaceholder')"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="onPublish('已发布')"
          type="primary"
          :loading="publishing"
          >{{ t('article.publish') }}</el-button
        >
        <el-button
          @click="onPublish('草稿')"
          type="info"
          :loading="publishing"
          >{{ t('article.saveDraft') }}</el-button
        >
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.article-drawer {
  :deep(.el-drawer) {
    width: 50% !important;
    min-width: 400px;
    @media (max-width: 768px) {
      width: 100% !important;
    }
  }
}
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
