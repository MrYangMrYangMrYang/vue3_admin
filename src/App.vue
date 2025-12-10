<script setup>
// 导入中文汉化包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>

<template>
  <div>
    <!-- 中文化：汉化 -->
    <el-config-provider :locale="zhCn">
      <!-- App.vue只需要留一个路由出口 router-view即可 -->
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<style scoped></style>
