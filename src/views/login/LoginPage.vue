<script setup>
/**
 * 登录与注册页面组件
 * 包含：
 * 1. 登录与注册模式切换
 * 2. 表单校验（用户名、密码、确认密码）
 * 3. 记住我功能（使用 localStorage）
 * 4. 动态背景与人物交互动画
 */
import { userRegisterService, userLoginService } from '@/api/user.js'
import { User, Lock, View, Hide } from '@element-plus/icons-vue'
import { ref, watch, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import AnimatedCharacters from '@/components/AnimatedCharacters.vue'

// --- 数据定义 ---
const formModel = ref({ username: '', password: '', repassword: '' })
const rememberMe = ref(false) // 记住我复选框状态

// 动画状态控制
const isTyping = ref(false) // 是否正在输入密码（触发对视动画）
const showPassword = ref(false) // 是否明文显示密码（触发偷看动画）
const passwordLength = computed(() => formModel.value.password.length)

// --- 生命周期 ---
onMounted(() => {
  // 页面加载时，尝试获取记住的用户名
  const savedUsername = localStorage.getItem('big-event-username')
  if (savedUsername) {
    formModel.value.username = savedUsername
    rememberMe.value = true
  }
})

// --- 表单校验规则 ---
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: 2,
      max: 7,
      pattern: /^\S{2,7}$/,
      message: '用户名必须是2-7位的非空字符',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    },
    {
      // 自定义校验器：匹配两次输入密码是否一致
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const form = ref() // 表单 DOM 引用
const isRegister = ref(false) // 当前是否为注册模式
const loading = ref(false) // 提交按钮加载状态

// --- 逻辑方法 ---

/**
 * 注册逻辑
 */
const register = async () => {
  try {
    await form.value.validate()
    loading.value = true
    await userRegisterService(formModel.value)
    ElMessage.success('注册成功')
    isRegister.value = false // 注册成功后自动切换到登录模式
  } catch {
    // 校验失败或接口报错
  } finally {
    loading.value = false
  }
}

const userStore = useUserStore()
const router = useRouter()

/**
 * 登录逻辑
 */
const login = async () => {
  try {
    await form.value.validate()
    loading.value = true
    const res = await userLoginService(formModel.value)

    // 存储 Token 到 Pinia
    userStore.setToken(res.data.token)

    // 处理“记住我”本地存储逻辑
    if (rememberMe.value) {
      localStorage.setItem('big-event-username', formModel.value.username)
    } else {
      localStorage.removeItem('big-event-username')
    }

    ElMessage.success('登录成功')
    router.push('/') // 跳转到后台主页
  } catch {
    // 登录失败处理
  } finally {
    loading.value = false
  }
}

/**
 * 切换模式时重置表单内容和校验状态
 */
watch(isRegister, () => {
  form.value.resetFields()
})

/**
 * 密码框聚焦处理，用于触发交互动画
 */
const onPasswordFocus = () => {
  isTyping.value = true
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
        <a href="#">帮助中心</a>
        <a href="#">隐私政策</a>
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
          <span>大事件管理系统</span>
        </div>

        <div class="formHeader">
          <transition name="fade-slide" mode="out-in">
            <div :key="isRegister">
              <h1 class="formTitle">
                {{ isRegister ? '创建新账号' : '登录到工作台' }}
              </h1>
              <p class="formSubtitle">
                {{
                  isRegister
                    ? '加入我们，管理您的精彩事件'
                    : '接入大事件管理系统'
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
          <div class="fieldLabel">账号</div>
          <el-form-item prop="username">
            <el-input
              v-model="formModel.username"
              :prefix-icon="User"
              placeholder="输入您的用户名"
            ></el-input>
          </el-form-item>

          <div class="fieldLabel">密码</div>
          <el-form-item prop="password">
            <el-input
              v-model="formModel.password"
              :prefix-icon="Lock"
              :type="showPassword ? 'text' : 'password'"
              placeholder="输入您的密码"
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
              <div class="fieldLabel">确认密码</div>
              <el-form-item prop="repassword">
                <el-input
                  v-model="formModel.repassword"
                  :prefix-icon="Lock"
                  type="password"
                  placeholder="请再次输入密码"
                  @focus="isTyping = true"
                  @blur="isTyping = false"
                ></el-input>
              </el-form-item>
            </div>
          </transition>

          <transition name="fade-height">
            <div v-if="!isRegister" class="flex-between">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
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
                <span :key="isRegister">{{
                  isRegister ? '注册' : '登录'
                }}</span>
              </transition>
            </el-button>
          </el-form-item>
        </el-form>

        <div class="signupRow">
          <transition name="fade-slide-mini" mode="out-in">
            <div :key="isRegister">
              {{ isRegister ? '已有账号？' : '暂无账号？' }}
              <span class="signupLink" @click="isRegister = !isRegister">
                {{ isRegister ? '立即登录' : '立即注册' }}
              </span>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: #fff;
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
  background: #ffffff;
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
  color: #0f172a;
  margin: 0 0 10px 0;
  line-height: 1.3;
}

.formSubtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input__wrapper) {
  height: 48px;
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
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
  background: #ffffff !important;
  transform: scale(1.01);
}

.fieldLabel {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
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
  color: #64748b;
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
</style>
