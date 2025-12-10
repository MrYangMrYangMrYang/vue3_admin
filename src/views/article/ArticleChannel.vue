<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import ChannelEdit from './components/ChannelEdit.vue'

// 获取文章分类列表
const channelList = ref([])
const loading = ref(false) //定义加载开启阀门
const getChannelList = async () => {
  // 开启加载动画
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  // 关闭加载动画
  loading.value = false
}
getChannelList()

// 通过ref标识获取子组件实例
const dialog = ref()
// 编辑文章分类
const onEditChannel = (row) => {
  dialog.value.open(row)
}
// 添加文章分类
const onAddChannel = () => {
  dialog.value.open({})
}
// 删除文章分类
const onDelChannel = async (row) => {
  await ElMessageBox.confirm('你确认要删除该分类么', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}

// 监听子组件提交的事件函数是否触发，成功的话重新渲染页面
const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <!-- 封装的通用框架子组件 -->
  <page-container title="文章分类">
    <!-- 具名插槽显示的按钮 -->
    <template #extra>
      <el-button @click="onAddChannel" type="primary">添加分类</el-button>
    </template>

    <!-- 以下为默认插槽显示的内容 -->
    <!-- 封装的dialog 子组件 -->
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>

    <!-- Table 组件显示内容 -->
    <!-- 加载动画：自定义指令 v-loading，只需要绑定 boolean 值即可 -->
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <!-- Table-column 组件的自定义列内容 -->
      <el-table-column label="操作" width="150">
        <!-- Table-column 组件可以通过作用域插槽获取到 row, column, $index 和 store（table 内部的状态管理）的数据 -->
        <!-- row 就是 channelList 的每一项， $index 下标 -->
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row, $index)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>

      <!-- 非空判断 -->
      <!-- Table 组件的插槽名为empty时(数据为空时)可以自定义空内容 -->
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
  </page-container>
</template>

<style lang="scss" scoped></style>
