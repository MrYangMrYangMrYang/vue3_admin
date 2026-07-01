<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'
import { useI18n } from '@/composables'

const { t } = useI18n()

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

const rules = computed(() => ({
  nickname: [
    { required: true, message: t('profile.nicknameRequired'), trigger: 'blur' },
    {
      pattern: /^\S{2,7}$/,
      message: t('profile.nicknamePattern'),
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: t('profile.emailRequired'), trigger: 'blur' },
    {
      type: 'email',
      message: t('profile.emailInvalid'),
      trigger: ['blur', 'change']
    }
  ]
}))

const loading = ref(false)

const submitForm = async () => {
  try {
    await form.value.validate()
    loading.value = true
    await userUpdateInfoService(user.value)
    await getUser()
    ElMessage.success({ message: t('profile.updateSuccess'), duration: 1500 })
  } catch {
    // 校验失败或接口报错处理
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <page-container :title="t('profile.title')">
    <div class="form-wrapper">
      <el-form ref="form" :model="user" :rules="rules" label-width="100px">
        <el-form-item :label="t('profile.account')">
          <el-input v-model="user.username" disabled></el-input>
        </el-form-item>
        <el-form-item :label="t('profile.nickname')" prop="nickname">
          <el-input
            v-model="user.nickname"
            :placeholder="t('profile.nicknamePlaceholder')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="t('profile.email')" prop="email">
          <el-input
            v-model="user.email"
            :placeholder="t('profile.emailPlaceholder')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">
            {{ t('profile.submit') }}
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
