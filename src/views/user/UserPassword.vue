<script setup>
/**
 * 修改密码页面
 * 提供原密码校验、新密码与原密码差异校验以及确认密码一致性校验
 */
import { ref } from 'vue'
import { userUpdatePasswordService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const form = ref() // 获取表单实例
const pwdForm = ref({
  old_pwd: '', // 原密码
  new_pwd: '', // 新密码
  re_pwd: '' // 确认密码
})

/**
 * 自定义校验规则：校验新密码不能与原密码相同
 */
const checkDifferent = (_rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码一样'))
  } else {
    callback()
  }
}

/**
 * 自定义校验规则：校验确认密码必须与新密码一致
 */
const checkSameAsNewPwd = (_rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('确认密码必须和新密码一样'))
  } else {
    callback()
  }
}

// 表单校验规则
const rules = ref({
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 15, message: '原密码长度在6-15位之间', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      min: 6,
      max: 15,
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    },
    { validator: checkDifferent, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '确认密码长度在6-15位之间', trigger: 'blur' },
    { validator: checkSameAsNewPwd, trigger: 'blur' }
  ]
})

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false) // 提交按钮加载状态

/**
 * 提交修改密码请求
 */
const submitForm = async () => {
  try {
    await form.value.validate()
    loading.value = true
    await userUpdatePasswordService(pwdForm.value)
    ElMessage.success({ message: '密码修改成功', duration: 1500 })
    // 修改成功后，清除 token 和用户信息并跳转至登录页重新登录
    userStore.setToken('')
    userStore.setUser({})
    router.push('/login')
  } catch {
    // 校验失败或接口报错
  } finally {
    loading.value = false
  }
}

/**
 * 重置表单内容及校验状态
 */
const resetForm = () => {
  form.value.resetFields()
}
</script>

<template>
  <page-container title="修改密码">
    <div class="form-wrapper">
      <el-form ref="form" :model="pwdForm" :rules="rules" label-width="100px">
        <el-form-item label="原密码" prop="old_pwd">
          <el-input
            v-model="pwdForm.old_pwd"
            show-password
            placeholder="请输入原密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_pwd">
          <el-input
            v-model="pwdForm.new_pwd"
            show-password
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="re_pwd">
          <el-input
            v-model="pwdForm.re_pwd"
            show-password
            placeholder="请再次输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading"
            >修改密码</el-button
          >
          <el-button type="info" @click="resetForm" plain>重置</el-button>
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
