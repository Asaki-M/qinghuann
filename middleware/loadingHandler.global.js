export default defineNuxtRouteMiddleware((to, from) => {
  const loadingComplete = ref(false); // 用于追踪加载状态

  // const loadAssets = () => {
  //   return new Promise((resolve) => {
  //     // 加载字体和图片
  //     // const font = new FontFace('YourFontName', 'url(/path-to-your-font-file.woff2)');
  //     const image = new Image();
  //     image.src = '~/assets/background.png';

  //     // font.load().then(() => {
  //     //   document.fonts.add(font);
  //     //   console.log('Font loaded');
  //     // });

  //     image.onload = () => {
  //       console.log('Image loaded');
  //       resolve(true); // 图片加载完毕后 resolve
  //     };
  //   });
  // };

  // // 在导航前加载字体和背景图片
  // return loadAssets().then(() => {
  //   loadingComplete.value = true;
  //   console.log('Assets loaded successfully');
  // });
});