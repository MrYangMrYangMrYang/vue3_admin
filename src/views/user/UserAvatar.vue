<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'
import { useI18n } from '@/composables'
import { getErrorMessage } from '@/utils/format'

const { t } = useI18n()

const userStore = useUserStore()
const imgUrl = ref(userStore.user?.user_pic)
const upload = ref()
const fileSelected = ref(false)

const onSelectFile = (uploadFile: { raw: Blob }) => {
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result as string
    fileSelected.value = true
  }
}

const loading = ref(false)

const onUpdateAvatar = async () => {
  if (!fileSelected.value) {
    ElMessage.warning(t('avatar.noFileSelected'))
    return
  }
  try {
    loading.value = true
    await userUpdateAvatarService(imgUrl.value ?? '')
    await userStore.getUser()
    ElMessage.success({ message: t('avatar.success'), duration: 1500 })
  } catch (err: unknown) {
    ElMessage.error(getErrorMessage(err, t('avatar.failed')))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <page-container :title="t('avatar.title')">
    <el-upload
      ref="upload"
      :auto-upload="false"
      class="avatar-uploader"
      :show-file-list="false"
      :on-change="onSelectFile"
    >
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>

    <br />

    <el-button
      @click="upload.$el.querySelector('input').click()"
      type="primary"
      :icon="Plus"
      size="large"
    >
      {{ t('avatar.selectImage') }}
    </el-button>
    <el-button
      @click="onUpdateAvatar"
      type="success"
      :icon="Upload"
      size="large"
      :loading="loading"
    >
      {{ t('avatar.upload') }}
    </el-button>
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
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
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
