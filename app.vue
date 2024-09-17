<template>
  <InitLoading :show="nuxtApp.$assetsLoading.isLoading" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const nuxtApp = useNuxtApp()
onMounted(async () => {
  nuxtApp.$assetsLoading.show()
  try {
    await nuxtApp.$assetsLoading.loadAssets()
  } catch (error) {
    // console.log(error)
  }
  setTimeout(() => {
    nuxtApp.$assetsLoading.hide()
  }, 300)
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
