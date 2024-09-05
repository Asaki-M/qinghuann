<template>
  <div class="navigator-container">
    <div class="navigator-item" :class="{ active: currentActiveLink === 'index' }">
      <NuxtLink to="/">首页</NuxtLink>
    </div>
    <div class="navigator-item" :class="{ active: currentActiveLink === 'blog' }">
      <NuxtLink to="/blog">博客</NuxtLink>
    </div>
    <div class="navigator-item" :class="{ active: currentActiveLink === 'tool' }">
      <NuxtLink to="/tool">开发工具</NuxtLink>
    </div>
    <div class="navigator-item" :class="{ active: currentActiveLink === '3d-printing' }">
      <NuxtLink to="/3d-printing">3D打印</NuxtLink>
    </div>
    <div class="navigator-item" :class="{ active: currentActiveLink === 'daily' }">
      <NuxtLink to="/daily">日常</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const currentActiveLink = ref(route.name)

</script>

<style lang="scss" scoped>
.navigator-container {
  width: 100vw;
  height: 5vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .navigator-item {
    height: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    transition: all .3s;

    border-radius: 8px;

    &.active {
      background-color: rgba($color: #5698c3, $alpha: 0.07);
    }

    .router-link-active {
      color: #5698c3;
    }

    &:hover {
      background-color: rgba($color: #000000, $alpha: 0.07);
    }

    a {
      text-decoration: none;
      color: #434470;
    }
  }
}
</style>