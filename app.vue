<template>
  <InitLoading :show="nuxtApp.$assetsLoading.isLoading" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const nuxtApp = useNuxtApp()
onMounted(async () => {
  await nuxtApp.$assetsLoading.loadAssets()
  nuxtApp.$assetsLoading.hide()
})
</script>
<style>
body {
  font-family: 'YEFONTXiaoShiTou';
  margin: 0;
  box-sizing: border-box;
  font-size: 25px;
}
</style>
