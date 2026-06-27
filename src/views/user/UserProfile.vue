<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'

const form = ref()

const {
  user: { email, id, nickname, username },
  getUser
} = useUserStore()

const user = ref({
  id,
  username,
  nickname,
  email
})

const rules = ref({
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,7}$/,
      message: '昵称长度在2-7个非空字符',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: ['blur', 'change']
    }
  ]
})

const loading = ref(false)

const submitForm = async () => {
  try {
    await form.value.validate()
    loading.value = true
    await userUpdateInfoService(user.value)
    await getUser()
    ElMessage.success({ message: '修改成功', duration: 1500 })
  } catch {
    // 校验失败或接口报错处理
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <page-container title="基本资料">
    <div class="form-wrapper">
      <el-form ref="form" :model="user" :rules="rules" label-width="100px">
        <el-form-item label="账号名称">
          <el-input v-model="user.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input
            v-model="user.nickname"
            placeholder="请输入用户昵称"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input
            v-model="user.email"
            placeholder="请输入用户邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading"
            >提交修改</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </page-container>
</template>

<style lang="scss" scoped>
.form-wrapper {
  max-width: 500px;
  padding: 20px 0;
}
</style>
