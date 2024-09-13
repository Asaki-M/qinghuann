<template>
  <div class="background_container"></div>
  <div class="container">
    <img src="/img/error-page-icon.png" alt="">
    <template v-if="error.statusCode !== 404">
      <p>页面报错了</p>
      <p>请联系开发者 qinghuanhu@gmail.com</p>
    </template>
    <template v-if="error.statusCode === 404">
      <p>你进入到了未定义的页面</p>
      <NuxtLink to="/" class="back_to_home">快回到首页</NuxtLink>
    </template>
    
  </div>
</template>

<script setup>
const props = defineProps(['error'])
const error = reactive(props.error)

console.info(`%c[Nuxt runtime error message: ${error.message}]`, 'color: red; font-size: 16px; font-weight: bold')
</script>

<style scoped lang='scss'>
.background_container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -99;
  background: url('/img/error-page-bg.jpg') no-repeat;
  background-size: cover;
  opacity: 0.2;
}
.container {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  .back_to_home {
    color: #5698c3;
    transition: all 0.15s;
    &:hover {
      color: lighten($color: #5698c3, $amount: 10);
    }
  }
}
</style>