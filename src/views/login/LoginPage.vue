<script setup lang="ts">
import { userRegisterService, userLoginService } from '@/api/user'
import { RegisterData, LoginData } from '@/types'
import { User, Lock, View, Hide } from '@element-plus/icons-vue'
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import AnimatedCharacters from '@/components/AnimatedCharacters.vue'
import { useI18n } from '@/composables/useI18n'
import { getErrorMessage } from '@/utils/format'

const { t } = useI18n()

const formModel = ref<RegisterData & LoginData & { role: string }>({
  username: '',
  password: '',
  repassword: '',
  role: 'viewer'
})
const rememberMe = ref(false)

// 动画状态：isTyping 触发对视动画，showPassword 触发偷看动画
const isTyping = ref(false)
const showPassword = ref(false)
const passwordLength = computed(() => formModel.value.password.length)

onMounted(() => {
  const savedUsername = localStorage.getItem('big-event-username')
  if (savedUsername) {
    formModel.value.username = savedUsername
    rememberMe.value = true
  }
})

const rules = computed(() => ({
  username: [
    { required: true, message: t('login.usernameRequired'), trigger: 'blur' },
    {
      min: 2,
      max: 7,
      pattern: /^\S{2,7}$/,
      message: t('login.usernamePattern'),
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: t('login.passwordRequired'), trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: t('login.passwordPattern'),
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: t('login.confirmRequired'), trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: t('login.passwordPattern'),
      trigger: 'blur'
    },
    {
      validator: (
        _rule: unknown,
        value: string,
        callback: (error?: Error) => void
      ) => {
        if (value !== formModel.value.password) {
          callback(new Error(t('login.confirmMismatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}))

const form = ref()
const isRegister = ref(false)
const loading = ref(false)

const register = async () => {
  try {
    await form.value.validate()
    loading.value = true
    await userRegisterService(formModel.value)
    ElMessage.success(t('login.registerSuccess'))
    isRegister.value = false
  } catch (err: unknown) {
    ElMessage.error(getErrorMessage(err, t('login.registerFailed')))
  } finally {
    loading.value = false
  }
}

const userStore = useUserStore()
const router = useRouter()

const login = async () => {
  try {
    await form.value.validate()
    loading.value = true
    const res = await userLoginService(formModel.value)

    // 响应兼容：token 可能位于 data 包裹层或顶层，用可选链安全提取
    const token = res.data?.token ?? (res as { token?: string }).token
    if (!token) {
      throw new Error(t('login.tokenMissing'))
    }

    userStore.setToken(token)

    if (rememberMe.value) {
      localStorage.setItem('big-event-username', formModel.value.username)
    } else {
      localStorage.removeItem('big-event-username')
    }

    ElMessage.success(t('login.success'))

    // nextTick 确保 Token 持久化后再跳转
    await nextTick()
    router.push('/article/channel')
  } catch {
    // 错误提示已在 axios 拦截器中统一处理，此处仅静默捕获
  } finally {
    loading.value = false
  }
}

// 切换模式时重置表单内容和校验状态
watch(isRegister, () => {
  form.value.resetFields()
})

const onPasswordFocus = () => {
  isTyping.value = true
}

const forgotDialogVisible = ref(false)
const onForgotPassword = () => {
  forgotDialogVisible.value = true
}
</script>

<template>
  <div class="container">
    <!-- 左侧：品牌视觉区 -->
    <div class="leftPanel">
      <div class="leftTop">
        <div class="brandMark">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect
              width="28"
              height="28"
              rx="7"
              fill="white"
              fill-opacity="0.15"
            />
            <path
              d="M7 14L12 9L17 14L12 19L7 14Z"
              fill="white"
              fill-opacity="0.9"
            />
            <path
              d="M13 14L18 9L21 12V16L18 19L13 14Z"
              fill="white"
              fill-opacity="0.5"
            />
          </svg>
        </div>
        <span class="brandName">Big Event</span>
      </div>

      <div class="charactersArea">
        <AnimatedCharacters
          :is-typing="isTyping"
          :show-password="showPassword"
          :password-length="passwordLength"
        />
      </div>

      <div class="leftFooter">
        <a href="#">{{ t('login.helpCenter') }}</a>
        <a href="#">{{ t('login.privacyPolicy') }}</a>
      </div>

      <div class="decorBlur1"></div>
      <div class="decorBlur2"></div>
      <div class="decorGrid"></div>
    </div>

    <!-- 右侧：登录表单 -->
    <div class="rightPanel">
      <div class="formWrapper">
        <div class="mobileLogo">
          <div class="mobileLogoIcon">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <path
                d="M7 14L12 9L17 14L12 19L7 14Z"
                fill="#1e40af"
                fill-opacity="0.9"
              />
              <path
                d="M13 14L18 9L21 12V16L18 19L13 14Z"
                fill="#3b82f6"
                fill-opacity="0.7"
              />
            </svg>
          </div>
          <span>{{ t('login.brand') }}</span>
        </div>

        <div class="formHeader">
          <transition name="fade-slide" mode="out-in">
            <div :key="isRegister ? 'register' : 'login'">
              <h1 class="formTitle">
                {{ isRegister ? t('login.titleRegister') : t('login.title') }}
              </h1>
              <p class="formSubtitle">
                {{
                  isRegister ? t('login.subtitleRegister') : t('login.subtitle')
                }}
              </p>
            </div>
          </transition>
        </div>

        <el-form
          :model="formModel"
          :rules="rules"
          ref="form"
          size="large"
          autocomplete="off"
          class="form"
        >
          <div class="fieldLabel">{{ t('login.account') }}</div>
          <el-form-item prop="username">
            <el-input
              v-model="formModel.username"
              :prefix-icon="User"
              :placeholder="t('login.accountPlaceholder')"
            ></el-input>
          </el-form-item>

          <div class="fieldLabel">{{ t('login.password') }}</div>
          <el-form-item prop="password">
            <el-input
              v-model="formModel.password"
              :prefix-icon="Lock"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="t('login.passwordPlaceholder')"
              @focus="onPasswordFocus"
              @blur="isTyping = false"
            >
              <template #suffix>
                <el-icon
                  class="eyeToggle"
                  @click="showPassword = !showPassword"
                >
                  <component :is="showPassword ? View : Hide" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <transition name="fade-height">
            <div v-if="isRegister">
              <div class="fieldLabel">{{ t('login.confirmPassword') }}</div>
              <el-form-item prop="repassword">
                <el-input
                  v-model="formModel.repassword"
                  :prefix-icon="Lock"
                  type="password"
                  :placeholder="t('login.confirmPlaceholder')"
                  @focus="isTyping = true"
                  @blur="isTyping = false"
                ></el-input>
              </el-form-item>

              <div class="fieldLabel">{{ t('login.role') }}</div>
              <el-form-item prop="role">
                <el-select
                  v-model="formModel.role"
                  :placeholder="t('login.role')"
                  style="width: 100%"
                >
                  <el-option label="编辑者 — 可管理文章内容" value="editor" />
                  <el-option label="访客 — 仅可浏览查看" value="viewer" />
                </el-select>
              </el-form-item>
            </div>
          </transition>

          <transition name="fade-height">
            <div v-if="!isRegister" class="flex-between">
              <el-checkbox v-model="rememberMe">{{
                t('login.rememberMe')
              }}</el-checkbox>
              <el-link
                type="primary"
                :underline="false"
                @click="onForgotPassword"
              >
                {{ t('login.forgotPassword') }}
              </el-link>
            </div>
          </transition>

          <el-form-item style="margin-top: 24px">
            <el-button
              @click="isRegister ? register() : login()"
              class="submitBtn"
              type="primary"
              :loading="loading"
            >
              <transition name="fade-slide-mini" mode="out-in">
                <span :key="isRegister ? 'register' : 'login'">{{
                  isRegister ? t('login.register') : t('login.submit')
                }}</span>
              </transition>
            </el-button>
          </el-form-item>
        </el-form>

        <div class="signupRow">
          <transition name="fade-slide-mini" mode="out-in">
            <div :key="isRegister ? 'register' : 'login'">
              {{ isRegister ? t('login.hasAccount') : t('login.noAccount') }}
              <span class="signupLink" @click="isRegister = !isRegister">
                {{ isRegister ? t('login.loginNow') : t('login.registerNow') }}
              </span>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="forgotDialogVisible"
      :title="t('login.forgotTitle')"
      width="420px"
      :show-close="true"
      center
    >
      <p class="forgotTip">{{ t('login.forgotTip') }}</p>
      <p class="forgotEmail">
        <a :href="`mailto:${t('login.forgotAdminEmail')}`">
          {{ t('login.forgotAdminEmail') }}
        </a>
      </p>
      <template #footer>
        <el-button type="primary" @click="forgotDialogVisible = false">
          {{ t('login.forgotOk') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: var(--el-bg-color, #fff);
}

@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr;
  }
}

/* ─── 左侧面板 ───────────────────────────────────────────────────────────────── */

.leftPanel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px;
  background: linear-gradient(145deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%);
  overflow: hidden;
}

@media (max-width: 1024px) {
  .leftPanel {
    display: none;
  }
}

.leftTop {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.brandMark {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(8px);
}

.brandName {
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
}

.charactersArea {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center; /* 改为 center，垂直居中 */
  justify-content: center;
  flex: 1; /* 自适应高度 */
  padding: 40px 0;
}

.leftFooter {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 24px;
}

.leftFooter a {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  text-decoration: none;
  transition: color 0.2s;
  cursor: pointer;
}

.leftFooter a:hover {
  color: rgba(255, 255, 255, 0.85);
}

.decorBlur1 {
  position: absolute;
  top: 15%;
  right: 10%;
  width: 300px;
  height: 300px;
  background: rgba(37, 99, 235, 0.2);
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
  animation: float 15s ease-in-out infinite;
}

.decorBlur2 {
  position: absolute;
  bottom: 10%;
  left: 5%;
  width: 400px;
  height: 400px;
  background: rgba(30, 64, 175, 0.25);
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  z-index: 0;
  animation: float 20s ease-in-out infinite reverse;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(30px, -50px);
  }
  66% {
    transform: translate(-20px, 40px);
  }
}

.decorGrid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 1;
}

/* ─── 右侧面板 ───────────────────────────────────────────────────────────────── */

.rightPanel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: var(--el-bg-color, #ffffff);
}

.formWrapper {
  width: 100%;
  max-width: 400px;
}

.mobileLogo {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 48px;
}

@media (max-width: 1024px) {
  .mobileLogo {
    display: flex;
  }
}

.mobileLogoIcon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.formHeader {
  text-align: center;
  margin-bottom: 40px;
}

.formTitle {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--el-text-color-primary, #0f172a);
  margin: 0 0 10px 0;
  line-height: 1.3;
}

.formSubtitle {
  font-size: 14px;
  color: var(--el-text-color-secondary, #64748b);
  margin: 0;
  line-height: 1.6;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input__wrapper) {
  height: 48px;
  background: var(--el-fill-color-light, #f8fafc) !important;
  border: 1px solid var(--el-border-color, #e2e8f0) !important;
  border-radius: 10px !important;
  box-shadow: none !important;
  transition: all 0.2s !important;
}

:deep(.el-input__wrapper:hover) {
  border-color: #3b82f6 !important;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
  background: var(--el-bg-color, #ffffff) !important;
  transform: scale(1.01);
}

.fieldLabel {
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-regular, #475569);
  margin-bottom: 6px;
  letter-spacing: 0.2px;
}

.eyeToggle {
  color: #64748b;
  cursor: pointer;
  font-size: 16px;
  transition: color 0.2s;
}

.eyeToggle:hover {
  color: var(--primary-color);
}

.submitBtn {
  width: 100%;
  height: 48px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  border-radius: 10px !important;
  background: var(--primary-color) !important;
  border: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  margin-top: 4px;
}

.submitBtn:hover {
  background: var(--primary-hover) !important;
  border-color: var(--primary-hover) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.submitBtn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.1);
}

/* ─── 动画相关 ───────────────────────────────────────────────────────────────── */

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translate3d(30px, 0, 0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translate3d(-30px, 0, 0);
}

/* 按钮与链接文字的小型切换动画 */
.fade-slide-mini-enter-active,
.fade-slide-mini-leave-active {
  transition:
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
}

.fade-slide-mini-enter-from {
  opacity: 0;
  transform: translate3d(10px, 0, 0);
}

.fade-slide-mini-leave-to {
  opacity: 0;
  transform: translate3d(-10px, 0, 0);
}

.fade-height-enter-active,
.fade-height-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 120px;
  overflow: hidden;
  will-change: max-height, opacity;
}

.fade-height-enter-from,
.fade-height-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translate3d(0, -10px, 0);
}

.signupRow {
  text-align: center;
  font-size: 13px;
  color: var(--el-text-color-secondary, #64748b);
  margin-top: 28px;
}

.signupLink {
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
}

.signupLink:hover {
  text-decoration: underline;
  color: #1d4ed8;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.forgotTip {
  font-size: 14px;
  line-height: 1.7;
  color: var(--el-text-color-regular, #475569);
  margin: 0 0 16px;
}

.forgotEmail {
  font-size: 14px;
  font-weight: 500;
  color: #2563eb;
  margin: 0;
  text-align: center;
}

.forgotEmail a {
  color: #2563eb;
  text-decoration: none;
  border-bottom: 1px dashed currentColor;
  padding-bottom: 1px;
}

.forgotEmail a:hover {
  color: #1d4ed8;
}
</style>
