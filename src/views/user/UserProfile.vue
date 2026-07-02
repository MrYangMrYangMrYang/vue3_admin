<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'
import { useI18n } from '@/composables'
import { getErrorMessage } from '@/utils/format'

const { t } = useI18n()

const userStore = useUserStore()

const user = ref({
  id: userStore.user?.id ?? 0,
  username: userStore.user?.username ?? '',
  nickname: userStore.user?.nickname ?? '',
  email: userStore.user?.email ?? ''
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

const form = ref()
const loading = ref(false)

const submitForm = async () => {
  try {
    await form.value.validate()
  } catch {
    return // 校验失败由表单自身展示红色提示，不弹消息
  }

  try {
    loading.value = true
    await userUpdateInfoService(user.value)
    await userStore.getUser()
    ElMessage.success({ message: t('profile.updateSuccess'), duration: 1500 })
  } catch (err: unknown) {
    ElMessage.error(getErrorMessage(err, t('profile.updateFailed')))
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
