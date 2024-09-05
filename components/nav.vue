<template>
  <div class="navigator-container">
    <NuxtLink class="navigator-item" to="/">首页</NuxtLink>
    <NuxtLink class="navigator-item" to="/blog">博客</NuxtLink>
    <NuxtLink class="navigator-item" to="/tool">开发工具</NuxtLink>
    <NuxtLink class="navigator-item" to="/3d-printing">3D打印</NuxtLink>
    <NuxtLink class="navigator-item" to="/daily">日常</NuxtLink>
  </div>
</template>

<script setup>

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
    text-decoration: none;
    color: #434470;

    &.router-link-active {
      color: #5698c3;
      background-color: rgba($color: #5698c3, $alpha: 0.07);
    }

    &:hover {
      background-color: rgba($color: #000000, $alpha: 0.07);
    }
  }
}
</style>