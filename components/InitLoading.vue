<template>
  <div v-show="isShow" class="container">
    <img :src="loadingIcon" class="loading_icon" alt="Loading..." />
    <div class="progress_container">
      <UProgress animation="carousel" color="sky" />
    </div>
  </div>
</template>

<script setup>
import { loadingIcon } from './Loading/loading-icon';
const props = defineProps(['show'])
const isShow = ref(props.show)
const stopWatchShow = watchEffect(() => {
  isShow.value = props.show.value
})

onUnmounted(() => {
  stopWatchShow()
})
</script>

<style scoped lang='scss'>
.container {
  max-width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .loading_icon {
    width: 95px;
    height: 95px;
  }
  .progress_container {
    width: 50%;
  }
}
</style>