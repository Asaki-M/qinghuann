export default defineNuxtPlugin((nuxtApp) => {
  const isLoading = ref(true)
  nuxtApp.provide('assetsLoading', {
    show: () => {
      isLoading.value = true
    },
    hide: () => {
      isLoading.value = false
    },
    loadAssets: () => {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = 'img/background.png'  // 加载本地图片
        
        image.onload = () => {
          resolve(true)  // 当图片和 CSS 都加载完时，调用 resolve
        }

        image.onerror = (event) => {
          // console.log(event)
          isLoading.value = false
          reject(event)
        }
      })
    },
    isLoading,  // 提供加载状态
  })
})