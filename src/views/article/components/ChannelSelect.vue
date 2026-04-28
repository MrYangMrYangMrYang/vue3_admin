<!-- 局部组件：文章分类的下拉菜单子组件(select 组件)  -->
<script setup>
/**
 * 文章分类下拉选择组件
 * 用于在表单中选择文章分类，支持双向绑定
 */
import { artGetChannelsService } from '@/api/article.js'
import { ref } from 'vue'

// 定义组件接收的属性
defineProps({
  // 双向绑定的值
  modelValue: {
    type: [Number, String]
  },
  // 下拉框宽度
  width: {
    type: String
  }
})

// 定义组件向外提交的事件
const emit = defineEmits(['update:modelValue'])

const channelList = ref([]) // 分类列表数据

/**
 * 获取文章分类列表
 */
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
}
getChannelList()
</script>

<template>
  <!-- 子组件的:modelValue设置为父组件传下来的值，但不能绑定该值，因为子组件不能修改父组件的值
        @update:modelValue 当子组件的值需要发生改变时触发，传递给父组件让其进行修改 -->
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width }"
  >
    <!--  label 展示给用户看的，value 收集起来提交给后台的 -->
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>
