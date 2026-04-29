<script setup lang="ts">
/**
 * 更换头像页面
 * 支持选择图片预览并上传更新用户头像
 */
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'

const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic) // 当前头像预览图
const upload = ref() // el-upload 组件实例

const onSelectFile = (uploadFile: any) => {
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result as string
  }
}

const loading = ref(false) // 上传按钮加载状态

/**
 * 确认上传头像
 */
const onUpdateAvatar = async () => {
  try {
    loading.value = true
    // 调用接口更新头像 (后端接收 base64 字符串)
    await userUpdateAvatarService(imgUrl.value ?? '')
    // 更新成功后刷新用户信息
    await userStore.getUser()
    ElMessage.success({ message: '头像更新成功', duration: 1500 })
  } catch {
    // 错误处理
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <page-container title="更换头像">
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

    <!-- 触发文件选择 -->
    <el-button
      @click="upload.$el.querySelector('input').click()"
      type="primary"
      :icon="Plus"
      size="large"
      >选择图片</el-button
    >
    <!-- 触发上传操作 -->
    <el-button
      @click="onUpdateAvatar"
      type="success"
      :icon="Upload"
      size="large"
      :loading="loading"
      >上传头像</el-button
    >
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
