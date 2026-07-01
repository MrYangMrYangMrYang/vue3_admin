<script setup lang="ts">
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'
import { ArticleChannel } from '@/types'

defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

const channelList = ref<ArticleChannel[]>([])

const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data
}
getChannelList()
</script>

<template>
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width }"
  >
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>
