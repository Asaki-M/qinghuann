export default defineNuxtPlugin((nuxtApp) => {
  const isLoading = ref(false)
  nuxtApp.provide('assetsLoading', {
    hide: () => {
      isLoading.value = false
    },
    loadAssets: () => {
      return new Promise((resolve) => {
        const image = new Image()
        image.src = 'img/background.png'  // 加载本地图片

        if(image.complete) {
          isLoading.value = false
          resolve(true)
        } else {
          isLoading.value = true
        }
        image.onload = () => {
          resolve(true)  // 当图片和 CSS 都加载完时，调用 resolve
        }
      })
    },
    isLoading,  // 提供加载状态
  })
})