<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'

const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic)
const upload = ref()

// 使用 FileReader 读取图片文件并转换为 base64 格式预览
const onSelectFile = (uploadFile) => {
  // 创建 FileReader 对象，用于读取文件内容
  const reader = new FileReader()
  // readAsDataURL() 方法将文件读取为 base64 编码的 Data URL 格式
  reader.readAsDataURL(uploadFile.raw) // uploadFile.raw 是原生的 File 对象
  // onload 事件在文件读取完成后触发
  reader.onload = () => {
    imgUrl.value = reader.result // 更新图片预览
  }
}
// 注意事项
// 这种方式将图片转换为 base64 字符串，适合小文件
// 大文件建议使用真正的文件上传而非 base64
// base64 数据会比原文件大约 33%

const onUpdateAvatar = async () => {
  // 发送请求更新头像
  await userUpdateAvatarService(imgUrl.value)
  // userStore 重新渲染
  await userStore.getUser()
  // 提示用户
  ElMessage.success('头像更新成功')
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
