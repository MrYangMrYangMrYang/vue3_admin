<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { ref } from 'vue'
import router from '@/router'

const isLoading = ref(false)

router.beforeEach(() => {
  isLoading.value = true
})

router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})
</script>

<template>
  <div>
    <div v-show="isLoading" class="router-loading-bar"></div>
    <el-config-provider :locale="zhCn">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<style scoped>
.router-loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(
    90deg,
    #409eff,
    #67c23a,
    #e6a23c,
    #f56c6c,
    #409eff
  );
  background-size: 200% 100%;
  animation: loading-gradient 1.5s ease infinite;
  z-index: 9999;
}

@keyframes loading-gradient {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}
</style>
