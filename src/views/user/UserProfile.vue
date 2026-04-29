<script setup lang="ts">
/**
 * 用户基本资料页面
 * 用于展示和修改当前登录用户的基本信息（如昵称、邮箱）
 */
// 在按需导入element组件库时默认 src下的 components 组件也会被自动注册，所以不导入也能直接使用components下的组件
// import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'

const form = ref() // 获取表单实例

// 从仓库解构用户信息和获取信息的方法
const {
  user: { email, id, nickname, username },
  getUser
} = useUserStore()

// 初始化表单数据
const user = ref({
  id,
  username,
  nickname,
  email
})

// 表单校验规则
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

const loading = ref(false) // 提交按钮加载状态

/**
 * 提交基本资料修改
 */
const submitForm = async () => {
  try {
    // 提交前校验
    await form.value.validate()
    loading.value = true
    // 调用更新接口
    await userUpdateInfoService(user.value)
    // 更新本地仓库数据
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
      <!-- 表单部分 -->
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
