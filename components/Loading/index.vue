<template>
  <div class="loading_container" v-show="props.isLoading">
    <img :src="loadingIcon" alt="Loading" class="loading_logo">
    <div class="bounce_text_container">
      <span class="bounce_letter">L</span>
      <span class="bounce_letter">o</span>
      <span class="bounce_letter">a</span>
      <span class="bounce_letter">d</span>
      <span class="bounce_letter">i</span>
      <span class="bounce_letter">n</span>
      <span class="bounce_letter">g</span>
      <span class="bounce_letter">.</span>
      <span class="bounce_letter">.</span>
      <span class="bounce_letter">.</span>
    </div>
  </div>
  <div v-show="!props.isLoading">
    <slot></slot>
  </div>
</template>

<script setup>
import { loadingIcon } from './loading-icon';
// TODO: use props loading message

const props = defineProps(['isLoading'])
</script>

<style scoped lang='scss'>
.loading_container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .loading_logo {
    width: 80px;
    height: 80px;
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.bounce_letter {
  display: inline-block;
  font-size: 20px;
  color: #5698c3;
  animation: bounce 1s infinite;
  animation-fill-mode: both;

  @for $i from 2 through 10 {
    &:nth-child(#{$i}) {
      animation-delay: #{($i - 1) * 0.1}s; // 每个元素延迟 0.1 秒
    }
  }
}
</style>