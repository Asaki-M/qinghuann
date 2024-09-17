<template>
  <NuxtImg :src="src" :alt="alt" :width="width" :height="height" class="zoomable" />
</template>

<script setup>
import mediumZoom from 'medium-zoom'

const props = defineProps({
  src: String,
  alt: String,
  width: [String, Number],
  height: [String, Number]
})

onMounted(() => {
  // 在客户端阶段初始化图片的放大功能
  mediumZoom('.zoomable', {
    margin: 24,
    background: '#00000026'
  })
})
</script>

<style scoped lang='scss'></style>