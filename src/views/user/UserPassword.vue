<script setup lang="ts">
import { ref, computed } from 'vue'
import { userUpdatePasswordService } from '@/api/user'
import { UpdatePasswordData } from '@/types'
import { useUserStore } from '@/stores'
import type { UserInfo } from '@/types'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables'

const { t } = useI18n()

const form = ref()
const pwdForm = ref<UpdatePasswordData>({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

const checkDifferent = (
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void
) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error(t('password.notSame')))
  } else {
    callback()
  }
}

const checkSameAsNewPwd = (
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void
) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error(t('password.mustMatch')))
  } else {
    callback()
  }
}

const rules = computed(() => ({
  old_pwd: [
    { required: true, message: t('password.oldRequired'), trigger: 'blur' },
    { min: 6, max: 15, message: t('password.oldLength'), trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: t('password.newRequired'), trigger: 'blur' },
    {
      min: 6,
      max: 15,
      pattern: /^\S{6,15}$/,
      message: t('password.newPattern'),
      trigger: 'blur'
    },
    { validator: checkDifferent, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: t('password.confirmRequired'), trigger: 'blur' },
    { min: 6, max: 15, message: t('password.confirmLength'), trigger: 'blur' },
    { validator: checkSameAsNewPwd, trigger: 'blur' }
  ]
}))

const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)

const submitForm = async () => {
  try {
    await form.value.validate()
    loading.value = true
    await userUpdatePasswordService(pwdForm.value)
    ElMessage.success({ message: t('password.success'), duration: 1500 })
    // 修改成功后清除 token 和用户信息，跳转至登录页重新登录
    userStore.setToken('')
    userStore.setUser({} as UserInfo)
    router.push('/login')
  } catch {
    // 校验失败或接口报错
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value.resetFields()
}
</script>

<template>
  <page-container :title="t('password.title')">
    <div class="form-wrapper">
      <el-form ref="form" :model="pwdForm" :rules="rules" label-width="100px">
        <el-form-item :label="t('password.oldPassword')" prop="old_pwd">
          <el-input
            v-model="pwdForm.old_pwd"
            show-password
            :placeholder="t('password.oldPlaceholder')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="t('password.newPassword')" prop="new_pwd">
          <el-input
            v-model="pwdForm.new_pwd"
            show-password
            :placeholder="t('password.newPlaceholder')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="t('password.confirmPassword')" prop="re_pwd">
          <el-input
            v-model="pwdForm.re_pwd"
            show-password
            :placeholder="t('password.confirmPlaceholder')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">
            {{ t('password.submit') }}
          </el-button>
          <el-button type="info" @click="resetForm" plain>
            {{ t('password.reset') }}
          </el-button>
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
