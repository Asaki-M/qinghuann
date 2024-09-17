<template>
  <div class="navigator-container">
    <NuxtLink class="navigator-item" :class="{ active: isActive(item.path) }" :to="item.path"
      v-for="item in routesConfig" :key="item.path">{{ item.name }}</NuxtLink>
  </div>
</template>

<script setup>
const routesConfig = [
  {
    path: '/',
    name: '首页'
  },
  {
    path: '/blog',
    name: '博客'
  },
  // {
  //   path: '/tool',
  //   name: '工具'
  // },
  {
    path: '/3d-printing',
    name: '3D打印'
  },
  // {
  //   path: '/daily',
  //   name: '日常'
  // },
]
const route = useRoute()


const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
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

    &.router-link-active,
    &.active {
      color: #5698c3;
      background-color: rgba($color: #5698c3, $alpha: 0.07);
    }

    &:hover {
      background-color: rgba($color: #000000, $alpha: 0.07);
    }
  }
}
</style>